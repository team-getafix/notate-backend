import app from "./app";
import prisma from "./utils/prisma";

const PORT = process.env.PORT || 4002;
const server = app.listen(PORT, () => {
  console.log(`class service running on port ${PORT}`);
});

const shutdown = () => {
  console.log("class service shutting down...");
  prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
