import { Router } from 'express';
import { getSemesterBoundariesHandler, getSemesterBoundaryByYearHandler, createSemesterBoundaryHandler, updateSemesterBoundaryHandler, deleteSemesterBoundaryHandler } from '../controllers/semesterBoundaries.controller.js';

const router = Router();

/**
 * @openapi
 * /api/semester-boundaries:
 *   get:
 *     summary: List semester boundaries
 *     tags:
 *       - Semester Boundaries
 *     responses:
 *       200:
 *         description: Boundaries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SemesterBoundary'
 *   post:
 *     summary: Create semester boundary
 *     tags:
 *       - Semester Boundaries
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SemesterBoundaryCreateRequest'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SemesterBoundary'
 */
router.get('/', getSemesterBoundariesHandler);
router.post('/', createSemesterBoundaryHandler);

/**
 * @openapi
 * /api/semester-boundaries/{year}:
 *   get:
 *     summary: Get boundary by year
 *     tags:
 *       - Semester Boundaries
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Boundary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SemesterBoundary'
 *   put:
 *     summary: Update boundary by year
 *     tags:
 *       - Semester Boundaries
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SemesterBoundaryUpdateRequest'
 *     responses:
 *       200:
 *         description: Updated boundary
 *   delete:
 *     summary: Delete boundary by year
 *     tags:
 *       - Semester Boundaries
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 */
router.get('/:year', getSemesterBoundaryByYearHandler);
router.put('/:year', updateSemesterBoundaryHandler);
router.delete('/:year', deleteSemesterBoundaryHandler);

export default router;
