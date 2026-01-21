import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Student } from './student.model.js';
import { Lesson } from './lesson.model.js';

@Table({ tableName: 'attendance', timestamps: false })
export class Attendance extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Student)
  @Column(DataType.STRING)
  student_id!: string;

  @BelongsTo(() => Student)
  student?: Student;

  @ForeignKey(() => Lesson)
  @Column(DataType.INTEGER)
  lesson_id!: number;

  @BelongsTo(() => Lesson)
  lesson?: Lesson;

  @Column(DataType.ENUM('present', 'late', 'absent', 'approved absent'))
  status!: 'present' | 'late' | 'absent' | 'approved absent';
}