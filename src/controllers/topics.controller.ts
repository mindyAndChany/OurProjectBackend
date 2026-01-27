import { Request, Response } from 'express';
import { listTopics, createTopic } from '../services/topics.service.js';

export const getTopicsHandler = async (_req: Request, res: Response) => {
  try {
    const items = await listTopics();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
};

export const addTopicHandler = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'name is required' });
    }
    const item = await createTopic(name);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add topic' });
  }
};
