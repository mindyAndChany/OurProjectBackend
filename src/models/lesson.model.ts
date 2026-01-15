import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'lessons', timestamps: false })
export class Lesson extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER)
  class_id!: number;

  @Column(DataType.DATE)
  date!: Date;

  @Column(DataType.STRING)
  start_time!: string;

  @Column(DataType.STRING)
  end_time!: string;

  @Column(DataType.STRING)
  topic!: string;

  @Column(DataType.STRING)
  teacher_name!: string;

  @Column(DataType.BOOLEAN)
  is_cancelled!: boolean;

  @Column(DataType.TEXT)
  cancellation_reason?: string;
}
