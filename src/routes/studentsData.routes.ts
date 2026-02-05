import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { GetAllStudentsDataService } from '../services/getAllStudentsData.service.js';
import { AddStudentService } from '../services/AddStudent.service.js';
import { UpdateStudentService } from '../services/UpdateStudent.service.js';
import { Student } from '../models/student.model.js';
import { StudentDocument } from '../models/student_document.model.js';

import { StudentsDataController } from '../controllers/studentsData.controller.js';
import { GetStudentByIdService } from '../services/getStudentById.service.js';
import { FileUploadService } from '../services/fileUpload.service.js';
import { Op } from 'sequelize';

const router = express.Router();

// יצירת מופעים של הסרביסים
const studentService = new GetAllStudentsDataService(Student);
const addStudentService = new AddStudentService(Student);
const updateStudentService = new UpdateStudentService(Student);
const getStudentByIdService = new GetStudentByIdService(Student);
const fileUploadService = new FileUploadService();

// Multer setup: keep files in memory so we can forward to cloud or save manually
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// Fix common mojibake when non-ASCII filenames arrive encoded as Latin-1
function fixFilenameEncoding(name: string): string {
  // Heuristic: common mojibake from UTF-8 shown as Latin-1/Windows-1252 uses 'Ã', 'Â'
  // Hebrew-specific mojibake often shows many '×' followed by 0x80-0xBF bytes (e.g., ×\x9E)
  const looksLatin1Utf8 = /(Ã|Â|�)/.test(name) || /×[\x80-\xBF]/.test(name);
  if (looksLatin1Utf8) {
    try {
      const fixed = Buffer.from(name, 'latin1').toString('utf8');
      return fixed;
    } catch {
      // fall through
    }
  }
  return name;
}

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

/**
 * @openapi
 * /api/studentsData/uploadFiles/{id}:
 *   post:
 *     summary: Upload student's photo and documents
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Upload result with urls
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_number:
 *                   type: string
 *                 photoUrl:
 *                   type: string
 *                   nullable: true
 *                 documents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       url:
 *                         type: string
 *                       public_id:
 *                         type: string
 *                         nullable: true
 */
router.post(
  '/uploadFiles/:id',
  // Accept both legacy and new frontend field names
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'documents', maxCount: 20 },
    { name: 'files', maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'id parameter required' });

      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      // Support both 'photo' and 'profilePhoto'
      const photoFile = files?.photo?.[0] || files?.profilePhoto?.[0];
      // Support both 'documents' and 'files'
      const documentFiles = files?.documents || files?.files || [];

      const folder = `students/${id}`;
      let photoUrl: string | null = null;
      let photoName: string | null = null;
      const documents: { name: string; url: string; public_id?: string | null }[] = [];

      const saveToDisk = async (buf: Buffer, originalName: string): Promise<string> => {
        console.log("saveToDisk start");
        
        const baseDir = path.resolve('uploads', folder);
        await fs.promises.mkdir(baseDir, { recursive: true });

        const fixedOriginal = fixFilenameEncoding(originalName);
        const parsed = path.parse(fixedOriginal);
        const cleanBase = (parsed.name || 'file')
          .replace(/[\\/:*?"<>|\u0000-\u001F]/g, '')
          .trim() || 'file';
        const cleanExt = (parsed.ext || '')
          .replace(/[^.\w-]+/g, '')
          .slice(0, 20);

        const safeName = `${Date.now()}-${cleanBase}${cleanExt}`;
        const fullPath = path.join(baseDir, safeName);
        await fs.promises.writeFile(fullPath, buf);
        const relPath = path.join('/uploads', folder, safeName).replace(/\\/g, '/');
        console.log("saveToDisk finish");

        return relPath;
      };

      // Photo upload
      if (photoFile) {
        console.log("fileUploadService.isCloudEnabled()",fileUploadService.isCloudEnabled());
        
        if (fileUploadService.isCloudEnabled()) {
          console.log(" Photo upload");
          
          const isImage = (photoFile.mimetype || '').startsWith('image/');
          const result = await fileUploadService.uploadBufferToCloudinary(
            photoFile.buffer,
            photoFile.originalname,
            folder,
            isImage ? 'image' : 'raw'
          );
          photoUrl = result.url;
          photoName = fixFilenameEncoding(result.original_filename || photoFile.originalname);
        } else {
          photoUrl = await saveToDisk(photoFile.buffer, photoFile.originalname);
          photoName = fixFilenameEncoding(photoFile.originalname);
        }
      }

      // Documents upload 
      for (const doc of documentFiles) {
        if (fileUploadService.isCloudEnabled()) {
          const isImage = (doc.mimetype || '').startsWith('image/');
          const result = await fileUploadService.uploadBufferToCloudinary(
            doc.buffer,
            doc.originalname,
            folder,
            
            isImage ? 'image' : 'raw'
          );
          documents.push({
            name: fixFilenameEncoding(result.original_filename || doc.originalname),
            url: result.url,
            public_id: (result.public_id ?? null) as string | null,
          });
        } else {
          const url = await saveToDisk(doc.buffer, doc.originalname);
          documents.push({ name: fixFilenameEncoding(doc.originalname), url });
        }
      }

      // Persist URLs (id in path is id_number)
      const student = await Student.findOne({ where: { id_number: id } });
      if (student) {
        if (photoUrl) {
          await Student.update({ photo_url: photoUrl }, { where: { id: student.id } });
        }
        if (documents.length > 0) {
          await StudentDocument.bulkCreate(
            documents.map(d => ({ student_id: student.id, name: d.name, url: d.url, public_id: d.public_id ?? null }))
          );
        }
      }

      return res.json({ id_number: id, photoUrl, photoName, documents });
    } catch (err: any) {
      console.error('uploadFiles error:', err);
      return res.status(500).json({ error: err?.message || 'Internal server error' });
    }
  }
);

