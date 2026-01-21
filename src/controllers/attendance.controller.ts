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
        // Support both snake_case and camelCase fields from clients
        const body: any = req.body as any;
        const studentIdentifier = body.student_id ?? body.studentId ?? body.student_identifier ?? body.studentIdNumber ?? body.id_number;
        const lessonIdentifier = body.lesson_id ?? body.lessonId;
        const payload = {
            student_id: studentIdentifier,
            lesson_id: Number(lessonIdentifier),
            status: body.status as 'present' | 'late' | 'absent' | 'approved absent',
        };
        const item = await createAttendance(payload as any);
        res.status(201).json(item);
    } catch (error) {
        // Minimal logging for diagnostics without leaking sensitive data
        // eslint-disable-next-line no-console
        console.error('Failed to create attendance:', error);
        const message = (error as Error)?.message ?? '';
        if (message.includes('Student not found')) {
            return res.status(400).json({ error: 'Student not found for provided identifier' });
        }
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
