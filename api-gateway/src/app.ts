import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { aggregateSwaggerSpec } from "./swagger-aggregator";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/auth", createProxyMiddleware({
  target: "http://auth-service:4001", changeOrigin: true, pathRewrite: (path, req) => {
    return `/auth${path}`
  },
}));

export default app;
