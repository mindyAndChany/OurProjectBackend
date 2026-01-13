import { WeeklySchedule } from '../models/weekly_schedule.model.js';

export const getWeeklySchedules = async () => {
  return await WeeklySchedule.findAll();
};

export const getWeeklyScheduleById = async (id: number) => {
  return await WeeklySchedule.findByPk(id);
};

export const addWeeklySchedule = async (data: { class_id: number; day_of_week: string; start_time: string; end_time: string; topic?: string; teacher_name?: string }) => {
  return await WeeklySchedule.create(data);
};

export const updateWeeklyScheduleById = async (id: number, data: Partial<{ class_id: number; day_of_week: string; start_time: string; end_time: string; topic?: string; teacher_name?: string }>) => {
  const item = await WeeklySchedule.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
};

export const deleteWeeklyScheduleById = async (id: number) => {
  const deleted = await WeeklySchedule.destroy({ where: { id } });
  return deleted > 0;
};