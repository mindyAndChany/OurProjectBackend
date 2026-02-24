import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
  tableName: 'permissions',
  timestamps: false,
  indexes: [{ unique: true, fields: ['screen_name', 'can_view', 'can_edit'] }],
})
export class Permission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;
  @Column(DataType.STRING) screen_name!: string;
  @Column(DataType.BOOLEAN) can_view!: boolean;
  @Column(DataType.BOOLEAN) can_edit!: boolean;
}
