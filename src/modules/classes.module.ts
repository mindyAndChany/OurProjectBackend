import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClassModel } from '../models/class.model.js';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';

@Module({
  imports: [SequelizeModule.forFeature([ClassModel])],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {
  constructor() {
    console.log('✅ ClassesModule loaded');
  }
}
