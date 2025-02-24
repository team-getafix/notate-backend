import { Router } from "express";
import { getStudentAssignments } from "../controllers/student.controller";
import { authenticateJWT, requireStudent } from "../middlewares/auth.middleware";

const router = Router();

router.get("/assignments", authenticateJWT, requireStudent, getStudentAssignments);

export default router;
