import express from "express";
import cors from "cors";
import authRoutes from "./routes/class.routes";
import subjectRoutes from "./routes/subject.routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/subject", subjectRoutes);

export default app;
