import { Router } from "express";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller";

const router = Router();

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
router.post("/", createSubject);

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
router.get("/", getSubjects);

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
router.get("/:id", getSubjectById);

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
router.put("/:id", updateSubject);

/**
 * @swagger
 * /subjects/{id}:
 *   delete:
 *     summary: Delete a subject
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subject to delete.
 *     responses:
 *       200:
 *         description: The deleted subject.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The subject ID.
 *                 name:
 *                   type: string
 *                   description: The subject name.
 *       404:
 *         description: Subject not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:id", deleteSubject);

export default router;
