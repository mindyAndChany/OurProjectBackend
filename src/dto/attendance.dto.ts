import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  @IsNotEmpty()
  studentId: number = 0;

  @IsNumber()
  @IsNotEmpty()
  lessonId: number = 0;

  @IsEnum(['present', 'late', 'absent', 'approved absent'])
  @IsNotEmpty()
  status: 'present' | 'late' | 'absent' | 'approved absent' = 'present';
}

export class UpdateAttendanceDto {
  @IsEnum(['present', 'late', 'absent', 'approved absent'])
  @IsNotEmpty()
  status: 'present' | 'late' | 'absent' | 'approved absent' = 'present';
}