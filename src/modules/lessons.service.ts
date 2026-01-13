import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Lesson } from '../models/lesson.model.js';

@Injectable()
export class LessonsService {
  constructor(@InjectModel(Lesson) private model: typeof Lesson) {}

  async findAll() {
    return this.model.findAll();
  }

  async findById(id: number) {
    return this.model.findByPk(id);
  }

  async create(data: { class_id: number; date: string | Date; start_time: string; end_time: string; topic?: string; teacher_name?: string }) {
    const clean = { ...data, date: data.date ? new Date(data.date) : null } as any;
    return this.model.create(clean);
  }

  async update(id: number, data: Partial<{ class_id: number; date: string | Date; start_time: string; end_time: string; topic?: string; teacher_name?: string }>) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Lesson not found');
    const clean = { ...data } as any;
    if (clean.date) clean.date = new Date(clean.date);
    await item.update(clean);
    return item;
  }

  async remove(id: number) {
    const deleted = await this.model.destroy({ where: { id } });
    return deleted > 0;
  }
}
