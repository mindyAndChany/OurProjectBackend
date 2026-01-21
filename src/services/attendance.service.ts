import { Attendance } from '../models/attendance.model.js';

export const getAllAttendance = async () => {
  return await Attendance.findAll();
};

export const getAttendanceById = async (id: number) => {
  return await Attendance.findByPk(id);
};

export const createAttendance = async (data: {
  student_id: number;
  lesson_id: number;
  status: 'present' | 'late' | 'absent' | 'approved absent';
}) => {
  return await Attendance.create(data as any);
};

export const updateAttendanceById = async (
  id: number,
  data: Partial<{
    student_id: number;
    lesson_id: number;
    status: 'present' | 'late' | 'absent' | 'approved absent';
  }>
) => {
  const attendance = await Attendance.findByPk(id);
  if (!attendance) return null;
  await attendance.update(data as any);
  return attendance;
};

export const deleteAttendanceById = async (id: number) => {
  const deleted = await Attendance.destroy({ where: { id } });
  return deleted > 0;
};
