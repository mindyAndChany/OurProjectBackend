import express from 'express';
import { GetAllStudentsDataService } from '../services/getAllStudentsData.service';
import { AddStudentService } from '../services/AddStudent.service';
import { Student } from '../models/student.model';

import { StudentsDataController } from '../controllers/studentsData.controller.js';

const router = express.Router();

// יצירת מופעים של הסרביסים
const studentService = new GetAllStudentsDataService(Student);
const addStudentService = new AddStudentService(Student);

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
  try {
    const students = await studentService.findAll();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
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
 */
router.get('/getstudentData/:categories', async (req, res) => {
  try {
    const { categories } = req.params;
    if (!categories) return res.status(400).json({ error: 'categories parameter required' });

    const cols = categories.split(',').map(c => c.trim()).filter(Boolean);
    if (cols.length === 0) return res.status(400).json({ error: 'no categories provided' });

    const data = await studentService.getStudentData(cols);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/studentsData/addStudents:
 *   post:
 *     summary: Add multiple students to the database
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *     responses:
 *       201:
 *         description: Students added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid input
 */
router.post('/addStudents', async (req, res) => {
  try {
    console.log("start router");
    
    const students = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array' });
    }

    const results = [];
    for (const student of students) {
      const added = await addStudentService.addStudent(student);
      results.push(added);
    }

    res.status(201).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
