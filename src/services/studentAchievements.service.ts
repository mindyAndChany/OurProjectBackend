import { StudentAchievement } from '../models/student_achievement.model.js';

export type CreateStudentAchievementInput = {
  student_id: number;
  topic: string;
  semester: string;
  final_grade?: number | null;
  attendance_percentage: number;
};

export type UpdateStudentAchievementInput = Partial<Pick<CreateStudentAchievementInput, 'topic' | 'semester' | 'final_grade' | 'attendance_percentage'>>;

export const getStudentAchievements = async (filters?: Partial<{ student_id: number; topic: string; semester: string }>) => {
  const where: any = {};
  if (filters?.student_id !== undefined) where.student_id = filters.student_id;
  if (filters?.topic !== undefined) where.topic = filters.topic;
  if (filters?.semester !== undefined) where.semester = filters.semester;
  return await StudentAchievement.findAll({ where, order: [['created_at', 'DESC']] });
};

export const getStudentAchievementById = async (id: number) => {
  return await StudentAchievement.findByPk(id);
};

export const createStudentAchievement = async (data: CreateStudentAchievementInput) => {
  return await StudentAchievement.create({
    student_id: data.student_id,
    topic: data.topic.trim(),
    semester: data.semester.trim(),
    final_grade: data.final_grade ?? null,
    attendance_percentage: data.attendance_percentage,
  });
};

export const updateStudentAchievementById = async (id: number, data: UpdateStudentAchievementInput) => {
  const item = await StudentAchievement.findByPk(id);
  if (!item) return null;
  await item.update({
    topic: data.topic?.trim() ?? item.topic,
    semester: data.semester?.trim() ?? item.semester,
    final_grade: data.final_grade ?? item.final_grade,
    attendance_percentage: data.attendance_percentage ?? item.attendance_percentage,
  });
  return item;
};

export const deleteStudentAchievementById = async (id: number) => {
  const deleted = await StudentAchievement.destroy({ where: { id } });
  return deleted > 0;
};
