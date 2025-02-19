import { Router } from 'express';
import { authenticateJWT, requireRoles, requireTeacher } from '../middlewares/auth.middleware';
import { assignmentAccess } from '../middlewares/access.middleware';
import { createAssignment, getAssignment, getAssignmentsBySubject } from '../controllers/assignment.controller';

const router = Router();

/**
 * @swagger
 * /assignments/:
 *   post:
 *     summary: Create a new assignment
 *     description: Only teachers can create assignments for subjects they are authorized to manage.
 *     tags: [Assignments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - dueDate
 *               - subjectId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Math Homework 1"
 *               description:
 *                 type: string
 *                 example: "Solve problems 1-10 from the textbook"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-01T23:59:59.000Z"
 *               subjectId:
 *                 type: string
 *                 example: "subject-12345"
 *     responses:
 *       201:
 *         description: Successfully created assignment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "assignment-67890"
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 dueDate:
 *                   type: string
 *                   format: date-time
 *                 subject:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       403:
 *         description: Not authorized for this subject
 *       500:
 *         description: Failed to create assignment
 */
router.post(
  '/',
  authenticateJWT,
  requireTeacher,
  createAssignment
);

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     summary: Get an assignment by ID
 *     description: Retrieve a specific assignment, including its subject details.
 *     tags: [Assignments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the assignment to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved assignment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 dueDate:
 *                   type: string
 *                   format: date-time
 *                 subject:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Failed to fetch assignment
 */

router.get(
  '/:id',
  authenticateJWT,
  assignmentAccess,
  getAssignment
);

// router.patch(
//   '/:id',
//   authenticateJWT,
//   requireTeacher,
//   assignmentAccess,
//   updateAssignment
// );

// router.delete(
//   '/:id',
//   authenticateJWT,
//   requireTeacher,
//   assignmentAccess,
//   deleteAssignment
// );

export default router;
