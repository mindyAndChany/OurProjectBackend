import { Table, Column, Model, HasMany, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { RolePermission } from './rolePermission.model.js';

@Table({ tableName: 'roles', timestamps: false })
export class Role extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;
  @Column(DataType.STRING) name!: string;

  @HasMany(() => RolePermission)
  rolePermissions!: RolePermission[];
}
