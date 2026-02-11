import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CoursesService } from './courses.service.js';

@ApiTags('Courses')
@Controller('api/courses')
export class CoursesController {
  constructor(private readonly svc: CoursesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of courses' })
  async getAll() {
    return this.svc.findAll();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Course created' })
  async create(@Body() body: any) {
    return this.svc.create(body);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Course updated' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Course deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
