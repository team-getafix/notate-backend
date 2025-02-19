import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authenticateJWT } from "../middlewares/jwt-middleware";
import bcrypt from "@node-rs/bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const router = Router();
const prisma = new PrismaClient();

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "development";

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Register a new user
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
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 */
router.post("/register", authenticateJWT(["admin"]), async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ error: "email, password and role are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ error: "a user with this email already exists" });
    }

    const user = await prisma.user.create({
        data: { email, password: hashedPassword, role }
    });

    res.json({ message: "user created successfully", user });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || (await bcrypt.compare(password, user.password)) === false) {
        return res.status(401).json({ error: "invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token });
});

router.get("/me", authenticateJWT(["student", "teacher", "admin"]), async (req: any, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    res.json(user);
});

export default router;
