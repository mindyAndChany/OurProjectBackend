import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from '../models/student.model';
import { getAllStudentsDataService } from '../services/getAllStudentsData.service.js';
import { StudentsDataController } from '../controllers/studentsData.controller.js';

@Module({
  imports: [SequelizeModule.forFeature([Student])],
  controllers: [StudentsDataController],
  providers: [getAllStudentsDataService],
})
export class StudentModule {}
