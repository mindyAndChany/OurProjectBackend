import { Router } from 'express';
import { getWeeklySchedulesHandler, addWeeklyScheduleHandler, updateWeeklyScheduleHandler, deleteWeeklyScheduleHandler } from '../controllers/weeklySchedule.controller.js';

/**
 * @openapi
 * /api/weekly-schedules:
 *   get:
 *     summary: Get all weekly schedules
 *     tags:
 *       - WeeklySchedules
 *     responses:
 *       200:
 *         description: List of weekly schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WeeklySchedule'
 *   post:
 *     summary: Add a new weekly schedule
 *     tags:
 *       - WeeklySchedules
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WeeklySchedule'
 *     responses:
 *       201:
 *         description: Weekly schedule created
 * /api/weekly-schedules/{id}:
 *   put:
 *     summary: Update a weekly schedule
 *     tags:
 *       - WeeklySchedules
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
 *             $ref: '#/components/schemas/WeeklySchedule'
 *     responses:
 *       200:
 *         description: Weekly schedule updated
 *   delete:
 *     summary: Delete a weekly schedule
 *     tags:
 *       - WeeklySchedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Weekly schedule deleted
 */
const router = Router();

router.get('/', getWeeklySchedulesHandler);
router.post('/', addWeeklyScheduleHandler);
router.put('/:id', updateWeeklyScheduleHandler);
router.delete('/:id', deleteWeeklyScheduleHandler);

export default router;
