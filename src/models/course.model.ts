import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Topic } from './topic.model.js';

@Table({ tableName: 'courses', timestamps: false })
export class Course extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  type!: string; // e.g. kodesh / hora'ah / hitmahut

  @HasMany(() => Topic)
  topics?: any[];
}
