import { Topic } from '../models/topic.model.js';
import { Course } from '../models/course.model.js';

export const listTopics = async () => {
  return await Topic.findAll({ order: [['name', 'ASC']], include: [Course] });
};

export const createTopic = async (name: string, course_id: number) => {
  const clean = name.trim();
  if (!Number.isInteger(course_id)) {
    throw new Error('course_id must be an integer');
  }
  // Ensure course exists
  const course = await Course.findByPk(course_id);
  if (!course) {
    throw new Error('course_id does not reference an existing course');
  }
  const [topic] = await Topic.findOrCreate({
    where: { name: clean },
    defaults: { name: clean, course_id }
  });
  return topic;
};
