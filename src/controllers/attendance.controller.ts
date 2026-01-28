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
        const normalizeStatus = (val: any): 'present' | 'late' | 'absent' | 'approved absent' => {
            const map: Record<string, 'present' | 'late' | 'absent' | 'approved absent'> = {
                '0': 'present',
                '1': 'late',
                '2': 'absent',
                '3': 'approved absent',
            };
            if (typeof val === 'number') val = String(val);
            if (typeof val === 'string') {
                const trimmed = val.trim().toLowerCase();
                if (map[trimmed]) return map[trimmed];
                if (["present","late","absent","approved absent"].includes(trimmed)) return trimmed as any;
            }
            throw new Error('Invalid attendance status');
        };
        const payload = {
            student_id: studentIdentifier,
            lesson_id: Number(lessonIdentifier),
            status: normalizeStatus(body.status),
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
        if (message.includes('Invalid attendance status')) {
            return res.status(400).json({ error: 'Invalid attendance status. Use 1-4 or enum string.' });
        }
        res.status(500).json({ error: 'Failed to create attendance' });
    }
};

export const updateAttendanceHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const body: any = req.body as any;
        if (body?.status === undefined) {
            return res.status(400).json({ error: 'status is required' });
        }
        const map: Record<string, 'present' | 'late' | 'absent' | 'approved absent'> = {
            '0': 'present',
            '1': 'late',
            '2': 'absent',
            '3': 'approved absent',
        };
        let val: any = body.status;
        if (typeof val === 'number') val = String(val);
        let normalized: 'present' | 'late' | 'absent' | 'approved absent';
        if (typeof val === 'string') {
            const trimmed = val.trim().toLowerCase();
            if (map[trimmed]) {
                normalized = map[trimmed];
            } else if (["present","late","absent","approved absent"].includes(trimmed)) {
                normalized = trimmed as any;
            } else {
                return res.status(400).json({ error: 'Invalid attendance status. Use 1-4 or enum string.' });
            }
        } else {
            return res.status(400).json({ error: 'Invalid attendance status. Use 1-4 or enum string.' });
        }
        const updated = await updateAttendanceById(Number(id), { status: normalized });
        if (!updated) return res.status(404).json({ error: 'Attendance not found' });
        res.json(updated);
    } catch (error) {
        const message = (error as Error)?.message ?? '';
        // eslint-disable-next-line no-console
        console.error('Failed to update attendance:', message);
        res.status(500).json({ error: 'Failed to update attendance', details: message });
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
