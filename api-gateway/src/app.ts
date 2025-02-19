import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/auth", createProxyMiddleware({ target: "http://localhost:4001", changeOrigin: true }));

export default app;