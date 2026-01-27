import { Lesson } from '../models/lesson.model.js';
import { Topic } from '../models/topic.model.js';

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
};

type UpdateLessonInput = Partial<AddLessonInput>;

export const getLessons = async () => {
  return await Lesson.findAll({
    // include: [{ model: Topic, as: 'topicRef', attributes: ['id', 'name'] }],
  });
};

export const getLessonById = async (id: number) => {
  return await Lesson.findByPk(id, {
    include: [{ model: Topic, as: 'topicRef', attributes: ['id', 'name'] }],
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
    }
  }

  // Avoid persisting legacy topic string when FK is present
  if (clean.topic_id) delete clean.topic;
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
    }
  }
  if (clean.topic_id) delete clean.topic;
  delete clean.topicName;

  await item.update(clean);
  return item;
};

export const deleteLessonById = async (id: number) => {
  const deleted = await Lesson.destroy({ where: { id } });
  return deleted > 0;
};