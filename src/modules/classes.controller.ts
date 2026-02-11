import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ClassesService } from './classes.service.js';

@ApiTags('Classes')
@Controller('api/classes')
export class ClassesController {
  constructor(private readonly svc: ClassesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of classes' })
  async getAll() {
    return this.svc.findAll();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Class created' })
  async create(@Body() body: any) {
    return this.svc.create(body);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Class updated' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Class deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
