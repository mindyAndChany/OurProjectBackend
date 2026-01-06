import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from '../models/student.model.ts';
import { getAllStudentsDataService } from '../services/getAllStudentsData.service.ts';
import { StudentsDataController } from '../controllers/studentsData.controller.ts';

@Module({
  imports: [SequelizeModule.forFeature([Student])],
  controllers: [StudentsDataController],
  providers: [getAllStudentsDataService],
})
export class StudentModule {}
