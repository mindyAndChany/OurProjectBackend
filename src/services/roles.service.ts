import { Role } from '../models/role.model.js';

export type AddRoleInput = {
  name: string;
};

export type UpdateRoleInput = Partial<AddRoleInput>;

export const getRoles = async () => {
  return await Role.findAll();
};

export const getRoleById = async (id: number) => {
  return await Role.findByPk(id);
};

export const addRole = async (data: AddRoleInput) => {
  return await Role.create(data as any);
};

export const updateRoleById = async (id: number, data: UpdateRoleInput) => {
  const item = await Role.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
};

export const deleteRoleById = async (id: number) => {
  const deleted = await Role.destroy({ where: { id } });
  return deleted > 0;
};
