import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WeeklySchedule } from '../models/weekly_schedule.model.js';
import { WeeklySchedulesService } from './weeklySchedules.service';
import { WeeklySchedulesController } from './weeklySchedules.controller';

@Module({
  imports: [SequelizeModule.forFeature([WeeklySchedule])],
  controllers: [WeeklySchedulesController],
  providers: [WeeklySchedulesService],
  exports: [WeeklySchedulesService],
})
export class WeeklySchedulesModule {
  constructor() {
    console.log('✅ WeeklySchedulesModule loaded');
  }
}
