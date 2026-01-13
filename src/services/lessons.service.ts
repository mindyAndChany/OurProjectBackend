import { Lesson } from '../models/lesson.model.js';

export const getLessons = async () => {
  return await Lesson.findAll();
};

export const getLessonById = async (id: number) => {
  return await Lesson.findByPk(id);
};

export const addLesson = async (data: { class_id: number; date: Date | string; start_time: string; end_time: string; topic?: string; teacher_name?: string }) => {
  const clean = {
    ...data,
    date: data.date ? new Date(data.date) : null,
  };
  return await Lesson.create(clean as any);
};

export const updateLessonById = async (id: number, data: Partial<{ class_id: number; date: Date | string; start_time: string; end_time: string; topic?: string; teacher_name?: string }>) => {
  const item = await Lesson.findByPk(id);
  if (!item) return null;
  const clean = { ...data } as any;
  if (clean.date) clean.date = new Date(clean.date);
  await item.update(clean);
  return item;
};

export const deleteLessonById = async (id: number) => {
  const deleted = await Lesson.destroy({ where: { id } });
  return deleted > 0;
};