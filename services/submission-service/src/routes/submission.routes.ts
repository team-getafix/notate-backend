import { Router, Response } from "express";
import { authenticateJWT, requireTeacherAdmin, requireStudent, requireAdmin, AuthRequest } from "../middlewares/auth.middleware";
import { createSubmission, gradeSubmission, getSubmission, getMySubmissions, getAssignmentSubmissions, getAllSubmissions } from "../controllers/submission.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { GradeSubmissionDto } from "../dtos/submission.dto";
import { submissionAccess } from "../middlewares/access.middleware";
import prisma from "../utils/prisma";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

const router = Router();

/**
 * @swagger
 * /submissions:
 *   get:
 *     summary: Retrieve all submissions (admin access)
 *     tags: [Submissions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all submissions with details.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authenticateJWT,
  requireAdmin,
  getAllSubmissions
);

/**
 * @swagger
 * /submissions/me:
 *   get:
 *     summary: Get current student's submissions
 *     tags: [Submissions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of student's submissions
 */
router.get(
  "/me",
  authenticateJWT,
  requireStudent,
  getMySubmissions
);

/**
 * @swagger
 * /submissions/for-assignment/{assignmentId}:
 *   get:
 *     summary: Retrieve submissions for a specific assignment
 *     description: Retrieves all submissions for the assignment identified by the given assignmentId. Accessible by teachers and admins.
 *     tags: [Submissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: The ID of the assignment for which submissions are being fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of submissions for the specified assignment.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Assignment not found or no submissions available.
 */
router.get(
  "/for-assignment/:assignmentId",
  authenticateJWT,
  requireTeacherAdmin,
  getAssignmentSubmissions
);

/**
 * @swagger
 * /submissions/{submissionId}/file:
 *   get:
 *     summary: Download submission file
 *     description: |
 *       Secure file download endpoint with permissions:
 *       - Students can download their own submissions
 *       - Teachers can download submissions for their assignments
 *       - Admins have full access
 *     tags: [Submissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *           example: "sub_12345"
 *         description: ID of the submission to download
 *     responses:
 *       200:
 *         description: File content
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *             description: Filename for download
 *             example: 'attachment; filename="math-homework.pdf"'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User doesn't have access
 *       404:
 *         description: Submission or file not found
 *       500:
 *         description: Internal server error
 */
router.get('/:submissionId/file',
  authenticateJWT,
  submissionAccess,
  async (req: AuthRequest, res: Response) => {
    try {
      const submission = await prisma.submission.findUnique({
        where: { id: req.params.submissionId }
      });

      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      if (!fs.existsSync(submission.filePath)) {
        return res.status(404).json({ error: "File not found" });
      }

      const filename = path.basename(submission.filePath);

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

      const fileStream = fs.createReadStream(submission.filePath);
      fileStream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: "Download failed" });
    }
  }
);

/**
 * @swagger
 * /submissions:
 *   post:
 *     summary: Submit an assignment file
 *     description: Students can submit their assignment file.
 *     tags: [Submissions]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - assignmentId
 *               - file
 *             properties:
 *               assignmentId:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Submission created successfully.
 *       400:
 *         description: Bad request.
 */
router.post(
  "/",
  authenticateJWT,
  requireStudent,
  upload.single("file"),
  createSubmission
);

/**
 * @swagger
 * /submissions/{id}:
 *   get:
 *     summary: Get submission details
 *     description: Retrieve a submission's details.
 *     tags: [Submissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Submission ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Submission details.
 *       404:
 *         description: Submission not found.
 */
router.get(
  "/:id",
  authenticateJWT,
  getSubmission
);

/**
 * @swagger
 * /submissions/{id}/grade:
 *   patch:
 *     summary: Grade and comment on a submission
 *     description: Teachers and admins can grade and comment on a submission.
 *     tags: [Submissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Submission ID.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grade:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission graded successfully.
 *       404:
 *         description: Submission not found.
 */
router.patch(
  "/:id/grade",
  authenticateJWT,
  requireTeacherAdmin,
  validationMiddleware(GradeSubmissionDto),
  gradeSubmission
);

export default router;
