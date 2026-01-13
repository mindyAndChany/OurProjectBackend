import { Course } from '../models/course.model.js';

export const getCourses = async () => {
  return await Course.findAll();
};

export const getCourseById = async (id: number) => {
  return await Course.findByPk(id);
};

export const addCourse = async (data: { name: string; type: string }) => {
  return await Course.create(data);
};

export const updateCourseById = async (id: number, data: Partial<{ name: string; type: string }>) => {
  const item = await Course.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
};

export const deleteCourseById = async (id: number) => {
  const deleted = await Course.destroy({ where: { id } });
  return deleted > 0;
};