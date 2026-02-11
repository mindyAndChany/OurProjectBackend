import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { WeeklySchedulesService } from './weeklySchedules.service.js';

@ApiTags('WeeklySchedules')
@Controller('api/weekly-schedules')
export class WeeklySchedulesController {
  constructor(private readonly svc: WeeklySchedulesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of weekly schedules' })
  async getAll() {
    return this.svc.findAll();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Weekly schedule created' })
  async create(@Body() body: any) {
    return this.svc.create(body);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Weekly schedule updated' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Weekly schedule deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
