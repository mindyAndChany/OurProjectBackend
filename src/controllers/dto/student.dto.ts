import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
  @ApiProperty() id!: number;
  @ApiProperty() first_name!: string;
  @ApiProperty() last_name!: string;
  @ApiProperty() id_number!: string;
  @ApiProperty() phone!: string;
  @ApiProperty({ required: false }) track?: string;
  @ApiProperty({ required: false }) paid_amount?: number;
}
