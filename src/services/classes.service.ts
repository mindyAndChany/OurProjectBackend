import { ClassModel } from '../models/class.model.js';

export const getClasses = async () => {
  return await ClassModel.findAll();
};

export const getClassById = async (id: number) => {
  return await ClassModel.findByPk(id);
};

export const addClass = async (data: { course_id: number; name: string; year: number; teacher_name: string; base_schedule?: string }) => {
  return await ClassModel.create(data);
};

export const updateClassById = async (id: number, data: Partial<{ course_id: number; name: string; year: number; teacher_name: string; base_schedule?: string }>) => {
  const item = await ClassModel.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
};

export const deleteClassById = async (id: number) => {
  const deleted = await ClassModel.destroy({ where: { id } });
  return deleted > 0;
};