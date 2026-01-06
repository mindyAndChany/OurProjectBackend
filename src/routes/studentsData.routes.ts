import express from 'express';
import { getAllStudentsDataService } from '../services/getAllStudentsData.service.js';
import { Student } from '../models/student.model.js';
import { StudentsDataController } from '../controllers/studentsData.controller.js';

const router = express.Router();
const studentService = new getAllStudentsDataService(Student);

/**
 * @openapi
 * /api/studentsData:
 *   get:
 *     summary: Get all students (full records)
 *     tags:
 *       - Students
 *     responses:
 *       200:
 *         description: Array of student objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/', async (_req, res) => {
    console.log("getroute start");
      const students = await studentService.findAll();
  res.json(students);
});

/**
 * @openapi
 * /api/studentsData/getstudentData/{categories}:
 *   get:
 *     summary: Get specified fields for all students
 *     tags:
 *       - Students
 *     parameters:
 *       - name: categories
 *         in: path
 *         required: true
 *         description: Comma-separated field names (e.g. first_name,last_name)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of partial student objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Bad request (invalid or no categories)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/getstudentData/:categories', async (req, res) => {
    console.log('Fetching student data with categories:', req.params.categories);
  const { categories } = req.params;
  if (!categories) return res.status(400).json({ error: 'categories parameter required' });

  const cols = categories.split(',').map((c) => c.trim()).filter(Boolean);
  if (cols.length === 0) return res.status(400).json({ error: 'no categories provided' });

  const data = await studentService.getStudentData(cols);
  res.json(data);
});

export default router;
