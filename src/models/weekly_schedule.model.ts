import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Topic } from './topic.model.js';
import { Room } from './room.model.js';

// Point to existing table in DB (PGAdmin shows it is named weekly_schedule)
@Table({ tableName: 'weekly_schedule', timestamps: false })
export class WeeklySchedule extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER)
  class_id!: number;

  // DB column is integer (1-7). Use INTEGER to avoid select errors.
  @Column(DataType.INTEGER)
  day_of_week!: number;

  @Column(DataType.TIME)
  start_time!: string;

  @Column(DataType.TIME)
  end_time!: string;

  @Column(DataType.STRING)
  topic!: string;

  // New FK to topics table; kept optional during migration phase
  @ForeignKey(() => Topic)
  @Column(DataType.INTEGER)
  topic_id?: number;

  @BelongsTo(() => Topic)
  topicRef?: Topic;

  // Room assignment for planned timetable entry
  @ForeignKey(() => Room)
  @Column(DataType.INTEGER)
  room_id?: number;

  @BelongsTo(() => Room)
  roomRef?: Room;
}
