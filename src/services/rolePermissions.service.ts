import { RolePermission } from '../models/rolePermission.model.js';
import { Permission } from '../models/permission.model.js';

export type AddRolePermissionInput = {
  role_id: number;
  permission_id: number;
};

export type UpdateRolePermissionInput = Partial<AddRolePermissionInput>;

export const getRolePermissions = async () => {
  return await RolePermission.findAll({ include: [Permission] });
};

export const getRolePermissionByKeys = async (roleId: number, permissionId: number) => {
  return await RolePermission.findOne({
    where: { role_id: roleId, permission_id: permissionId },
    include: [Permission],
  });
};

export const addRolePermission = async (data: AddRolePermissionInput) => {
  return await RolePermission.create(data as any);
};

export const updateRolePermissionByKeys = async (
  roleId: number,
  permissionId: number,
  data: UpdateRolePermissionInput,
) => {
  const item = await RolePermission.findOne({ where: { role_id: roleId, permission_id: permissionId } });
  if (!item) return null;
  await item.update(data as any);
  return await getRolePermissionByKeys(data.role_id ?? roleId, data.permission_id ?? permissionId);
};

export const deleteRolePermissionByKeys = async (roleId: number, permissionId: number) => {
  const deleted = await RolePermission.destroy({ where: { role_id: roleId, permission_id: permissionId } });
  return deleted > 0;
};
