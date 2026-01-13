import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

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
}
