import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClassModel } from '../models/class.model.js';

@Injectable()
export class ClassesService {
  constructor(@InjectModel(ClassModel) private classModel: typeof ClassModel) {}

  async findAll() {
    return this.classModel.findAll();
  }

  async findById(id: number) {
    return this.classModel.findByPk(id);
  }

  async create(data: { course_id: number; name: string; year: number; teacher_name: string; base_schedule?: string }) {
    return this.classModel.create(data as any);
  }

  async update(id: number, data: Partial<{ course_id: number; name: string; year: number; teacher_name: string; base_schedule?: string }>) {
    const item = await this.classModel.findByPk(id);
    if (!item) throw new NotFoundException('Class not found');
    await item.update(data);
    return item;
  }

  async remove(id: number) {
    const deleted = await this.classModel.destroy({ where: { id } });
    return deleted > 0;
  }
}
