import { Router } from "express";
import { getStudentAssignments } from "../controllers/student.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.get("/assignments", authenticateJWT, getStudentAssignments);

export default router;
