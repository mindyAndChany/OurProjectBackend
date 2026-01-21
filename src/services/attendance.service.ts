import { Attendance } from '../models/attendance.model.js';
import { Student } from '../models/student.model.js';

export const getAllAttendance = async () => {
  return await Attendance.findAll();
};

export const getAllAttendanceByStudent = async (studentId:number) => {
return await Attendance.findAll({
  where: {
    student_id: studentId
  }
});
};

export const getAllAttendanceByLesson = async (lesson_id:number) => {
  return await Attendance.findAll({
  where: {
    lesson_id: lesson_id
  }
});
};

export const getAttendanceById = async (id: number) => {
  return await Attendance.findByPk(id);
};

// Resolve incoming student identifier to the internal Student PK (id)
const resolveStudentPk = async (studentIdentifier: number | string): Promise<number> => {
  // 1) Try as primary key (numeric auto-increment id)
  const pk = Number(studentIdentifier);
  if (!Number.isNaN(pk)) {
    const byPk = await Student.findByPk(pk);
    if (byPk) return byPk.id;
  }

  // 2) Fallback: try as national/id_number (stored as string)
  const byIdNumber = await Student.findOne({ where: { id_number: String(studentIdentifier) } });
  if (byIdNumber) return byIdNumber.id;

  throw new Error('Student not found for provided identifier');
};

export const createAttendance = async (data: {
  student_id: number | string;
  lesson_id: number;
  status: 'present' | 'late' | 'absent' | 'approved absent';
}) => {
  const resolvedStudentId = await resolveStudentPk(data.student_id);
  return await Attendance.create({
    student_id: resolvedStudentId,
    lesson_id: data.lesson_id,
    status: data.status,
  } as any);
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
