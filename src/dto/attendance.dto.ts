import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  @IsNotEmpty()
  studentId: number = 0;

  @IsNumber()
  @IsNotEmpty()
  lessonId: number = 0;

  @IsIn([1, 2, 3, 0, 'present', 'late', 'absent', 'approved absent'])
  @IsNotEmpty()
  status: number | 'present' | 'late' | 'absent' | 'approved absent' = 'present';
}

export class UpdateAttendanceDto {
  @IsIn([1, 2, 3, 0, 'present', 'late', 'absent', 'approved absent'])
  @IsNotEmpty()
  status: number | 'present' | 'late' | 'absent' | 'approved absent' = 'present';
}