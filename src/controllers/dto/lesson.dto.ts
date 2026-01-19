import { ApiProperty } from '@nestjs/swagger';

export class LessonDto {
  @ApiProperty() id!: number;
  @ApiProperty() class_id!: number;
  @ApiProperty() date!: string;
  @ApiProperty() start_time!: string;
  @ApiProperty() end_time!: string;
  @ApiProperty({ required: false }) topic?: string;
  // @ApiProperty({ required: false }) teacher_name?: string;
  @ApiProperty({ default: false }) is_cancelled?: boolean;
  @ApiProperty({ required: false }) cancellation_reason?: string;
}
