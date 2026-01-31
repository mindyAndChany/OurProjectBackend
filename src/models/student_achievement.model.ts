import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Student } from './student.model.js';

@Table({
  tableName: 'student_achievements',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['student_id', 'topic', 'semester'] }
  ]
})
export class StudentAchievement extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Student)
  @Column({ type: DataType.INTEGER, allowNull: false })
  student_id!: number;

  @BelongsTo(() => Student)
  student?: Student;

  @Column({ type: DataType.TEXT, allowNull: false })
  topic!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  semester!: string;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: true })
  final_grade?: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  attendance_percentage!: number;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  created_at!: Date;
}
