import axios from "axios";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://auth-service:4001";

export const authServiceClient = axios.create({
  baseURL: AUTH_SERVICE_URL,
  timeout: 5000,
});
