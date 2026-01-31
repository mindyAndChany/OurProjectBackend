import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '../models/student.model.js';

@Injectable()
export class UpdateStudentService {
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
