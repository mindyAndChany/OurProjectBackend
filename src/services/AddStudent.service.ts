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

@Injectable()
export class AddStudentService {
  constructor(
    @InjectModel(Student)
    private studentModel: typeof Student,
  ) {}

  private allowedFields = [
    'id_number', 'paid_amount', 'payment_status', 'serial_number', 'class_kodesh', 'is_graduate',
    'last_name', 'first_name', 'nickname', 'birthdate_hebrew', 'birthdate_gregorian', 'address',
    'zipcode', 'father_name_he', 'father_mobile_he', 'mother_name_he','mother_mobile_he',
    'track', 'track2', 'track3', 'marital_status', 'class_teaching', 'bookshelf', 'notes',
    'perach', 'external_mother', 'external_father', 'birth_country', 'married_date',
    'married_name', 'personal_mobile', 'trend', 'chetz', 'phone', 'payment_method','photo_url'
  ];

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

    // ולידציה של מפתחות זרים: הכיתה/התמחות חייבת להתקיים בטבלת classes
    const fkFields = ['class_kodesh', 'track', 'track2', 'track3'] as const;
    const presentFkValues = fkFields
      .map((f) => data[f])
      .filter((v): v is string => typeof v === 'string' && v !== '');

    if (presentFkValues.length > 0) {
      const existing = await ClassModel.findAll({
        where: { name: { [Op.in]: presentFkValues } },
        attributes: ['name'],
        raw: true,
      });
      const known = new Set(existing.map((c: any) => c.name));
      const missing = presentFkValues.filter((v) => !known.has(v));
      if (missing.length > 0) {
        throw new BadRequestException(
          `כיתה/התמחות לא קיימת במערכת: ${[...new Set(missing)].join(', ')}`,
        );
      }
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

      console.error('Failed to create student:', {
        name: err?.name,
        message: err?.message,
        detail: err?.parent?.detail,
        constraint: err?.parent?.constraint,
        id_number: data.id_number,
      });

      // הודעת שגיאה קריאה למשתמשת, בלי ה-SQL הארוך
      const name = err?.name ?? '';
      let message = err?.message || String(err);

      if (name === 'SequelizeValidationError' || name === 'ValidationError') {
        const paths = (err?.errors || []).map((e: any) => e?.path).filter(Boolean);
        message = `ערך לא תקין בשדות: ${[...new Set(paths)].join(', ') || message}`;
      } else if (name === 'SequelizeForeignKeyConstraintError' || name === 'ForeignKeyConstraintError') {
        message = 'אחד מהשדות (כיתה/התמחות/קשר) אינו קיים במערכת';
      } else if (name === 'SequelizeUniqueConstraintError' || name === 'UniqueConstraintError') {
        message = 'רשומה כפולה — ייתכן שמספר הזהות כבר קיים';
      }

      throw new BadRequestException(`Failed to create student: ${message}`);
    }
  }
}
