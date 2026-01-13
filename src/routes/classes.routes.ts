import { Router } from 'express';
import { getClassesHandler, addClassHandler, updateClassHandler, deleteClassHandler } from '../controllers/classes.controller.js';

/**
 * @openapi
 * /api/classes:
 *   get:
 *     summary: Get all classes
 *     tags:
 *       - Classes
 *     responses:
 *       200:
 *         description: List of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 *   post:
 *     summary: Add a new class
 *     tags:
 *       - Classes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       201:
 *         description: Class created
 * /api/classes/{id}:
 *   put:
 *     summary: Update a class
 *     tags:
 *       - Classes
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
 *             $ref: '#/components/schemas/Class'
 *     responses:
 *       200:
 *         description: Class updated
 *   delete:
 *     summary: Delete a class
 *     tags:
 *       - Classes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class deleted
 */
const router = Router();

router.get('/', getClassesHandler);
router.post('/', addClassHandler);
router.put('/:id', updateClassHandler);
router.delete('/:id', deleteClassHandler);

export default router;
