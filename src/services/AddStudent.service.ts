import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '../models/student.model.js';

@Injectable()
export class AddStudentService {
  constructor(
    @InjectModel(Student)
    private studentModel: typeof Student,
  ) {}

  private allowedFields = [
    'id_number', 'paid_amount', 'payment_status', 'serial_number', 'class_kodesh', 'is_graduate',
    'last_name', 'first_name', 'nickname', 'birthdate_hebrew', 'birthdate_gregorian', 'address',
    'zipcode', 'father_name_he', 'father_mobile_he', 'mother_name_he',
    'track', 'track2', 'track3', 'marital_status', 'class_teaching', 'bookshelf', 'notes',
    'perach', 'external_mother', 'external_father', 'birth_country', 'married_date',
    'married_name', 'personal_mobile', 'trend', 'chetz', 'phone', 'payment_method'
  ];

  async addStudent(input: Record<string, any>) {
    console.log("start service");
    
    const data: Record<string, any> = {};

    for (const key of this.allowedFields) {
      if (key in input) {
        data[key] = input[key];
      }
    }

    // Sanitize/normalize fields to avoid DB type errors
    const booleanMap = (val: any) => {
      if (val === undefined || val === null) return val;
      if (typeof val === 'boolean') return val;
      const s = String(val).trim().toLowerCase();
      if (['true','t','1','yes','y','x'].includes(s)) return true;
      if (['false','f','0','no','n',''].includes(s)) return false;
      return val;
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

    // Date fields normalization: remove if invalid
    for (const f of ['birthdate_gregorian', 'married_date']) {
      if (f in data) {
        const d = new Date(data[f]);
        if (isNaN(d.getTime())) {
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
    } catch (err:any) {
      console.error('Failed to create student:', err);
      throw new BadRequestException('Failed to create student: ' + (err?.message || err));
    }
  }
}
