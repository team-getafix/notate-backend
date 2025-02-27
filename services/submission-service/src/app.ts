import { setupSwagger } from "./swagger";
import assignmentRoutes from "./routes/assignment.routes";
import subjectRoutes from "./routes/subject.routes";
import submissionRoutes from "./routes/submission.routes";
import studentRoutes from "./routes/student.routes";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({
  // origin: "http://localhost:3000"
}));

app.use("/assignments", assignmentRoutes);
app.use("/subject", subjectRoutes);
app.use("/submissions", submissionRoutes);
app.use("/student", studentRoutes);

setupSwagger(app);

export default app;
