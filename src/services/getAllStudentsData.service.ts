import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '../models/student.model.js';
import { BadRequestException } from '@nestjs/common';
import { Order } from 'sequelize';
import { FindOptions, literal } from 'sequelize'; // ודא שזה מיובא

type SortSpec = Array<{ column: string; direction?: 'ASC' | 'DESC' }>;

@Injectable()
export class GetAllStudentsDataService {
  constructor(
    @InjectModel(Student)
    private studentModel: typeof Student,
  ) {}



  async findAll(): Promise<Student[]> {
    const hebrewCollation = (process.env.PG_HEBREW_COLLATION || '').trim();
    return this.studentModel.findAll({
      order: [
        hebrewCollation
          ? [literal(`"last_name" COLLATE "${hebrewCollation}"`), 'ASC']
          : ['last_name', 'ASC'],
        hebrewCollation
          ? [literal(`"first_name" COLLATE "${hebrewCollation}"`), 'ASC']
          : ['first_name', 'ASC'],
      ],
    });
  }

  // קבלת שדות ספציפיים עבור כל התלמידים
  async getStudentData(cols: string[]) {
  const allowed = [
  'id', 'first_name', 'last_name', 'id_number', 'phone', 'marital_status', 'address',
  'registration_year', 'is_graduate', 'class_kodesh', 'class_teaching', 'track', 'track2', 'track3',
  'payment_status', 'paid_amount', 'birthdate_gregorian', 'birthdate_hebrew', 'married_date', 'married_name', 'notes',
  'institution_code', 'email', 'serial_number', 'nickname', 'zipcode', 'father_name_he', 'father_mobile_he',
  'mother_name_he', 'bookshelf', 'perach', 'external_mother', 'external_father', 'birth_country','mother_mobile_he',
  'personal_mobile', 'trend', 'chetz', 'payment_method','photo_url'
];


    const modelAttrs = Object.keys(this.studentModel.rawAttributes || {});
    const attrs = cols.filter(c => allowed.includes(c) && modelAttrs.includes(c));
    if (attrs.length === 0) {
      throw new BadRequestException('no valid categories');
    }

    const hebrewCollation = (process.env.PG_HEBREW_COLLATION || '').trim();
    const rows = await this.studentModel.findAll({
      attributes: attrs,
      order: [
        hebrewCollation
          ? [literal(`"last_name" COLLATE "${hebrewCollation}"`), 'ASC']
          : ['last_name', 'ASC'],
        hebrewCollation
          ? [literal(`"first_name" COLLATE "${hebrewCollation}"`), 'ASC']
          : ['first_name', 'ASC'],
      ],
    });
    const plainRows = rows.map(r => r.get({ plain: true }));
    return plainRows; 
  }



  //קיבוץ לפי שדה מסוים
  async groupBy(opts: { groupBy: string; fields?: string[]; sort?: SortSpec }) {
   const allowed = [
  'id', 'first_name', 'last_name', 'id_number', 'phone', 'marital_status', 'address',
  'registration_year', 'is_graduate', 'class_kodesh', 'class_teaching', 'track', 'track2', 'track3',
  'payment_status', 'paid_amount', 'birthdate_gregorian', 'birthdate_hebrew', 'married_date', 'married_name', 'notes',
  'institution_code', 'email', 'serial_number', 'nickname', 'zipcode', 'father_name_he', 'father_mobile_he',
  'mother_name_he', 'bookshelf', 'perach', 'external_mother', 'external_father', 'birth_country',
  'personal_mobile', 'trend', 'chetz', 'payment_method','photo_url','mother_mobile_he'
];


    const { groupBy, fields, sort } = opts;
    const modelAttrs = Object.keys(this.studentModel.rawAttributes || {});
    if (!groupBy || !allowed.includes(groupBy) || !modelAttrs.includes(groupBy)) {
      throw new BadRequestException('Invalid groupBy column');
    }

    const attributes = fields && fields.length ? fields.filter(f => allowed.includes(f) && modelAttrs.includes(f)) : undefined;
    const order: Order | undefined = sort && sort.length ? sort.map(s => [s.column, (s.direction || 'ASC')] as const) : undefined;
const options: FindOptions = {};
if (attributes !== undefined) options.attributes = attributes;
if (order !== undefined) options.order = order;

    const rows = await this.studentModel.findAll(options);

    const groups: Record<string, any[]> = {};
    for (const r of rows) {
      const plain = r.get({ plain: true }) as any;
      const key = String(plain[groupBy] ?? 'undefined');
      if (!groups[key]) groups[key] = [];
      groups[key].push(plain);
    }

    return groups;
  }
}
