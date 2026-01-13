import { Request, Response } from 'express';
import { getClasses, addClass, updateClassById, deleteClassById } from '../services/classes.service.js';

export const getClassesHandler = async (_req: Request, res: Response) => {
  try {
    const items = await getClasses();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

export const addClassHandler = async (req: Request, res: Response) => {
  try {
    const item = await addClass(req.body);
    res.status(201).json(item);
  } catch (error) {
    // Log the underlying error for debugging
    console.error('Failed to add class:', error);
    // Include minimal detail in the response when debugging locally
    res.status(500).json({ error: 'Failed to add class', details: (error as Error).message || String(error) });
  }
};

export const updateClassHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateClassById(Number(id), req.body);
    if (!updated) return res.status(404).json({ error: 'Class not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update class' });
  }
};

export const deleteClassHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteClassById(Number(id));
    if (!deleted) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete class' });
  }
};