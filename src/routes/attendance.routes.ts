import { Router } from 'express';
import {
  getAttendanceListHandler,
  getAttendanceByIdHandler,
  createAttendanceHandler,
  updateAttendanceHandler,
  deleteAttendanceHandler,
  getAttendanceListByLessonHandler,
  getAttendanceListByStudentHandler,
} from '../controllers/attendance.controller.js';

/**
 * @openapi
 * /api/attendance:
 *   get:
 *     summary: Get all attendance records
 *     tags:
 *       - Attendance
 *     responses:
 *       200:
 *         description: List of attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *   post:
 *     summary: Create a new attendance record
 *     tags:
 *       - Attendance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attendance'
 *     responses:
 *       201:
 *         description: Attendance created
 * /api/attendance/{id}:
 *   get:
 *     summary: Get attendance by ID
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attendance record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: Attendance not found
 *   put:
 *     summary: Update an attendance record
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attendance'
 *     responses:
 *       200:
 *         description: Attendance updated
 *       404:
 *         description: Attendance not found
 *   delete:
 *     summary: Delete an attendance record
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attendance deleted
 *       404:
 *         description: Attendance not found
 */

/**
 * @openapi
 * /api/attendance/getByLesson/{lessonId}:
 *   get:
 *     summary: Get attendance by lesson ID
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of attendance for the lesson
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 * /api/attendance/getByStudent/{studentId}:
 *   get:
 *     summary: Get attendance by student ID
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of attendance for the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 */
const router = Router();

router.get('/', getAttendanceListHandler);
router.get('/getByLesson/:lessonId', getAttendanceListByLessonHandler);
router.get('/getByStudent/:studentId', getAttendanceListByStudentHandler);
router.post('/', createAttendanceHandler);
router.get('/:id', getAttendanceByIdHandler);
router.put('/:id', updateAttendanceHandler);
router.delete('/:id', deleteAttendanceHandler);

export default router;
