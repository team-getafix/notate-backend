import { Router } from "express";
import {
  getStudentSubjects
} from "../controllers/student.controller";

import { requireTeacherAdmin } from "../middlewares/auth.middleware";

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

export default router;
