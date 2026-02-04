import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique } from 'sequelize-typescript';

@Table({ tableName: 'rooms', timestamps: false })
export class Room extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  // Room number/code; keep as string to allow alphanumeric identifiers
  @Unique
  @Column(DataType.STRING)
  number!: string;

  // Additional attributes
  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  is_computer_lab?: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  has_projector?: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true })
  floor?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  seat_count?: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  is_available?: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  primary_use?: string;
}
