import { Request, Response } from 'express';
import {
    getAllAttendance,
    getAttendanceById,
    createAttendance,
    updateAttendanceById,
    deleteAttendanceById,
    getAllAttendanceByLesson,
    getAllAttendanceByStudent,
} from '../services/attendance.service.js';

export const getAttendanceListHandler = async (_req: Request, res: Response) => {
    try {
        const items = await getAllAttendance();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
};

export const getAttendanceListByLessonHandler = async (req: Request, res: Response) => {
    try {
        const { lessonId } = req.params;
        const items = await getAllAttendanceByLesson(Number(lessonId));
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
};

export const getAttendanceListByStudentHandler = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const items = await getAllAttendanceByStudent(Number(studentId));
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
};

export const getAttendanceByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await getAttendanceById(Number(id));
        if (!item) return res.status(404).json({ error: 'Attendance not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch attendance item' });
    }
};

export const createAttendanceHandler = async (req: Request, res: Response) => {
    try {
        const item = await createAttendance(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create attendance' });
    }
};

export const updateAttendanceHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updated = await updateAttendanceById(Number(id), req.body);
        if (!updated) return res.status(404).json({ error: 'Attendance not found' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update attendance' });
    }
};

export const deleteAttendanceHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await deleteAttendanceById(Number(id));
        if (!deleted) return res.status(404).json({ error: 'Attendance not found' });
        res.json({ message: 'Attendance deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete attendance' });
    }
};
