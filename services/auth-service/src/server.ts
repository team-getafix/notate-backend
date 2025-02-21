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

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      db: 'disconnected',
      error: error.message
    })
  }
})

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
