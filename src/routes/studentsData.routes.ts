import express from 'express';
import { GetAllStudentsDataService } from '../services/getAllStudentsData.service.js';
import { AddStudentService } from '../services/AddStudent.service.js';
import { UpdateStudentService } from '../services/UpdateStudent.service.js';
import { Student } from '../models/student.model.js';

import { StudentsDataController } from '../controllers/studentsData.controller.js';
import { GetStudentByIdService } from '../services/getStudentById.service.js';

const router = express.Router();

// יצירת מופעים של הסרביסים
const studentService = new GetAllStudentsDataService(Student);
const addStudentService = new AddStudentService(Student);
const updateStudentService = new UpdateStudentService(Student);
const getStudentByIdService = new GetStudentByIdService(Student);

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
 * /api/studentsData/getstudentById/{id}:
 *   get:
 *     summary: Get full student by id_number
 *     tags:
 *       - Students
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Student id_number
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Full student object
 *       404:
 *         description: Student not found
 */
router.get('/getstudentById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'id parameter required' });

    const student = await getStudentByIdService.getByIdNumber(id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    res.json(student);
  } catch (err) {
    console.error('getstudentById error:', err);
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

/**
 * @openapi
 * /api/studentsData/updateStudent/{id}:
 *   put:
 *     summary: Update a student by id_number
 *     tags:
 *       - Students
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Student id_number
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Updated student object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Student not found
 */
router.put('/updateStudent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    console.log('PUT /api/studentsData/updateStudent/:id - id=', id, 'body:', body);

    if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Request body must be an object with fields to update' });

    const updated = await updateStudentService.updateByIdNumber(id, body);
    res.json(updated);
  } catch (err:any) {
    // log error for debugging
    console.error('Error in updateStudent route for id:', req.params?.id, err);

    // map some Nest exceptions to HTTP codes if present and provide clearer message
    const status = (err && (err.status ?? err.statusCode)) || 400;
    // Prefer Nest error response message if present
    const message = (err && (err.message || (err.response && err.response.message) || String(err))) || 'Internal server error';
    if (status === 404) return res.status(404).json({ error: message });
    if (status === 409) return res.status(409).json({ error: message });
    return res.status(status >= 400 && status < 600 ? status : 400).json({ error: message });
  }
});

export default router;
