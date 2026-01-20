import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '../models/student.model.js';

@Injectable()
export class GetStudentByIdService {
  constructor(
    @InjectModel(Student)
    private studentModel: typeof Student,
  ) {}

  async getByIdNumber(id: string): Promise<Student> {
    const student = await this.studentModel.findOne({
      where: { id_number: id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }
}
