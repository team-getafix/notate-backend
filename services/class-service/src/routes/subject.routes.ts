import { Router } from 'express';
import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} from '../controllers/class.controller';
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from '../controllers/subject.controller';

const router = Router();

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the class
 *               subjectIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of subject IDs
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of student IDs
 *     responses:
 *       201:
 *         description: Class created successfully
 *       400:
 *         description: Bad request, missing required fields
 */
router.post('/classes', createClass);

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Retrieve a list of all classes
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: A list of classes
 */
router.get('/classes', getClasses);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Get a class by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class to retrieve
 *     responses:
 *       200:
 *         description: Class found
 *       404:
 *         description: Class not found
 */
router.get('/classes/:id', getClassById);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Update a class by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the class
 *               subjectIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated list of subject IDs
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated list of student IDs
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Class not found
 */
router.put('/classes/:id', updateClass);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Delete a class by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class to delete
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       404:
 *         description: Class not found
 */
router.delete('/classes/:id', deleteClass);

/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - teacherIds
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the subject
 *               teacherIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of teacher IDs
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       400:
 *         description: Bad request, missing required fields
 */
router.post('/subjects', createSubject);

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Retrieve a list of all subjects
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: A list of subjects
 */
router.get('/subjects', getSubjects);

/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Get a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subject to retrieve
 *     responses:
 *       200:
 *         description: Subject found
 *       404:
 *         description: Subject not found
 */
router.get('/subjects/:id', getSubjectById);

/**
 * @swagger
 * /subjects/{id}:
 *   put:
 *     summary: Update a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subject to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the subject
 *               teacherIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated list of teacher IDs
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Subject not found
 */
router.put('/subjects/:id', updateSubject);

export default router;
