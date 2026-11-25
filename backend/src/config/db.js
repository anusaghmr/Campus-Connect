const mongoose = require('mongoose');
const { mongoUri } = require('./env');

/**
 * Connects to MongoDB. The server is only started after this resolves, so the
 * API never accepts requests without a working database connection.
 */
const connectDB = async () => {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Connection lost. Waiting for reconnect...');
  });
  mongoose.connection.on('reconnected', () => {
    console.log('[MongoDB] Reconnected successfully.');
  });
  mongoose.connection.on('error', (error) => {
    console.error('[MongoDB] Error:', error.message);
  });

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(
      `[MongoDB] Connected to ${connection.connection.host}/${connection.connection.name}`
    );
    return connection;
  } catch (error) {
    console.error('[MongoDB] Initial connection failed:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed.');
  }
};

module.exports = { connectDB, disconnectDB };
