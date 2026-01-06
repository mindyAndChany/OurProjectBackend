import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from './models/student.model.ts';
import { StudentModule } from './modules/student.module.ts';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'dpg-d4mmvfodl3ps73e7nt10-a.oregon-postgres.render.com',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASS || '5csuDYohl7PnmyKhj7hGmavdYhzDbp5d',
      database: process.env.DB_NAME || 'edulinkdb',
      models: [Student],
      autoLoadModels: true,
      synchronize: false,
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      logging: false,
    }),
    StudentModule,
  ],
})
export class AppModule {}
