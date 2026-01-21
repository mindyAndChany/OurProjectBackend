import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';

@ApiTags('Lessons')
@Controller('api/lessons')
export class LessonsController {
  constructor(private readonly svc: LessonsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of lessons' })
  async getAll() {
    return this.svc.findAll();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Lesson created' })
  async create(@Body() body: any) {
    return this.svc.create(body);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Lesson updated' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Lesson deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
