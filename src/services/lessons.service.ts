import { Lesson } from '../models/lesson.model.js';
import { Topic } from '../models/topic.model.js';
import { Room } from '../models/room.model.js';
import { Op } from 'sequelize';

type AddLessonInput = {
  class_id: number;
  date: Date | string;
  start_time: string;
  end_time: string;
  topic_id?: number;
  topicName?: string;
  topic?: string; // legacy, will be mapped to topicName if provided
  is_cancelled?: boolean;
  cancellation_reason?: string;
  room_id?: number;
};

type UpdateLessonInput = Partial<AddLessonInput>;

export const getLessons = async (filters: {
  date?: string | Date;
  start_time?: string;
  end_time?: string;
} = {}) => {
  // build a where clause based on provided filters
  const where: any = {};

  if (filters.date !== undefined && filters.date !== null) {
    // normalize string dates to actual Date objects so Sequelize can compare
    where.date = new Date(filters.date as string | Date);
  }

  // time filters are interpreted as inclusive bounds
  if (filters.start_time && filters.end_time) {
    where.start_time = { [Op.gte]: filters.start_time };
    where.end_time = { [Op.lte]: filters.end_time };
  } else {
    if (filters.start_time) {
      where.start_time = { [Op.gte]: filters.start_time };
    }
    if (filters.end_time) {
      where.end_time = { [Op.lte]: filters.end_time };
    }
  }

  return await Lesson.findAll({
    where,
    include: [
      { model: Topic, as: 'topicRef', attributes: ['id', 'name'] },
      { model: Room, as: 'roomRef', attributes: ['id', 'name', 'number'] },
    ],
  });
};

export const getLessonById = async (id: number) => {
  return await Lesson.findByPk(id, {
    include: [
      { model: Topic, as: 'topicRef', attributes: ['id', 'name'] },
      { model: Room, as: 'roomRef', attributes: ['id', 'name', 'number'] },
    ],
  });
};

export const addLesson = async (data: AddLessonInput) => {
  const clean: any = {
    ...data,
    date: data.date ? new Date(data.date) : null,
  };

  // Resolve topic_id via provided topicName or legacy topic string
  if (!clean.topic_id) {
    const name = clean.topicName ?? clean.topic;
    if (name && typeof name === 'string' && name.trim() !== '') {
      const [topic] = await Topic.findOrCreate({ where: { name: name.trim() }, defaults: { name: name.trim() } });
      clean.topic_id = topic.id;
      // Ensure legacy string column is populated if missing
      if (!clean.topic) clean.topic = topic.name;
    }
  }

  delete clean.topicName;

  return await Lesson.create(clean);
};

export const updateLessonById = async (id: number, data: UpdateLessonInput) => {
  const item = await Lesson.findByPk(id);
  if (!item) return null;

  const clean: any = { ...data };
  if (clean.date) clean.date = new Date(clean.date);

  if (!clean.topic_id && (clean.topicName || clean.topic)) {
    const name = (clean.topicName ?? clean.topic)?.trim();
    if (name) {
      const [topic] = await Topic.findOrCreate({ where: { name }, defaults: { name } });
      clean.topic_id = topic.id;
      // Keep legacy string column in sync when possible
      if (!clean.topic) clean.topic = topic.name;
    }
  }
  delete clean.topicName;

  await item.update(clean);
  return item;
};

export const deleteLessonById = async (id: number) => {
  const deleted = await Lesson.destroy({ where: { id } });
  return deleted > 0;
};