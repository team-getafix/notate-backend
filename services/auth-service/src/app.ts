import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { setupSwagger } from "./config/swagger.config";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000"
}));

app.use("/auth", authRoutes);

setupSwagger(app);

export default app;
