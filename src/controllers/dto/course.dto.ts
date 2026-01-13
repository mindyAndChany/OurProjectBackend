import { ApiProperty } from '@nestjs/swagger';

export class CourseDto {
  @ApiProperty() id!: number;
  @ApiProperty() name!: string;
  @ApiProperty() type!: string; // kodesh / hora'ah / hitmahut
}
