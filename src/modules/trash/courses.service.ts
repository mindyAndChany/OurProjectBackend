import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from '../../models/course.model.js';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course) private courseModel: typeof Course) {}

  async findAll() {
    return await this.courseModel.findAll();
  }

  async findById(id: number) {
    return await this.courseModel.findByPk(id);
  }

  async create(data: { name: string; type: string }) {
    return await this.courseModel.create(data as any);
  }

  async update(id: number, data: Partial<{ name: string; type: string }>) {
    const item = await this.courseModel.findByPk(id);
    if (!item) throw new NotFoundException('Course not found');
    await item.update(data);
    return item;
  }

  async remove(id: number) {
    const deleted = await this.courseModel.destroy({ where: { id } });
    return deleted > 0;
  }
}
