import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from '../models/student.model.js';
import { GetAllStudentsDataService } from '../services/getAllStudentsData.service.js';
import { StudentsDataController } from '../controllers/studentsData.controller.js';
import { AddStudentService } from '../services/AddStudent.service.js';
import { UpdateStudentService } from '../services/UpdateStudent.service.js';

@Module({
  imports: [SequelizeModule.forFeature([Student])],
  controllers: [StudentsDataController],
  providers: [GetAllStudentsDataService,AddStudentService,UpdateStudentService],
})
export class StudentModule { 
  constructor() {console.log('✅ StudentModule loaded');
}
}
