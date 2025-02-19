import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/auth", createProxyMiddleware({ target: "http://localhost:4001", changeOrigin: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`api gateway running on port ${PORT}`))

const shutdown = async () => {
    console.log("api gateway shutting down...");
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);