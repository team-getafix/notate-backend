import { Router } from "express";
import { getAssignmentsBySubject } from "../controllers/assignment.controller";
import { authenticateJWT, requireRoles } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /subject/{subjectId}:
 *   get:
 *     summary: Get all assignments for a subject
 *     description: Retrieves all assignments related to a specific subject. Accessible by admins, teachers, and students.
 *     tags: [Assignments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subject to fetch assignments for
 *     responses:
 *       200:
 *         description: Successfully retrieved assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *                   subjectId:
 *                     type: string
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Failed to fetch assignments
 */
router.get(
  "/:subjectId",
  authenticateJWT,
  requireRoles(["admin", "teacher", "student"]),
  getAssignmentsBySubject
)

export default router;
