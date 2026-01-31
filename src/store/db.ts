import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model.js';
import { Role } from '../models/role.model.js';
import { Permission } from '../models/permission.model.js';
import { RolePermission } from '../models/rolePermission.model.js';
import { Student } from '../models/student.model.js';
import { CalendarEvent } from '../models/calendar_event.model.js';
import { Course } from '../models/course.model.js';
import { ClassModel } from '../models/class.model.js';
import { WeeklySchedule } from '../models/weekly_schedule.model.js';
import { Lesson } from '../models/lesson.model.js';
import { Attendance } from '../models/attendance.model.js';
import { Topic } from '../models/topic.model.js';
import { StudentAchievement } from '../models/student_achievement.model.js';
import { SemesterBoundary } from '../models/semester_boundary.model.js';
import { StudentDocument } from '../models/student_document.model.js';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'dpg-d4mmvfodl3ps73e7nt10-a.oregon-postgres.render.com',
  port: 5432,
  username: 'admin',
  password: '5csuDYohl7PnmyKhj7hGmavdYhzDbp5d',
  database: 'edulinkdb',
  models: [User, Role, Permission, RolePermission, Student, CalendarEvent, Course, ClassModel, WeeklySchedule, Lesson, Attendance, Topic, StudentAchievement, SemesterBoundary, StudentDocument],
  // Enable query logging to help diagnose sync errors
  // logging: console.log,
  logging:false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

