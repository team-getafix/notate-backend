import app from "./app";
import prisma from "./utils/prisma";

const PORT = process.env.PORT || 4001;
const server = app.listen(PORT, () => {
  console.log(`auth service running on port ${PORT}`);
});

const shutdown = () => {
  console.log("auth service shutting down...");
  prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
