import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from '../models/student.model';
import { GetAllStudentsDataService } from '../services/getAllStudentsData.service';
import { StudentsDataController } from '../controllers/studentsData.controller';
import { AddStudentService } from '../services/AddStudent.service';

@Module({
  imports: [SequelizeModule.forFeature([Student])],
  controllers: [StudentsDataController],
  providers: [GetAllStudentsDataService,AddStudentService],
})
export class StudentModule { 
  constructor() {console.log('✅ StudentModule loaded');
}
}
