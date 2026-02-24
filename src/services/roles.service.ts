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
  // ✅ וידוא שרק name נשלח, מונע שליחת id או שדות אחרים
  const roleData = { name: data.name };
  console.log('🔵 Creating role with data:', roleData);
  return await Role.create(roleData as any);
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
