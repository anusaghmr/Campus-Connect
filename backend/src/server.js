const mongoose = require('mongoose');
const app = require('./app');
const { port } = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');

const start = async () => {
  // Do not open the HTTP port until MongoDB is reachable.
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`CampusConnect API listening on http://localhost:${port}/api/v1`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    // Fallback if connections keep the server open.
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
