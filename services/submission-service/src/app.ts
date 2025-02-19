import express from "express";
import cors from "cors";
import assignmentRoutes from "./routes/assignment.routes";
import subjectRoutes from "./routes/subject.routes";
import { setupSwagger } from "./swagger";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/assignments", assignmentRoutes);
app.use("/subject", subjectRoutes);

setupSwagger(app);

export default app;
