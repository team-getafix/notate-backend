import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { setupSwagger } from "./config/swagger.config";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

setupSwagger(app);

export default app;
