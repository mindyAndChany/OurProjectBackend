import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Course } from './course.model.js';

@Table({ tableName: 'topics', timestamps: false })
export class Topic extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string;

  @ForeignKey(() => Course)
  @Column(DataType.INTEGER)
  course_id!: number;

  @BelongsTo(() => Course)
  courseRef?: any;
}
