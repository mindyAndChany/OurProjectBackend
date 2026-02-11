import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from './models/student.model.js';
import { StudentModule } from './modules/student.module.js';
import { AuthModule } from './modules/auth.module.js';
import { Course } from './models/course.model.js';
import { ClassModel } from './models/class.model.js';
import { WeeklySchedule } from './models/weekly_schedule.model.js';
import { Lesson } from './models/lesson.model.js';
import { Room } from './models/room.model.js';
import { CoursesModule } from './modules/courses.module.js';
import { ClassesModule } from './modules/classes.module.js';
import { WeeklySchedulesModule } from './modules/weeklySchedules.module.js';
import { LessonsModule } from './modules/lessons.module.js';


@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'dpg-d4mmvfodl3ps73e7nt10-a.oregon-postgres.render.com',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASS || '5csuDYohl7PnmyKhj7hGmavdYhzDbp5d',
      database: process.env.DB_NAME || 'edulinkdb',
      models: [Student, Course, ClassModel, WeeklySchedule, Lesson, Room],
      autoLoadModels: true,
      synchronize: false,
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      logging: false,
    }),
    StudentModule,
    AuthModule,
    CoursesModule,
    ClassesModule,
    WeeklySchedulesModule,
    LessonsModule
  ],
})
export class AppModule {}
