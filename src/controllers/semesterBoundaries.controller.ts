import type { Request, Response } from 'express';
import { getSemesterBoundaries, getSemesterBoundaryByYear, createSemesterBoundary, updateSemesterBoundaryByYear, deleteSemesterBoundaryByYear } from '../services/semesterBoundaries.service.js';

export const getSemesterBoundariesHandler = async (_req: Request, res: Response) => {
  try {
    const list = await getSemesterBoundaries();
    res.json(list);
  } catch (error) {
    console.error('Failed to get semester boundaries:', error);
    res.status(500).json({ error: 'Failed to get semester boundaries' });
  }
};

export const getSemesterBoundaryByYearHandler = async (req: Request, res: Response) => {
  try {
    const { year } = req.params;
    const item = await getSemesterBoundaryByYear(Number(year));
    if (!item) return res.status(404).json({ error: 'Semester boundary not found' });
    res.json(item);
  } catch (error) {
    console.error('Failed to get semester boundary by year:', error);
    res.status(500).json({ error: 'Failed to get semester boundary' });
  }
};

export const createSemesterBoundaryHandler = async (req: Request, res: Response) => {
  try {
    const created = await createSemesterBoundary(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    const msg = error?.message || 'Failed to create semester boundary';
    const status = msg.includes('duplicate') || msg.includes('unique') || msg.includes('Primary key') ? 409 : 500;
    res.status(status).json({ error: msg });
  }
};

export const updateSemesterBoundaryHandler = async (req: Request, res: Response) => {
  try {
    const { year } = req.params;
    const updated = await updateSemesterBoundaryByYear(Number(year), req.body);
    if (!updated) return res.status(404).json({ error: 'Semester boundary not found' });
    res.json(updated);
  } catch (error) {
    console.error('Failed to update semester boundary:', error);
    res.status(500).json({ error: 'Failed to update semester boundary' });
  }
};

export const deleteSemesterBoundaryHandler = async (req: Request, res: Response) => {
  try {
    const { year } = req.params;
    const deleted = await deleteSemesterBoundaryByYear(Number(year));
    if (!deleted) return res.status(404).json({ error: 'Semester boundary not found' });
    res.json({ message: 'Semester boundary deleted successfully' });
  } catch (error) {
    console.error('Failed to delete semester boundary:', error);
    res.status(500).json({ error: 'Failed to delete semester boundary' });
  }
};
