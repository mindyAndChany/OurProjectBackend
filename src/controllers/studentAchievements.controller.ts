import type { Request, Response } from 'express';
import { getStudentAchievements, getStudentAchievementById, createStudentAchievement, updateStudentAchievementById, deleteStudentAchievementById } from '../services/studentAchievements.service.js';

export const getStudentAchievementsHandler = async (req: Request, res: Response) => {
  try {
    const { student_id, topic, semester } = req.query;
    const filters: Partial<{ student_id: number; topic: string; semester: string }> = {};
    if (student_id !== undefined) filters.student_id = Number(student_id);
    if (topic !== undefined) filters.topic = String(topic);
    if (semester !== undefined) filters.semester = String(semester);
    const list = await getStudentAchievements(filters);
    res.json(list);
  } catch (error) {
    console.error('Failed to get achievements:', error);
    res.status(500).json({ error: 'Failed to get student achievements' });
  }
};

export const getStudentAchievementByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await getStudentAchievementById(Number(id));
    if (!item) return res.status(404).json({ error: 'Student achievement not found' });
    res.json(item);
  } catch (error) {
    console.error('Failed to get achievement by id:', error);
    res.status(500).json({ error: 'Failed to get student achievement' });
  }
};

export const createStudentAchievementHandler = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const created = await createStudentAchievement(payload);
    res.status(201).json(created);
  } catch (error: any) {
    const msg = error?.message || 'Failed to create student achievement';
    const status = msg.includes('unique') ? 409 : 500;
    res.status(status).json({ error: msg });
  }
};

export const updateStudentAchievementHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateStudentAchievementById(Number(id), req.body);
    if (!updated) return res.status(404).json({ error: 'Student achievement not found' });
    res.json(updated);
  } catch (error) {
    console.error('Failed to update student achievement:', error);
    res.status(500).json({ error: 'Failed to update student achievement' });
  }
};

export const deleteStudentAchievementHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteStudentAchievementById(Number(id));
    if (!deleted) return res.status(404).json({ error: 'Student achievement not found' });
    res.json({ message: 'Student achievement deleted successfully' });
  } catch (error) {
    console.error('Failed to delete student achievement:', error);
    res.status(500).json({ error: 'Failed to delete student achievement' });
  }
};
