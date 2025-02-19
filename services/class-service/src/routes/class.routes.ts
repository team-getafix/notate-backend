import { Router } from 'express';
import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} from '../controllers/class.controller';

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
router.post('/', createClass);

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
router.get('/', getClasses);

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
router.get('/:id', getClassById);

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
router.put('/:id', updateClass);

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
router.delete('/:id', deleteClass);

export default router;
