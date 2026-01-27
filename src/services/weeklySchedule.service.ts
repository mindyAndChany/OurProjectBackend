import { WeeklySchedule } from '../models/weekly_schedule.model.js';
import { Topic } from '../models/topic.model.js';

type AddWeeklyScheduleInput = {
  class_id: number;
  day_of_week: number | string;
  start_time: string;
  end_time: string;
  topic_id?: number;
  topicName?: string;
  topic?: string; // legacy
  teacher_name?: string;
};

type UpdateWeeklyScheduleInput = Partial<AddWeeklyScheduleInput>;

export const getWeeklySchedules = async () => {
  return await WeeklySchedule.findAll({
    include: [{ model: Topic, as: 'topicRef', attributes: ['id', 'name'] }],
  });
};

export const getWeeklyScheduleById = async (id: number) => {
  return await WeeklySchedule.findByPk(id, {
    include: [{ model: Topic, as: 'topicRef', attributes: ['id', 'name'] }],
  });
};

export const addWeeklySchedule = async (data: AddWeeklyScheduleInput) => {
  const clean: any = { ...data };
  if (typeof clean.day_of_week === 'string') {
    const parsed = parseInt(clean.day_of_week, 10);
    if (!isNaN(parsed)) clean.day_of_week = parsed;
  }

  if (!clean.topic_id) {
    const name = clean.topicName ?? clean.topic;
    if (name && typeof name === 'string' && name.trim() !== '') {
      const [topic] = await Topic.findOrCreate({ where: { name: name.trim() }, defaults: { name: name.trim() } });
      clean.topic_id = topic.id;
    }
  }
  if (clean.topic_id) delete clean.topic;
  delete clean.topicName;

  return await WeeklySchedule.create(clean);
};

export const updateWeeklyScheduleById = async (id: number, data: UpdateWeeklyScheduleInput) => {
  const item = await WeeklySchedule.findByPk(id);
  if (!item) return null;

  const clean: any = { ...data };
  if (typeof clean.day_of_week === 'string') {
    const parsed = parseInt(clean.day_of_week, 10);
    if (!isNaN(parsed)) clean.day_of_week = parsed;
  }

  if (!clean.topic_id && (clean.topicName || clean.topic)) {
    const name = (clean.topicName ?? clean.topic)?.trim();
    if (name) {
      const [topic] = await Topic.findOrCreate({ where: { name }, defaults: { name } });
      clean.topic_id = topic.id;
    }
  }
  if (clean.topic_id) delete clean.topic;
  delete clean.topicName;

  await item.update(clean);
  return item;
};

export const deleteWeeklyScheduleById = async (id: number) => {
  const deleted = await WeeklySchedule.destroy({ where: { id } });
  return deleted > 0;
};