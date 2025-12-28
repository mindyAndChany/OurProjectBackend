import { Table, Column, Model, ForeignKey, BelongsTo, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Role } from './role.model.js';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;
  @Column(DataType.STRING) name!: string;
  @Column(DataType.STRING) email!: string;
  @Column(DataType.STRING) password_hash!: string;
  @Column(DataType.STRING) institution_code!: string;
  @ForeignKey(() => Role)
  @Column(DataType.INTEGER) role_id!: number;
  @BelongsTo(() => Role)
  role!: Role;
  @Column(DataType.BOOLEAN) active!: boolean;
}
