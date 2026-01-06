import express from 'express';
import cors from 'cors';
import setupSwagger from './swagger.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/studentsData.routes.js';
import { sequelize } from './store/db.js';
import calendarRoutes from './routes/calendar.routes.js'; // או .ts אם בתוך src

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get('/', (_req, res) => res.send('Hello, World!'));

// מסלולים
app.use('/api/auth', authRoutes);
app.use('/api/studentsData', studentRoutes);
app.use('/api/calendar-events', calendarRoutes);

console.log('📥 calling setupSwagger...');

// סוואגר
setupSwagger(app);
console.log('📘 Swagger setup complete');

// הרצת האפליקציה
sequelize.sync().then(() => {
console.log('About to start listening...');

app.listen(port, () => {
  console.log(`🚀 Express app running on http://localhost:${port}`);
});

});
