import { Router } from 'express';
import { getTopicsHandler, addTopicHandler, getTopicsByCourseHandler } from '../controllers/topics.controller.js';

/**
 * @openapi
 * /api/topics:
 *   get:
 *     summary: List topics
 *     tags:
 *       - Topics
 *     responses:
 *       200:
 *         description: List of topics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Topic'
 *   post:
 *     summary: Create topic
 *     tags:
 *       - Topics
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               course_id:
 *                 type: integer
 *             required:
 *               - name
 *               - course_id
 *     responses:
 *       201:
 *         description: Topic created
 *
 * /api/topics/course/{courseId}:
 *   get:
 *     summary: List topics by course
 *     tags:
 *       - Topics
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of topics for the course
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Topic'
 */
const router = Router();

router.get('/', getTopicsHandler);
router.post('/', addTopicHandler);
router.get('/course/:courseId', getTopicsByCourseHandler);

export default router;
