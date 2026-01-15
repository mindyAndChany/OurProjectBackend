import express from 'express';
import cors from 'cors';
import setupSwagger from './swagger.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/studentsData.routes.js';
import { sequelize } from './store/db.js';
import calendarRoutes from './routes/calendar.routes.js'; // או .ts אם בתוך src
import coursesRoutes from './routes/courses.routes.js';
import classesRoutes from './routes/classes.routes.js';
import weeklySchedulesRoutes from './routes/weeklySchedules.routes.js';
import lessonsRoutes from './routes/lessons.routes.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ הגדלת גודל ה־body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ הגדרת CORS ספציפי
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.get('/', (_req, res) => res.send('Hello, World!'));

// 🔀 מסלולים
app.use('/api/auth', authRoutes);
app.use('/api/studentsData', studentRoutes);
app.use('/api/calendar-events', calendarRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/weekly-schedules', weeklySchedulesRoutes);
app.use('/api/lessons', lessonsRoutes);

// 📘 סוואגר

console.log('📥 calling setupSwagger...');


setupSwagger(app);
console.log('📘 Swagger setup complete');

// 🚀 הרצת האפליקציה
sequelize.sync().then(() => {
  console.log('About to start listening...');
  app.listen(port, () => {
    console.log(`🚀 Express app running on http://localhost:${port}`);
  });
});
