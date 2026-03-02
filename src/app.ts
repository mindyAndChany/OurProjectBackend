import express from 'express';
import path from 'path';
import cors from 'cors';
import setupSwagger from './swagger.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/studentsData.routes.js';
import { sequelize } from './store/db.js';
import calendarRoutes from './routes/calendar.routes.js'; 
import coursesRoutes from './routes/courses.routes.js';
import classesRoutes from './routes/classes.routes.js';
import weeklySchedulesRoutes from './routes/weeklySchedules.routes.js';
import lessonsRoutes from './routes/lessons.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import topicsRoutes from './routes/topics.routes.js';
import studentAchievementsRoutes from './routes/studentAchievements.routes.js';
import semesterBoundariesRoutes from './routes/semesterBoundaries.routes.js';
import roomsRoutes from './routes/rooms.routes.js';
import usersRoutes from './routes/users.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import permissionsRoutes from './routes/permissions.routes.js';
import rolePermissionsRoutes from './routes/rolePermissions.routes.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ הגדלת גודל ה־body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ הגדרת CORS ספציפי
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://edulink-xn9f.onrender.com',
    'https://edulink-d65i.onrender.com',
    ' https://api.edulink.sgur.org.il'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],}));

app.get('/', (_req, res) => res.send('Hello, World!'));

// 🔀 מסלולים
app.use('/api/auth', authRoutes);
app.use('/api/studentsData', studentRoutes);
app.use('/api/calendar-events', calendarRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/weekly-schedules', weeklySchedulesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/student-achievements', studentAchievementsRoutes);
app.use('/api/semester-boundaries', semesterBoundariesRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/role-permissions', rolePermissionsRoutes);

// 📁 Static for uploaded files (when not using cloud storage)
app.use('/uploads', express.static(path.resolve('uploads')));

// 📘 סוואגר

console.log('📥 calling setupSwagger...');


setupSwagger(app);
console.log('📘 Swagger setup complete');


// 🚀 הרצת האפליקציה

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
    console.log('About to start listening...');
    app.listen(port, () => {
      console.log(`🚀 Express app running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Sequelize initialization failed:', err);
    process.exit(1);
  }
})();
