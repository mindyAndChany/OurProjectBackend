import { ApiProperty } from '@nestjs/swagger';

export class WeeklyScheduleDto {
  @ApiProperty() id!: number;
  @ApiProperty() class_id!: number;
  @ApiProperty() day_of_week!: string;
  @ApiProperty() start_time!: string;
  @ApiProperty() end_time!: string;
  @ApiProperty({ required: false }) topic?: string;
  @ApiProperty({ required: false, description: 'שנת לימודים (למשל 2025)' }) year?: number;
  // @ApiProperty({ required: false }) teacher_name?: string;
}
