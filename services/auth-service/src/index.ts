import express from "express";
import authRoutes from "./routes/auth-routes";
import cors from "cors";
import { setupSwagger } from "./swagger";

const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use("/auth", authRoutes)

// swagger
setupSwagger(app);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`auth service running on port ${PORT}`));

const shutdown = async () => {
    console.log("auth service shutting down");
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);