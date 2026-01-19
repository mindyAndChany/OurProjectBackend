import { Request, Response } from 'express';
import { getLessons, addLesson, updateLessonById, deleteLessonById } from '../services/lessons.service.js';

export const getLessonsHandler = async (_req: Request, res: Response) => {
  try {
    const items = await getLessons();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};

export const addLessonHandler = async (req: Request, res: Response) => {
  try {
    const item = await addLesson(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding lesson:', error);
    res.status(500).json({ error: 'Failed to add lesson', details: error instanceof Error ? error.message : String(error) });
  }
};

export const updateLessonHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateLessonById(Number(id), req.body);
    if (!updated) return res.status(404).json({ error: 'Lesson not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson' });
  }
};

export const deleteLessonHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteLessonById(Number(id));
    if (!deleted) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
};