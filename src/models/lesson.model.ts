import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ClassModel } from './class.model.js';

@Table({ tableName: 'lessons', timestamps: false })
export class Lesson extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => ClassModel)
  @Column(DataType.INTEGER)
  class_id!: number;

  @BelongsTo(() => ClassModel)
  class?: ClassModel;

  @Column(DataType.DATE)
  date!: Date;

  @Column(DataType.STRING)
  start_time!: string;

  @Column(DataType.STRING)
  end_time!: string;

  @Column(DataType.STRING)
  topic!: string;

  // @Column(DataType.STRING)
  // teacher_name!: string;

  @Column(DataType.BOOLEAN)
  is_cancelled!: boolean;

  @Column(DataType.TEXT)
  cancellation_reason?: string;
}
