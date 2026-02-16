import { Permission } from '../models/permission.model.js';

export type AddPermissionInput = {
  screen_name: string;
  can_view: boolean;
  can_edit: boolean;
};

export type UpdatePermissionInput = Partial<AddPermissionInput>;

export const getPermissions = async () => {
  return await Permission.findAll();
};

export const getPermissionById = async (id: number) => {
  return await Permission.findByPk(id);
};

export const addPermission = async (data: AddPermissionInput) => {
  return await Permission.create(data as any);
};

export const updatePermissionById = async (id: number, data: UpdatePermissionInput) => {
  const item = await Permission.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
};

export const deletePermissionById = async (id: number) => {
  const deleted = await Permission.destroy({ where: { id } });
  return deleted > 0;
};
