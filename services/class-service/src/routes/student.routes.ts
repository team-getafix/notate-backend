import { Router } from "express";
import {
  getMyClasses,
  getStudentSubjects,
  getUnassignedStudents
} from "../controllers/student.controller";

import { authenticateJWT, requireAdmin, requireStudent, requireTeacherAdmin } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /student/{id}/subjects:
 *   get:
 *     summary: Retrieve subjects for a student
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the student.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of subjects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The subject ID.
 *                   name:
 *                     type: string
 *                     description: The subject name.
 *       500:
 *         description: Server error.
 */
router.get("/:id/subjects", requireTeacherAdmin, getStudentSubjects);

/**
 * @swagger
 * /student/my-classes:
 *   get:
 *     summary: Get the classes for the authenticated student
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of classes for the student.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/my-classes",
  authenticateJWT,
  requireStudent,
  getMyClasses
);

/**
 * @swagger
 * /student/unassigned:
 *   get:
 *     summary: Get all unassigned students in alphabetical order.
 *     tags: [Student]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of unassigned students.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/unassigned", authenticateJWT, requireAdmin, getUnassignedStudents);

export default router;
