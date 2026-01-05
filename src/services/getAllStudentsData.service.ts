import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '../models/student.model.js';
import { BadRequestException } from '@nestjs/common';
import { Order } from 'sequelize';
import { FindOptions } from 'sequelize'; // ודא שזה מיובא

type SortSpec = Array<{ column: string; direction?: 'ASC' | 'DESC' }>;

@Injectable()
export class getAllStudentsDataService {
  constructor(
    @InjectModel(Student)
    private studentModel: typeof Student,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentModel.findAll();
  }

  async getStudentData(cols: string[]) {
    const allowed = [
      'id', 'first_name', 'last_name', 'id_number', 'phone', 'marital_status', 'address',
      'registration_year', 'is_graduate', 'class_kodesh', 'class_teaching', 'track', 'track2', 'track3',
      'payment_status', 'paid_amount', 'birthdate_gregorian', 'birthdate_hebrew', 'married_date', 'married_name', 'notes', 'institution_code', 'email'
    ];

    const attrs = cols.filter(c => allowed.includes(c));
    if (attrs.length === 0) throw new BadRequestException('no valid categories');

    const rows = await this.studentModel.findAll({ attributes: attrs });
    return rows.map(r => r.get({ plain: true }));
  }

  async groupBy(opts: { groupBy: string; fields?: string[]; sort?: SortSpec }) {
    const allowed = [
      'id', 'first_name', 'last_name', 'id_number', 'phone', 'marital_status', 'address',
      'registration_year', 'is_graduate', 'class_kodesh', 'class_teaching', 'track', 'track2', 'track3',
      'payment_status', 'paid_amount', 'birthdate_gregorian', 'birthdate_hebrew', 'married_date', 'married_name', 'notes'
    ];

    const { groupBy, fields, sort } = opts;
    if (!groupBy || !allowed.includes(groupBy)) {
      throw new BadRequestException('Invalid groupBy column');
    }

    const attributes = fields && fields.length ? fields.filter(f => allowed.includes(f)) : undefined;
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
