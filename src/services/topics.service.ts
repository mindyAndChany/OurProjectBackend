import { Topic } from '../models/topic.model.js';

export const listTopics = async () => {
  return await Topic.findAll({ order: [['name', 'ASC']] });
};

export const createTopic = async (name: string) => {
  const clean = name.trim();
  const [topic] = await Topic.findOrCreate({ where: { name: clean }, defaults: { name: clean } });
  return topic;
};
