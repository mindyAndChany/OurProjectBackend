import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'weekly_schedules', timestamps: false })
export class WeeklySchedule extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER)
  class_id!: number;

  @Column(DataType.STRING)
  day_of_week!: string; // or numeric representation

  @Column(DataType.STRING)
  start_time!: string;

  @Column(DataType.STRING)
  end_time!: string;

  @Column(DataType.STRING)
  topic!: string;

  @Column(DataType.STRING)
  teacher_name!: string;
}
