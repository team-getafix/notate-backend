import app from "./app";

const PORT = process.env.PORT || 4001;
const server = app.listen(PORT, () => {
  console.log(`auth service running on port ${PORT}`);
});

const shutdown = () => {
  console.log("auth service shutting down...");
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);