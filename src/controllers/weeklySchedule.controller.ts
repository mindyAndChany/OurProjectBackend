import { Request, Response } from 'express';
import { getWeeklySchedules, addWeeklySchedule, updateWeeklyScheduleById, deleteWeeklyScheduleById } from '../services/weeklySchedule.service.js';

export const getWeeklySchedulesHandler = async (_req: Request, res: Response) => {
  try {
    const items = await getWeeklySchedules();
    res.json(items);
  } catch (error) {
    console.error('Failed to fetch weekly schedules:', error);
    res.status(500).json({ error: 'Failed to fetch weekly schedules' });
  }
};

export const addWeeklyScheduleHandler = async (req: Request, res: Response) => {
  try {
    const item = await addWeeklySchedule(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add weekly schedule' });
  }
};

export const updateWeeklyScheduleHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateWeeklyScheduleById(Number(id), req.body);
    if (!updated) return res.status(404).json({ error: 'Weekly schedule not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update weekly schedule' });
  }
};

export const deleteWeeklyScheduleHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteWeeklyScheduleById(Number(id));
    if (!deleted) return res.status(404).json({ error: 'Weekly schedule not found' });
    res.json({ message: 'Weekly schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete weekly schedule' });
  }
};