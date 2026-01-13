import { Request, Response } from 'express';
import { getCourses, addCourse, updateCourseById, deleteCourseById } from '../services/courses.service.js';

export const getCoursesHandler = async (_req: Request, res: Response) => {
  try {
    const items = await getCourses();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const addCourseHandler = async (req: Request, res: Response) => {
  try {
    const item = await addCourse(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add course' });
  }
};

export const updateCourseHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateCourseById(Number(id), req.body);
    if (!updated) return res.status(404).json({ error: 'Course not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
};

export const deleteCourseHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteCourseById(Number(id));
    if (!deleted) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
};