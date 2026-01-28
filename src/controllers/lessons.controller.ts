import { Request, Response } from 'express';
import { getLessons, addLesson, updateLessonById, deleteLessonById } from '../services/lessons.service.js';

// Helper to format common Sequelize errors for clearer responses
const formatError = (error: unknown) => {
  const err: any = error;
  const name: string = err?.name ?? 'Error';
  const message: string = err?.message ?? String(error);
  const details: any = {};

  if (name === 'SequelizeValidationError' || name === 'ValidationError') {
    details.type = 'validation';
    details.errors = (err?.errors || []).map((e: any) => ({
      message: e?.message,
      path: e?.path,
      value: e?.value,
      validatorKey: e?.validatorKey,
    }));
  } else if (name === 'SequelizeUniqueConstraintError' || name === 'UniqueConstraintError') {
    details.type = 'unique-constraint';
    details.fields = err?.fields;
  } else if (name === 'SequelizeForeignKeyConstraintError' || name === 'ForeignKeyConstraintError') {
    details.type = 'foreign-key';
    details.index = err?.index;
    details.fields = err?.fields;
  }

  return { name, message, details };
};

export const getLessonsHandler = async (_req: Request, res: Response) => {
  try {
    const items = await getLessons();
    res.json(items);
  } catch (error) {
    const formatted = formatError(error);
    console.error('Error fetching lessons:', formatted);
    res.status(500).json({ error: 'Failed to fetch lessons', ...formatted });
  }
};

export const addLessonHandler = async (req: Request, res: Response) => {
  try {
    const item = await addLesson(req.body);
    res.status(201).json(item);
  } catch (error) {
    const formatted = formatError(error);
    console.error('Error adding lesson:', { body: req.body, error: formatted });
    const status = formatted.details?.type === 'validation' ? 400
      : formatted.details?.type === 'unique-constraint' ? 409
      : formatted.details?.type === 'foreign-key' ? 400
      : 500;
    res.status(status).json({ error: 'Failed to add lesson', ...formatted });
  }
};

export const updateLessonHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateLessonById(Number(id), req.body);
    if (!updated) return res.status(404).json({ error: 'Lesson not found' });
    res.json(updated);
  } catch (error) {
    const formatted = formatError(error);
    console.error('Error updating lesson:', { params: req.params, body: req.body, error: formatted });
    const status = formatted.details?.type === 'validation' ? 400
      : formatted.details?.type === 'unique-constraint' ? 409
      : formatted.details?.type === 'foreign-key' ? 400
      : 500;
    res.status(status).json({ error: 'Failed to update lesson', ...formatted });
  }
};

export const deleteLessonHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteLessonById(Number(id));
    if (!deleted) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    const formatted = formatError(error);
    console.error('Error deleting lesson:', { params: req.params, error: formatted });
    res.status(500).json({ error: 'Failed to delete lesson', ...formatted });
  }
};