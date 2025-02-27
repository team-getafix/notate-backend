import { Router } from "express";
import { registerUser, loginUser, getCurrentUser, changePassword, getUsersByRole, getAllUsers, deleteUser, updateUser } from "../controllers/auth.controller";
import { authenticateJWT, requireAdmin, requireRoles, requireTeacher } from "../middlewares/jwt.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { ChangePasswordDto } from "../dtos/user.dto";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authenticate]
 *     description: Creates a new user account (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               middleName:
 *                 type: string
 *                 required: false
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 */
router.post("/register", authenticateJWT, requireAdmin, registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authenticate]
 *     description: Authenticate user and return JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token returned
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Authenticate]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/me", authenticateJWT, getCurrentUser);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Authenticate]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmNewPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid current password
 */
router.post(
  "/change-password",
  authenticateJWT,
  validationMiddleware(ChangePasswordDto),
  changePassword
);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get users by role
 *     description: Retrieves a list of users based on their role. Accessible to admins and teachers.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Role of the users to retrieve (e.g., admin, teacher, student)
 *     responses:
 *       200:
 *         description: A list of users filtered by role
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/users', authenticateJWT, requireRoles(["admin", "teacher"]), getUsersByRole);

/**
 * @swagger
 * /auth/all-users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves all users. Accessible only to admins.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all users
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/all-users', authenticateJWT, requireAdmin, getAllUsers);

/**
 * @swagger
 * /auth/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by ID. Accessible only to admins.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to delete
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/users/:id", authenticateJWT, requireAdmin, deleteUser);

/**
 * @swagger
 * /auth/users/{id}:
 *   patch:
 *     summary: Update a user
 *     description: Updates a user by ID. Accessible only to admins.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to update
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/users/:id", authenticateJWT, requireAdmin, updateUser);

export default router;
