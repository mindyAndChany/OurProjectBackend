import { Router } from 'express';
import { getStudentAchievementsHandler, getStudentAchievementByIdHandler, createStudentAchievementHandler, updateStudentAchievementHandler, deleteStudentAchievementHandler } from '../controllers/studentAchievements.controller.js';

const router = Router();

/**
 * @openapi
 * /api/student-achievements:
 *   get:
 *     summary: Get student achievements
 *     tags:
 *       - Student Achievements
 *     parameters:
 *       - in: query
 *         name: student_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: topic
 *         schema:
 *           type: string
 *       - in: query
 *         name: semester
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentAchievement'
 *   post:
 *     summary: Create a student achievement
 *     tags:
 *       - Student Achievements
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentAchievementCreateRequest'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentAchievement'
 */
router.get('/', getStudentAchievementsHandler);
router.post('/', createStudentAchievementHandler);

/**
 * @openapi
 * /api/student-achievements/{id}:
 *   get:
 *     summary: Get achievement by id
 *     tags:
 *       - Student Achievements
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Achievement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentAchievement'
 *   put:
 *     summary: Update achievement by id
 *     tags:
 *       - Student Achievements
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
 *             $ref: '#/components/schemas/StudentAchievementUpdateRequest'
 *     responses:
 *       200:
 *         description: Updated achievement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentAchievement'
 *   delete:
 *     summary: Delete achievement by id
 *     tags:
 *       - Student Achievements
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 */
router.get('/:id', getStudentAchievementByIdHandler);
router.put('/:id', updateStudentAchievementHandler);
router.delete('/:id', deleteStudentAchievementHandler);

export default router;
