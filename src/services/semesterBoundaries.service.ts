import { SemesterBoundary } from '../models/semester_boundary.model.js';

export type CreateSemesterBoundaryInput = {
  year: number;
  switch_date: string; // YYYY-MM-DD
};

export type UpdateSemesterBoundaryInput = Partial<Pick<CreateSemesterBoundaryInput, 'switch_date'>>;

export const getSemesterBoundaries = async () => {
  return await SemesterBoundary.findAll({ order: [['year', 'ASC']] });
};

export const getSemesterBoundaryByYear = async (year: number) => {
  return await SemesterBoundary.findByPk(year);
};

export const createSemesterBoundary = async (data: CreateSemesterBoundaryInput) => {
  return await SemesterBoundary.create({ year: data.year, switch_date: data.switch_date });
};

export const updateSemesterBoundaryByYear = async (year: number, data: UpdateSemesterBoundaryInput) => {
  const item = await SemesterBoundary.findByPk(year);
  if (!item) return null;
  await item.update({ switch_date: data.switch_date ?? item.switch_date });
  return item;
};

export const deleteSemesterBoundaryByYear = async (year: number) => {
  const deleted = await SemesterBoundary.destroy({ where: { year } });
  return deleted > 0;
};
