import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { getAllStudentsDataService } from '../services/getAllStudentsData.service.ts';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StudentDto } from './dto/student.dto.ts';

@ApiTags('Students')
@Controller('api/studentsData')
export class StudentsDataController {
  constructor(private readonly service: getAllStudentsDataService) {}

  @Get()
  @ApiOperation({ summary: 'Get all students (full records)' })
  @ApiResponse({ status: 200, description: 'Array of student objects', type: () => StudentDto, isArray: true })
  async findAll(): Promise<StudentDto[]> {
  const entities = await this.service.findAll();
  return entities.map((s) => ({
    id: s.id,
    first_name: s.first_name,
    last_name: s.last_name,
    id_number: s.id_number,
    phone: s.phone,
    track: s.track,
    paid_amount: s.paid_amount,
  }));
}

  @Get('getstudentData/:categories')
  @ApiOperation({ summary: 'Get specified fields for all students' })
  @ApiParam({ name: 'categories', description: 'Comma-separated field names to retrieve (e.g. first_name,last_name,track)' })
  @ApiResponse({ status: 200, description: 'Array of students with requested fields', type: () => StudentDto, isArray: true })
  @ApiResponse({ status: 400, description: 'Bad request (invalid or no categories)' })
  async getStudentData(@Param('categories') categories: string) {
    if (!categories) throw new BadRequestException('categories parameter required');
    // categories are comma-separated field names
    const cols = categories.split(',').map((c) => c.trim()).filter(Boolean);
    if (cols.length === 0) throw new BadRequestException('no categories provided');
    return this.service.getStudentData(cols);
  }
}
