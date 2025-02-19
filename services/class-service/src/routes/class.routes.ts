import { Router } from "express";
import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  getClassSubjects,
} from "../controllers/class.controller";

import {
  authenticateJWT,
  requireAdmin,
  requireRoles,
  requireTeacherForSubject
} from "../middlewares/auth.middleware";

import { validationMiddleware } from "../middlewares/validation.middleware";
import { CreateClassDto, DeleteClassByIdDto, GetClassByIdDto, UpdateClassDto } from "../dtos/class.dto";

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
router.post("/", authenticateJWT, requireAdmin, validationMiddleware(CreateClassDto), createClass);

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
router.get("/", authenticateJWT, requireAdmin, getClasses);

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
router.get("/:id", authenticateJWT, requireRoles(["teacher", "admin"]), validationMiddleware(GetClassByIdDto), getClassById);

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
router.put("/:id", authenticateJWT, requireAdmin, validationMiddleware(UpdateClassDto), updateClass);

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
router.delete("/:id", authenticateJWT, requireAdmin, validationMiddleware(DeleteClassByIdDto), deleteClass);

/**
 * @swagger
 * /classes/{id}/subjects:
 *   get:
 *     summary: Get subjects of a specific class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the class whose subjects are to be retrieved
 *     responses:
 *       200:
 *         description: List of subjects for the class
 *       404:
 *         description: Class not found
 */
router.get("/:id/subjects", authenticateJWT, requireAdmin, validationMiddleware(GetClassByIdDto), getClassSubjects);

export default router;
