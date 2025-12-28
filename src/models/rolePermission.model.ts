import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { Role } from './role.model.js';
import { Permission } from './permission.model.js';

@Table({ tableName: 'role_permissions', timestamps: false })
export class RolePermission extends Model {
  @ForeignKey(() => Role)
  @Column(DataType.INTEGER) role_id!: number;
  @ForeignKey(() => Permission)
  @Column(DataType.INTEGER) permission_id!: number;

  @BelongsTo(() => Permission)
  permission!: Permission;
}
