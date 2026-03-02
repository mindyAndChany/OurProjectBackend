import { Router } from 'express';
import { getLessonsHandler, addLessonHandler, updateLessonHandler, deleteLessonHandler } from '../controllers/lessons.controller.js';

/**
 * @openapi
 * /api/lessons:
 *   get:
 *     summary: Get all lessons (optional filtering)
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter lessons on this date (YYYY-MM-DD)
 *       - in: query
 *         name: start_time
 *         schema:
 *           type: string
 *         description: Minimum lesson start time (inclusive, e.g. "08:00")
 *       - in: query
 *         name: end_time
 *         schema:
 *           type: string
 *         description: Maximum lesson end time (inclusive, e.g. "10:00")
 *     responses:
 *       200:
 *         description: List of lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *   post:
 *     summary: Add a new lesson
 *     tags:
 *       - Lessons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       201:
 *         description: Lesson created
 * /api/lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     tags:
 *       - Lessons
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
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       200:
 *         description: Lesson updated
 *   delete:
 *     summary: Delete a lesson
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lesson deleted
 */
const router = Router();

router.get('/', getLessonsHandler);
router.post('/', addLessonHandler);
router.put('/:id', updateLessonHandler);
router.delete('/:id', deleteLessonHandler);

export default router;
