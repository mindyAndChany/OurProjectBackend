import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'semester_boundaries', timestamps: false })
export class SemesterBoundary extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  year!: number;

  @Column(DataType.DATEONLY)
  switch_date!: string; // stored as DATE in DB, YYYY-MM-DD
}
