import app from "./app";

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`api gateway running on port ${PORT}`);
});

const shutdown = () => {
  console.log("api gateway shutting down");
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
