import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Student } from './student.model.js';

@Table({
  tableName: 'student_documents',
  timestamps: false,
  indexes: [
    { fields: ['student_id'] }
  ]
})
export class StudentDocument extends Model {
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
  name!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  url!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public_id?: string | null;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  created_at!: Date;
}
