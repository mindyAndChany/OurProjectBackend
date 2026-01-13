import { ApiProperty } from '@nestjs/swagger';

export class ClassDto {
  @ApiProperty() id!: number;
  @ApiProperty() course_id!: number;
  @ApiProperty() name!: string;
  @ApiProperty() year!: number;
  @ApiProperty() teacher_name!: string;
  @ApiProperty({ required: false }) base_schedule?: string;
}
