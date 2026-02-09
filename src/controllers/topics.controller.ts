import { Request, Response } from 'express';
import { listTopics, createTopic, listTopicsByCourse } from '../services/topics.service.js';

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
    const { name, course_id } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'name is required' });
    }
    if (course_id === undefined) {
      return res.status(400).json({ error: 'course_id is required' });
    }
    const parsedCourseId = Number(course_id);
    if (!Number.isInteger(parsedCourseId)) {
      return res.status(400).json({ error: 'course_id must be an integer' });
    }
    const item = await createTopic(name, parsedCourseId);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to add topic' });
  }
};

export const getTopicsByCourseHandler = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const parsedCourseId = Number(courseId);
    if (!Number.isInteger(parsedCourseId)) {
      return res.status(400).json({ error: 'courseId must be an integer' });
    }
    const items = await listTopicsByCourse(parsedCourseId);
    //במקרה שנבחרו לימודי קודש שנה א או ב תוסיף גם את המשותפים ל2 השנתונים
    if (parsedCourseId === 7 || parsedCourseId === 8) {
      const sharedItems = await listTopicsByCourse(19);
      items.push(...sharedItems);
    }
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to fetch topics by course' });
  }
};
