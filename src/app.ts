import express from 'express';
import cors from 'cors';
import setupSwagger from './swagger';
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/studentsData.routes';
import { sequelize } from './store/db';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get('/', (_req, res) => res.send('Hello, World!'));

// מסלולים
app.use('/api/auth', authRoutes);
app.use('/api/studentsData', studentRoutes);



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
