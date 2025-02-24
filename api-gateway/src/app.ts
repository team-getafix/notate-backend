import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

const bodyReconstructor = (proxyReq: any, req: any, res: any) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    return;
  }

  if (req.body) {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
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

const classProxy = createProxyMiddleware({
  target: 'http://class-service:4002',
  changeOrigin: true,
  pathRewrite: (path: string) => `/${path}`,
  on: {
    proxyReq: bodyReconstructor
  },
});

const submissionProxy = createProxyMiddleware({
  target: 'http://submission-service:4003',
  changeOrigin: true,
  pathRewrite: (path: string) => `/${path}`,
  on: {
    proxyReq: bodyReconstructor
  },
});

app.use("/api/auth", authProxy);
app.use("/api/class", classProxy);
app.use("/api/submission", submissionProxy);

export default app;
