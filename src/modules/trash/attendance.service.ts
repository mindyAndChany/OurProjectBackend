// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Attendance } from '../models/attendance.model';
// import { CreateAttendanceDto } from '../dto/attendance.dto';

// @Injectable()
// export class AttendanceService {
//   constructor(
//     @InjectRepository(Attendance)
//     private readonly attendanceRepository: Repository<Attendance>,
//   ) {}

//   async createAttendance(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
//     const attendance = this.attendanceRepository.create(createAttendanceDto);
//     return this.attendanceRepository.save(attendance);
//   }

//   async getAttendanceByStudentAndLesson(studentId: number, lessonId: number): Promise<Attendance | null> {
//     return this.attendanceRepository.findOne({
//       where: { student: { id: studentId }, lesson: { id: lessonId } },
//       relations: ['student', 'lesson'],
//     });
//   }

//    async getAttendanceByStudent(studentId: number): Promise<Attendance | null> {
//     return this.attendanceRepository.findOne({
//       where: { student: { id: studentId } },
//       relations: ['student'],
//     });
//   }

//    async getAttendanceByLesson(lessonId: number): Promise<Attendance | null> {
//     return this.attendanceRepository.findOne({
//       where: {  lesson: { id: lessonId } },
//       relations: [ 'lesson'],
//     });
//   }

//   async updateAttendanceStatus(id: number, status: 'present' | 'late' | 'absent' | 'approved absent'): Promise<Attendance> {
//     const attendance = await this.attendanceRepository.findOne({ where: { id } });
//     if (!attendance) {
//       throw new Error('Attendance record not found');
//     }
//     attendance.status = status;
//     return this.attendanceRepository.save(attendance);
//   }

//   async getAllAttendance(): Promise<Attendance[]> {
//     return this.attendanceRepository.find({ relations: ['student', 'lesson'] });
//   }

//   async getAttendanceById(id: number): Promise<Attendance | null> {
//     return this.attendanceRepository.findOne({ where: { id }, relations: ['student', 'lesson'] });
//   }

//   async updateAttendanceById(id: number, data: Partial<CreateAttendanceDto>): Promise<Attendance | null> {
//     const attendance = await this.attendanceRepository.findOne({ where: { id } });
//     if (!attendance) {
//       return null;
//     }
//     Object.assign(attendance, data);
//     return this.attendanceRepository.save(attendance);
//   }

//   async deleteAttendanceById(id: number): Promise<boolean> {
//     const result = await this.attendanceRepository.delete(id);
//     return (result.affected ?? 0) > 0;
//   }
// }