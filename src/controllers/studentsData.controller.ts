import { Controller, Get, Param, BadRequestException, Post, Body, Inject, Put } from '@nestjs/common';
import { GetAllStudentsDataService } from '../services/getAllStudentsData.service.js';
import { AddStudentService } from '../services/AddStudent.service.js';
import { UpdateStudentService } from '../services/UpdateStudent.service.js';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { StudentDto } from './dto/student.dto';
import { GetStudentByIdService } from '../services/getStudentById.service.js';



@ApiTags('Students')
@Controller('api/studentsData')
export class StudentsDataController {
  constructor(
    @Inject(GetAllStudentsDataService) private readonly service: GetAllStudentsDataService,
    @Inject(AddStudentService) private readonly addStudentService: AddStudentService,
    @Inject(UpdateStudentService) private readonly updateStudentService: UpdateStudentService,
    @Inject(GetStudentByIdService) private readonly getStudentByIdService: GetStudentByIdService, // ← חדש

  ) {
   
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
    // console.log('SERVICE IS:', this.service);

    if (!categories) throw new BadRequestException('categories parameter required');
    // categories are comma-separated field names
    const cols = categories.split(',').map((c) => c.trim()).filter(Boolean);
    if (cols.length === 0) throw new BadRequestException('no categories provided');
    return this.service.getStudentData(cols);
  }
@Get('getstudentById/:id')
@ApiOperation({ summary: 'Get full student by id_number' })
@ApiParam({ name: 'id', description: 'Student id_number' })
@ApiResponse({ status: 200, description: 'Full student object', type: () => StudentDto })
@ApiResponse({ status: 404, description: 'Student not found' })
async getStudentById(@Param('id') id: string) {
  const student = await this.getStudentByIdService.getByIdNumber(id);
  if (!student) {
    throw new BadRequestException('Student not found');
  }
  return student;
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

  // עדכון תלמיד לפי מספר זהות (id_number)
  @Put('updateStudent/:id')
  @ApiOperation({ summary: 'Update a student by id_number' })
  @ApiParam({ name: 'id', description: 'Student id_number' })
  @ApiBody({ schema: { type: 'object', additionalProperties: true } })
  @ApiResponse({ status: 200, description: 'Updated student object', type: () => StudentDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async updateStudent(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.updateStudentService.updateByIdNumber(id, body);
  }
}