/**
 * @openapi
 * /api/studentsData/{id}/documents:
 *   get:
 *     summary: List student's uploaded documents
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
 *         description: Array of student document records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentDocument'
 *       404:
 *         description: Student not found
 */
router.get('/:id/documents', async (req, res) => {
  try {
    const { id } = req.params; // id_number
    const student = await Student.findOne({ where: { id_number: id } });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Avoid selecting non-existent columns defensively; map url if present
    const docs = await StudentDocument.findAll({
      attributes: ['id', 'student_id', 'name', 'url', 'public_id', 'created_at'],
      where: { student_id: student.id },
      order: [['created_at', 'DESC']]
    });
    // Map to include url when available; else null
    const payload = docs.map((d: any) => ({
      id: d.id,
      student_id: d.student_id,
      name: (d as any).name ?? null,
      url: (d as any).url ?? null,
      public_id: d.public_id ?? null,
      created_at: d.created_at,
    }));
    res.json(payload);
  } catch (err: any) {
    console.error('get documents error:', err);
    res.status(500).json({ error: err?.message || 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/studentsData/{id}/photo:
 *   get:
 *     summary: Get student's photo URL
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
 *         description: Photo URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_number:
 *                   type: string
 *                 photoUrl:
 *                   type: string
 *       404:
 *         description: Student not found
 */
router.get('/:id/photo', async (req, res) => {
  try {
    const { id } = req.params; // id_number
    const student = await Student.findOne({ where: { id_number: id } });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ id_number: id, photoUrl: student.photo_url || null });
  } catch (err: any) {
    console.error('get photo error:', err);
    res.status(500).json({ error: err?.message || 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/studentsData/class/{className}/documents:
 *   get:
 *     summary: List documents for all students in a class
 *     tags:
 *       - Students
 *     parameters:
 *       - name: className
 *         in: path
 *         required: true
 *         description: Class identifier (e.g. כיתה/"class_kodesh")
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of document records with student info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentDocumentWithStudent'
 */
router.get('/class/:className/documents', async (req, res) => {
  try {
    const { className } = req.params;
    if (!className) return res.status(400).json({ error: 'className parameter required' });

    const normalizedClassName = decodeURIComponent(className)
      .trim()
      .replace(/^['"\s]+|['"\s]+$/g, '');

    const students = await Student.findAll({
      where: { class_kodesh: normalizedClassName },
      attributes: ['id', 'id_number', 'first_name', 'last_name']
    });

    const studentIds = students.map(s => s.id);
    if (studentIds.length === 0) return res.json([]);

    const docs = await StudentDocument.findAll({
      attributes: ['id', 'student_id', 'name', 'url', 'public_id', 'created_at'],
      where: { student_id: { [Op.in]: studentIds } },
      include: [{ model: Student, attributes: ['id', 'id_number', 'first_name', 'last_name'] }],
      order: [['created_at', 'DESC']]
    });

    const payload = docs.map((d: any) => ({
      id: d.id,
      student_id: d.student_id,
      id_number: d.student?.id_number ?? null,
      first_name: d.student?.first_name ?? null,
      last_name: d.student?.last_name ?? null,
      name: (d as any).name ?? null,
      url: (d as any).url ?? null,
      public_id: d.public_id ?? null,
      created_at: d.created_at,
    }));
    res.json(payload);
  } catch (err: any) {
    console.error('get class documents error:', err);
    res.status(500).json({ error: err?.message || 'Internal server error' });
  }
});

/**
 * @openapi
 * /api/studentsData/track/{trackName}/documents:
 *   get:
 *     summary: List documents for all students in a track
 *     tags:
 *       - Students
 *     parameters:
 *       - name: trackName
 *         in: path
 *         required: true
 *         description: Track identifier (matches any of track/track2/track3)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of document records with student info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentDocumentWithStudent'
 */
router.get('/track/:trackName/documents', async (req, res) => {
  try {
    const { trackName } = req.params;
    if (!trackName) return res.status(400).json({ error: 'trackName parameter required' });

    const normalizedTrackName = decodeURIComponent(trackName)
      .trim()
      .replace(/^['"\s]+|['"\s]+$/g, '');

    const students = await Student.findAll({
      where: {
        [Op.or]: [
          { track: normalizedTrackName },
          { track2: normalizedTrackName },
          { track3: normalizedTrackName },
        ]
      },
      attributes: ['id', 'id_number', 'first_name', 'last_name']
    });

    const studentIds = students.map(s => s.id);
    if (studentIds.length === 0) return res.json([]);

    const docs = await StudentDocument.findAll({
      attributes: ['id', 'student_id', 'name', 'url', 'public_id', 'created_at'],
      where: { student_id: { [Op.in]: studentIds } },
      include: [{ model: Student, attributes: ['id', 'id_number', 'first_name', 'last_name'] }],
      order: [['created_at', 'DESC']]
    });

    const payload = docs.map((d: any) => ({
      id: d.id,
      student_id: d.student_id,
      id_number: d.student?.id_number ?? null,
      first_name: d.student?.first_name ?? null,
      last_name: d.student?.last_name ?? null,
      name: (d as any).name ?? null,
      url: (d as any).url ?? null,
      public_id: d.public_id ?? null,
      created_at: d.created_at,
    }));
    res.json(payload);
  } catch (err: any) {
    console.error('get track documents error:', err);
    res.status(500).json({ error: err?.message || 'Internal server error' });
  }
});

export default router;
