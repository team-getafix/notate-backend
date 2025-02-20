import { Router } from 'express';
import { authenticateJWT, requireAdmin, requireRoles, requireTeacher, requireTeacherAdmin } from '../middlewares/auth.middleware';
import { assignmentAccess } from '../middlewares/access.middleware';
import { createAssignment, deleteAssignment, getAssignment, getAssignmentsBySubject, updateAssignment } from '../controllers/assignment.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { CreateAssignmentDto, UpdateAssignmentDto } from '../dtos/assignment.dto';

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
  requireTeacherAdmin,
  validationMiddleware(CreateAssignmentDto),
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

/**
 * @swagger
 * /assignments/{id}:
 *   patch:
 *     summary: Update an assignment
 *     description: Updates an assignment's details. Teachers are not allowed to change the subject.
 *     tags:
 *       - Assignments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the assignment
 *               description:
 *                 type: string
 *                 description: The updated description of the assignment
 *               subjectId:
 *                 type: string
 *                 description: The subject ID (only for admins, teachers cannot update this)
 *     responses:
 *       200:
 *         description: Successfully updated assignment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       403:
 *         description: Teachers cannot change the subject
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id',
  authenticateJWT,
  requireTeacherAdmin,
  assignmentAccess,
  validationMiddleware(UpdateAssignmentDto),
  updateAssignment
);

/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     summary: Delete an assignment
 *     description: Deletes an assignment by ID.
 *     tags:
 *       - Assignments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The assignment ID
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:id',
  authenticateJWT,
  requireTeacherAdmin,
  assignmentAccess,
  deleteAssignment
);

export default router;
