import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Student } from '../models/student.model.js';
import { ClassModel } from '../models/class.model.js';

/**
 * המרת ערך תאריך ל-Date. תומך גם בפורמט ישראלי dd/mm/yyyy ו-dd.mm.yyyy,
 * מפני ש-`new Date` מפרש נכון רק את הראשון.
 */
function toDate(value: any): Date | null {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;

  const raw = String(value).trim();
  if (raw === '') return null;

  // dd/mm/yyyy או dd.mm.yyyy (או dd-mm-yyyy)
  const match = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
  if (match) {
    const [, d, m, y] = match as [string, string, string, string];
    const year = y.length === 2 ? Number(y) + 2000 : Number(y);
    const date = new Date(year, Number(m) - 1, Number(d));
    // בדיקת תקינות: Date מתגלגל על תאריך לא קיים (כגון 31/02)
    if (date.getFullYear() === year && date.getMonth() === Number(m) - 1 && date.getDate() === Number(d)) {
      return date;
    }
    return null;
  }

  // תאריכים שמייצגים מספר סריאלי של אקסל (למשל 45292)
  if (/^\d{5}$/.test(raw)) {
    const excelEpoch = Date.UTC(1899, 11, 30);
    const date = new Date(excelEpoch + Number(raw) * 86400000);
    return isNaN(date.getTime()) ? null : date;
  }

  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

/** נרמול לצורך השוואה: בלי ניקוד, גרשיים, פיסוק ורווחים מיותרים, אותיות קטנות. */
function normalizeName(value: string): string {
  return String(value)
    .normalize('NFKD')
    .replace(/[֑-ׇ]/g, '')       // ניקוד וטעמים
    .replace(/["'`׳״’‘]/g, '')              // גרשיים מכל הסוגים
    .replace(/[.,;:\-–—_/\\()]/g, ' ')      // פיסוק
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** האם השם נראה כמו כיתה קודש (כולל ספרה, לדוגמה "ז׳1") ולא כמו התמחות? */
function isClassLikeName(value: string): boolean {
  const s = String(value).trim();
  return /[0-9]/.test(s) || /^[א-ת]["׳״']?[א-ת]$/.test(s);
}

/** האם שני השמות מאותו סוג (שניהם כיתה קודש או שניהם התמחות)? */
function isSameKind(candidate: string, requested: string): boolean {
  return isClassLikeName(candidate) === isClassLikeName(requested);
}

/**
 * חיפוש לפי מילת מפתח: מחזיר את השמות הקיימים שהכי מתאימים לערך החופשי.
 * עדיפות: תת-מחרוזת מלאה (הבקשה בתוך השם או ההפך), אחר כך חפיפת מילים,
 * ואם אין — שם שנמצא במרחק עריכה קטן מאוד.
 */
function keywordMatches(requested: string, pool: string[]): string[] {
  const q = normalizeName(requested);
  if (!q) return [];
  const qTokens = q.split(' ').filter((t) => t.length > 1);
  // מילה בודדת (למשל "תכנות") עדיין נחשבת מילת מפתח
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
    return { name, score, distance: levenshtein(q, n) };
  });

  const best = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  const bestScore = best[0]?.score ?? 0;
  if (best.length > 0) {
    // אם כמה מועמדים צמודים ברמה גבוהה — לא מנחשים
    const top = best.filter((s) => s.score >= bestScore - 15);
    return top.length === 1 ? [top[0]!.name] : top.slice(0, 5).map((s) => s.name);
  }

  // גיבוי: טעות הקלדה קטנה (עד 25% מהאורך) — רק מועמד יחיד
  const close = scored
    .filter((s) => s.distance <= Math.max(1, Math.floor(q.length * 0.25)))
    .sort((a, b) => a.distance - b.distance);
  return close.length === 1 ? [close[0]!.name] : [];
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i as number);
  for (let i = 1; i <= a.length; i++) {
    const curr: number[] = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        (prev[j] ?? 0) + 1,
        (curr[j - 1] ?? 0) + 1,
        (prev[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = curr;
  }
  return prev[b.length] ?? 0;
}

@Injectable()
export class AddStudentService {
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

  /**
   * מתאים ערכי מפתח זר לשמות הקיימים ב-classes.
   * שלב 1: התאמה מדויקת (או "זהה" אחרי נרמול רווחים/גרשיים/אותיות).
   * שלב 2: אם אין התאמה — חיפוש לפי מילת מפתח: ערכים שהם תת-מחרוזת של שם קיים
   *        (למשל "תכנות" -> "תכנות מתקדם") או הכי דומה לו.
   * הערכים המתאימים נכתבים חזרה ל-data; כל האחרים מוחזרים ב-missing.
   */
  async matchForeignKeyValues(
    data: Record<string, any>,
    fields: readonly string[],
  ): Promise<{ missing: string[]; resolved: Record<string, string>; ambiguous: string[] }> {
    const requested = fields
      .map((f) => ({ field: f, value: data[f] }))
      .filter((x): x is { field: string; value: string } => typeof x.value === 'string' && x.value !== '');

    const resolved: Record<string, string> = {};
    const missing: string[] = [];
    const ambiguous: string[] = [];
    if (requested.length === 0) return { missing, resolved, ambiguous };

    const classes = await ClassModel.findAll({ attributes: ['name'], raw: true });
    const knownNames: string[] = classes.map((c: any) => String(c.name)).filter(Boolean);
    const knownByNorm = new Map<string, string>();
    for (const name of knownNames) knownByNorm.set(normalizeName(name), name);

    for (const { field, value } of requested) {
      const exact = knownByNorm.get(normalizeName(value));
      if (exact) {
        data[field] = exact;
        resolved[field] = exact;
        continue;
      }

      // חיפוש לפי מילת מפתח: קודם רק בין שמות מאותו "סוג" (כיתה/התמחות),
      // ואם שם לא נמצא — בכל השמות
      const matchedNames = new Set<string>();
      for (const pool of [knownNames.filter((name) => isSameKind(name, value)), knownNames]) {
        for (const name of keywordMatches(value, pool)) matchedNames.add(name);
        if (matchedNames.size > 0) break;
      }
      const candidates = [...matchedNames];

      if (candidates.length === 1) {
        const chosen = candidates[0] as string;
        console.warn(`FK value "${value}" (${field}) not found exactly; matched to "${chosen}"`);
        data[field] = chosen;
        resolved[field] = chosen;
      } else if (candidates.length > 1) {
        // כמה התאמות אפשריות — לא מנחשים
        ambiguous.push(`${value} (אפשרויות: ${candidates.slice(0, 5).join(', ')})`);
        missing.push(value);
      } else {
        missing.push(value);
      }
    }

    return { missing, resolved, ambiguous };
  }

  async addStudent(input: Record<string, any>) {
    console.log("start service");
    
    const data: Record<string, any> = {};

    for (const key of this.allowedFields) {
      if (key in input) {
        const value = input[key];
        data[key] = typeof value === 'string'
          // הסרת תווי כיווניות נסתרים (LRM/RLM/embedding) ורווחים מיותרים
          ? value.replace(/[‎‏‪-‮]/g, '').trim()
          : value;
      }
    }

    // Sanitize/normalize fields to avoid DB type errors
    const booleanMap = (val: any) => {
      if (val === undefined || val === null) return val;
      if (typeof val === 'boolean') return val;
      const s = String(val).trim().toLowerCase();
      if (['true','t','1','yes','y','x','כן'].includes(s)) return true;
      if (['false','f','0','no','n','','לא'].includes(s)) return false;
      // ערך לא-מזוהה: זורקים שגיאה ברורה במקום להפיל את ה-INSERT על Type BOOLEAN
      throw new BadRequestException(
        `ערך לא תקין בשדה בוליאני: "${val}" (יש להשתמש בכן/לא או true/false)`,
      );
    };

    // Coerce numeric-like fields; drop them if invalid to prevent "invalid input syntax" DB errors
    const numericFields = ['registration_year', 'paid_amount'];
    for (const f of numericFields) {
      if (f in data) {
        const raw = String(data[f]).trim();
        const n = Number(raw.replace(/[^0-9.-]/g, ''));
        if (raw === '' || Number.isNaN(n)) {
          delete data[f];
          console.warn(`Dropped field ${f} due to invalid numeric value:`, raw);
        } else {
          data[f] = n;
        }
      }
    }

    // `id_number` should be stored as a string in DB; sanitize to digits-only string and drop if empty
    if ('id_number' in data) {
      const rawId = data.id_number;
      const s = String(rawId).trim().replace(/\D/g, '');
      if (s === '') {
        delete data.id_number;
        console.warn('Dropped field id_number due to invalid value:', rawId);
      } else {
        data.id_number = s;
      }
    }

    // Boolean fields normalization
    for (const f of ['perach', 'chetz', 'is_graduate']) {
      if (f in data) data[f] = booleanMap(data[f]);
    }

    // Date fields normalization: convert to Date, or drop (with a warning) if invalid
    for (const f of ['birthdate_gregorian', 'married_date']) {
      if (f in data && data[f] !== '' && data[f] !== null) {
        const d = toDate(data[f]);
        if (!d) {
          delete data[f];
          console.warn(`Dropped field ${f} due to invalid date:`, data[f]);
        } else {
          data[f] = d;
        }
      }
    }

    if (!data.first_name || !data.last_name) {
      throw new BadRequestException('Missing required fields: first_name or last_name');
    }

    // ולידציה והשלמה של מפתחות זרים (classes.name):
    // ערך מדויק מתקבל כמו שהוא; ערך קרוב (רווחים/גרשיים שונים, אות גדולה) מתוקן;
    // ואם לא נמצא התאמה מדויקת — מחפשים מילת מפתח ומשלימים לשם הקרוב ביותר.
    const fkFields = ['class_kodesh', 'track', 'track2', 'track3'] as const;
    const matched = await this.matchForeignKeyValues(data, fkFields);
    if (matched.missing.length > 0) {
      throw new BadRequestException(
        `כיתה/התמחות לא קיימת במערכת: ${[...new Set(matched.missing)].join(', ')}`,
      );
    }

    // If id_number provided, ensure it is unique before attempting insert to give a friendly error
    if (data.id_number !== undefined && data.id_number !== null) {
      const exists = await this.studentModel.findOne({ where: { id_number: data.id_number } });
      if (exists) {
        console.warn(`Duplicate id_number prevented: ${data.id_number}`);
        throw new ConflictException(`Student with id_number ${data.id_number} already exists`);
      }
    }

    try {
      const created = await this.studentModel.create(data);
      console.log("student added", data.last_name);
      return created.get({ plain: true });
    } catch (err: any) {
      // שגיאות שהועלו במכוון (למשל כפילות ת.ז) מועברות כמו שהן
      if (err instanceof ConflictException || err instanceof BadRequestException) {
        throw err;
      }

      const name = err?.name ?? '';
      const isFk =
        name === 'SequelizeForeignKeyConstraintError' ||
        name === 'ForeignKeyConstraintError' ||
        err?.parent?.code === '23503';

      if (isFk) {
        // טיפול ב-FK שלא זוהה מראש (למשל מגבלה שהוגדרה ידנית ב-DB): מנסים
        // להשלים את כיתה/התמחות שוב, ואם עדיין נכשל — מחזירים הודעה ברורה
        // עם השדה והערך הבעייתיים, במקום "insert or update violates...".
        console.warn('Foreign key constraint hit on insert — retrying FK matching', err?.parent?.detail);
        const retry = await this.matchForeignKeyValues(data, fkFields);
        if (retry.missing.length === 0) {
          try {
            const created = await this.studentModel.create(data);
            console.log('student added after FK completion', data.last_name);
            return created.get({ plain: true });
          } catch (retryErr: any) {
            console.error('Retry after FK completion failed:', retryErr?.message);
          }
        }
        const detail = retry.missing.length > 0
          ? `: ${[...new Set(retry.missing)].join(', ')}`
          : '';
        const hint = retry.ambiguous.length > 0
          ? ` (נמצאו כמה התמחויות דומות — ${retry.ambiguous.join('; ')})`
          : '';
        throw new BadRequestException(
          `כיתה/התמחות לא קיימת במערכת${detail}${hint}. יש לבחור ערך מהרשימה הקיימת.`,
        );
      }

      console.error('Failed to create student:', {
        name: err?.name,
        message: err?.message,
        detail: err?.parent?.detail,
        constraint: err?.parent?.constraint,
        id_number: data.id_number,
      });

      // הודעת שגיאה קריאה למשתמשת, בלי ה-SQL הארוך
      let message = err?.message || String(err);

      if (name === 'SequelizeValidationError' || name === 'ValidationError') {
        const paths = (err?.errors || []).map((e: any) => e?.path).filter(Boolean);
        message = `ערך לא תקין בשדות: ${[...new Set(paths)].join(', ') || message}`;
      } else if (name === 'SequelizeUniqueConstraintError' || name === 'UniqueConstraintError') {
        message = 'רשומה כפולה — ייתכן שמספר הזהות כבר קיים';
      }

      throw new BadRequestException(`Failed to create student: ${message}`);
    }
  }
}
