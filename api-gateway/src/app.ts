import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

const bodyReconstructor = (proxyReq: any, req: any, res: any) => {
  if (req.body) {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }

  console.log(`body: ${req.body}`)
};

dotenv.config();
const app = express();
app.use(express.json());

const authProxy = createProxyMiddleware({
  target: 'http://auth-service:4001',
  changeOrigin: true,
  pathRewrite: (path: string) => `/auth${path}`,
  on: {
    proxyReq: bodyReconstructor
  },
});

app.use("/api/auth", authProxy);

export default app;
