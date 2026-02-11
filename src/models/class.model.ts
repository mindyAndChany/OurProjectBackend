import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Student } from './student.model.js';

@Table({ tableName: 'classes', timestamps: false })
export class ClassModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER)
  course_id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.INTEGER)
  year!: number;

  @Column(DataType.STRING)
  teacher_name!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  base_schedule?: string;

  @HasMany(() => Student, { sourceKey: 'name', foreignKey: 'class_kodesh', as: 'kodeshStudents' })
  kodeshStudents?: Student[];

  @HasMany(() => Student, { sourceKey: 'name', foreignKey: 'track', as: 'primaryTrackStudents' })
  primaryTrackStudents?: Student[];

  @HasMany(() => Student, { sourceKey: 'name', foreignKey: 'track2', as: 'secondaryTrackStudents' })
  secondaryTrackStudents?: Student[];

  @HasMany(() => Student, { sourceKey: 'name', foreignKey: 'track3', as: 'tertiaryTrackStudents' })
  tertiaryTrackStudents?: Student[];
}
