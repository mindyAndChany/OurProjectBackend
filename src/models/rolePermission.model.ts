import { Table, Column, Model, ForeignKey, BelongsTo, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Role } from './role.model.js';
import { Permission } from './permission.model.js';

@Table({
  tableName: 'role_permissions',
  timestamps: false,
  indexes: [{ unique: true, fields: ['role_id', 'permission_id'] }],
})
export class RolePermission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Role)
  @Column(DataType.INTEGER) role_id!: number;
  @ForeignKey(() => Permission)
  @Column(DataType.INTEGER) permission_id!: number;

  @BelongsTo(() => Permission)
  permission!: Permission;
}
