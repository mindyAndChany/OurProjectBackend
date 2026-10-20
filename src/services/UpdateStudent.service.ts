import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '../models/student.model.js';
import { ClassModel } from '../models/class.model.js';

/** נרמול לצורך השוואה: בלי ניקוד, גרשיים, פיסוק ורווחים מיותרים, אותיות קטנות. */
function normalizeName(value: string): string {
  return String(value)
    .normalize('NFKD')
    .replace(/[֑-ׇ]/g, '')
    .replace(/["'`׳״’‘]/g, '')
    .replace(/[.,;:\-–—_/\\()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** האם השם נראה כמו כיתה קודש (כולל ספרה, לדוגמה "ז׳1") ולא כמו התמחות? */
function isClassLikeName(value: string): boolean {
  const s = String(value).trim();
  return /[0-9]/.test(s) || /^[א-ת]["׳״']?[א-ת]$/.test(s);
}

/** חיפוש לפי מילת מפתח בין שמות קיימים; מחזיר מועמד יחיד או רשימת מועמדים סתומה. */
function keywordMatches(requested: string, pool: string[]): string[] {
  const q = normalizeName(requested);
  if (!q) return [];
  const qTokens = q.split(' ').filter((t) => t.length > 1);
  if (qTokens.length === 0 && q.length < 2) return [];

  const scored = pool.map((name) => {
    const n = normalizeName(name);
    let score = 0;
    if (n === q) score = 100;
    else if (n.includes(q)) score = 90 - (n.length - q.length) * 0.1;
    else if (q.includes(n)) score = 80;
    else {
      const nTokens = n.split(' ');
      const common = qTokens.filter((t) => nTokens.some((nt) => nt.includes(t) || t.includes(nt)));
      if (common.length > 0) score = 40 + common.length * 10 - nTokens.length;
    }
    return { name, score };
  });
  const best = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  if (best.length === 0) return [];
  const bestScore = best[0]?.score ?? 0;
  const top = best.filter((s) => s.score >= bestScore - 15);
  return top.length === 1 ? [top[0]!.name] : top.slice(0, 5).map((s) => s.name);
}

@Injectable()
export class UpdateStudentService {
  constructor(
    @InjectModel(Student)
    private studentModel: typeof Student,
  ) {}

  private allowedFields = [
    'id_number', 'registration_year', 'paid_amount', 'payment_status', 'serial_number', 'class_kodesh', 'is_graduate',
    'last_name', 'first_name', 'nickname', 'birthdate_hebrew', 'birthdate_gregorian', 'address',
    'zipcode', 'father_name_he', 'father_mobile_he', 'mother_name_he','mother_mobile_he',
    'track', 'track2', 'track3', 'marital_status', 'class_teaching', 'bookshelf', 'notes',
    'perach', 'external_mother', 'external_father', 'birth_country', 'married_date',
    'married_name', 'personal_mobile', 'trend', 'chetz', 'phone', 'payment_method','photo_url'
  ];

  private booleanMap(val: any) {
    if (val === undefined || val === null) return val;
    if (typeof val === 'boolean') return val;
    const s = String(val).trim().toLowerCase();
    if (['true','t','1','yes','y','x'].includes(s)) return true;
    if (['false','f','0','no','n',''].includes(s)) return false;
    return val;
  }

  async updateByIdNumber(idNumber: string, input: Record<string, any>) {
    if (!idNumber) throw new BadRequestException('id parameter required');
    const sId = String(idNumber).trim().replace(/\D/g, '');
    if (sId === '') throw new BadRequestException('invalid id_number');

    if (!input || typeof input !== 'object') throw new BadRequestException('Request body must be an object');

    const data: Record<string, any> = {};
    for (const key of this.allowedFields) {
      if (key in input) data[key] = input[key];
    }

    // Normalize numeric-like fields
    const numericFields = ['registration_year', 'paid_amount'];
    for (const f of numericFields) {
      if (f in data) {
        const raw = String(data[f]).trim();
        const n = Number(raw.replace(/[^0-9.-]/g, ''));
        if (raw === '' || Number.isNaN(n)) {
          delete data[f];
        } else {
          data[f] = n;
        }
      }
    }

    // id_number normalization and uniqueness check
    if ('id_number' in data) {
      const s = String(data.id_number).trim().replace(/\D/g, '');
      if (s === '') {
        delete data.id_number;
      } else {
        data.id_number = s;
        const exists = await this.studentModel.findOne({ where: { id_number: data.id_number } });
        if (exists && String(exists.id_number) !== sId) {
          throw new ConflictException(`Student with id_number ${data.id_number} already exists`);
        }
      }
    }

    // Boolean normalization
    for (const f of ['perach', 'chetz', 'is_graduate']) {
      if (f in data) data[f] = this.booleanMap(data[f]);
    }

    // Date fields normalization: remove if invalid
    for (const f of ['birthdate_gregorian', 'married_date']) {
      if (f in data) {
        const d = new Date(data[f]);
        if (isNaN(d.getTime())) {
          delete data[f];
        } else {
          data[f] = d;
        }
      }
    }

    // מפתחות זרים (classes.name): התאמה מדויקת, ואם אין — השלמה לפי מילת מפתח
    const fkFields = ['class_kodesh', 'track', 'track2', 'track3'];
    const requestedFk = fkFields.filter((f) => typeof data[f] === 'string' && data[f] !== '');
    if (requestedFk.length > 0) {
      const classes = await ClassModel.findAll({ attributes: ['name'], raw: true });
      const knownNames: string[] = classes.map((c: any) => String(c.name)).filter(Boolean);
      const knownByNorm = new Map(knownNames.map((n) => [normalizeName(n), n]));
      const missing: string[] = [];

      for (const f of requestedFk) {
        const value = data[f] as string;
        const exact = knownByNorm.get(normalizeName(value));
        if (exact) {
          data[f] = exact;
          continue;
        }
        const sameKind = knownNames.filter((n) => isClassLikeName(n) === isClassLikeName(value));
        const candidates = keywordMatches(value, sameKind.length > 0 ? sameKind : knownNames);
        if (candidates.length === 1) {
          console.warn(`FK value "${value}" (${f}) matched to "${candidates[0]}" on update`);
          data[f] = candidates[0];
        } else {
          missing.push(candidates.length > 1
            ? `${value} (אפשרויות: ${candidates.join(', ')})`
            : value);
        }
      }

      if (missing.length > 0) {
        throw new BadRequestException(`כיתה/התמחות לא קיימת במערכת: ${missing.join(', ')}`);
      }
    }

    // Nothing to update
    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No valid fields provided to update');
    }

    const student = await this.studentModel.findOne({ where: { id_number: sId } });
    if (!student) throw new NotFoundException(`Student with id_number ${sId} not found`);

    try {
      await student.update(data);
      return student.get({ plain: true });
    } catch (err: any) {
      console.error('Failed to update student:', err);
      throw new BadRequestException('Failed to update student: ' + (err?.message || err));
    }
  }
}
