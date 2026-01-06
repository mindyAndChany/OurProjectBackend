// src/models/calendar_event.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'calendar_events',
  timestamps: false,
})
export class CalendarEvent extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER) // ✅ חובה!
  id!: number;

  @Column(DataType.STRING) // ✅
  title!: string;

  @Column(DataType.STRING) // ✅
  type!: string;

  @Column(DataType.DATEONLY)
  date!: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  time_start!: string | null;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  time_end!: string | null;

  @Column(DataType.STRING) // ✅
  notes!: string;
}
