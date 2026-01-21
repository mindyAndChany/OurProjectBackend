import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WeeklySchedule } from '../../models/weekly_schedule.model.js';

@Injectable()
export class WeeklySchedulesService {
  constructor(@InjectModel(WeeklySchedule) private model: typeof WeeklySchedule) {}

  async findAll() {
    return this.model.findAll();
  }

  async findById(id: number) {
    return this.model.findByPk(id);
  }

  async create(data: { class_id: number; day_of_week: string; start_time: string; end_time: string; topic?: string; }) {
    return this.model.create(data as any);
  }

  async update(id: number, data: Partial<{ class_id: number; day_of_week: string; start_time: string; end_time: string; topic?: string; }>) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Weekly schedule not found');
    await item.update(data);
    return item;
  }

  async remove(id: number) {
    const deleted = await this.model.destroy({ where: { id } });
    return deleted > 0;
  }
}
