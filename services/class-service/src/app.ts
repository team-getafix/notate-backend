import express from "express";
import cors from "cors";
import classRoutes from "./routes/class.routes";
import subjectRoutes from "./routes/subject.routes";
import studentRoutes from "./routes/student.routes";
import { setupSwagger } from "./swagger";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/classes", classRoutes);
app.use("/subjects", subjectRoutes);
app.use("/student", studentRoutes)

setupSwagger(app);

export default app;
