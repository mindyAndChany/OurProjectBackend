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
import { Room } from '../models/room.model.js';

// מחזיר משתנה סביבה חובה; אם חסר – זורק שגיאה ברורה בזמן עליית השרת.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ חסר משתנה סביבה חובה: ${name}`);
  }
  return value;
}

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: requireEnv('DB_HOST'),
  port: Number(process.env.DB_PORT) || 5432,
  username: requireEnv('DB_USER'),
  password: requireEnv('DB_PASS'),
  database: requireEnv('DB_NAME'),
  models: [User, Role, Permission, RolePermission, Student, CalendarEvent, Course, ClassModel, WeeklySchedule, Lesson, Attendance, Topic, StudentAchievement, SemesterBoundary, StudentDocument, Room],
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

