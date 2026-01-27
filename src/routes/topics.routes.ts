import { Router } from 'express';
import { getTopicsHandler, addTopicHandler } from '../controllers/topics.controller.js';

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
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Topic created
 */
const router = Router();

router.get('/', getTopicsHandler);
router.post('/', addTopicHandler);

export default router;
