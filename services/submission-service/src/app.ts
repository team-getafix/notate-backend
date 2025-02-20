import express from "express";
import cors from "cors";
import assignmentRoutes from "./routes/assignment.routes";
import subjectRoutes from "./routes/subject.routes";
import submissionRoutes from "./routes/submission.routes";
import { setupSwagger } from "./swagger";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/assignments", assignmentRoutes);
app.use("/subject", subjectRoutes);
app.use("/submissions", submissionRoutes);

setupSwagger(app);

export default app;
