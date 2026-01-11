import { Controller, Get, Param, BadRequestException, Post, Body, Inject } from '@nestjs/common';
import { GetAllStudentsDataService } from '../services/getAllStudentsData.service';
import { AddStudentService } from '../services/AddStudent.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StudentDto } from './dto/student.dto';



@ApiTags('Students')
@Controller('api/studentsData')
export class StudentsDataController {
  constructor(
    @Inject(GetAllStudentsDataService) private readonly service: GetAllStudentsDataService,
    @Inject(AddStudentService) private readonly addStudentService: AddStudentService,
  ) {
    console.log('SERVICE CLASS TYPE:', service ? service.constructor?.name : '<<undefined>>');
    console.log('SERVICE CLASS TYPE:', addStudentService ? addStudentService.constructor?.name : '<<undefined>>');
    console.log('SERVICE typeof:', typeof service, 'ADD_SERVICE typeof:', typeof addStudentService);
  }

  //קבלת נתונים בסיסיים של כל התלמידים
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
  }));
}

// קבלת שדות ספציפיים עבור כל התלמידים
  @Get('getstudentData/:categories')
  @ApiOperation({ summary: 'Get specified fields for all students' })
  @ApiParam({ name: 'categories', description: 'Comma-separated field names to retrieve (e.g. first_name,last_name,track)' })
  @ApiResponse({ status: 200, description: 'Array of students with requested fields', type: () => StudentDto, isArray: true })
  @ApiResponse({ status: 400, description: 'Bad request (invalid or no categories)' })
  async getStudentData(@Param('categories') categories: string) {
    console.log('SERVICE IS:', this.service);

    if (!categories) throw new BadRequestException('categories parameter required');
    // categories are comma-separated field names
    const cols = categories.split(',').map((c) => c.trim()).filter(Boolean);
    if (cols.length === 0) throw new BadRequestException('no categories provided');
    return this.service.getStudentData(cols);
  }

     // ✅ פונקציה להוספת **מערך** תלמידים
  @Post('addStudents')
  @ApiOperation({ summary: 'Add multiple students to the database' })
  @ApiResponse({ status: 201, description: 'Students added successfully', type: () => StudentDto, isArray: true })
  async addStudents(@Body() students: Record<string, any>[]) {
    if (!Array.isArray(students) || students.length === 0) {
      throw new BadRequestException('Request body must be a non-empty array');
    }

    const results = [];
    for (const student of students) {
      const created = await this.addStudentService.addStudent(student);
      results.push(created);
    }

    return results;
  }
}


