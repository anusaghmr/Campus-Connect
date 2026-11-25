const path = require('path');

// Load backend/.env (never committed). See .env.example for the template.
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const nodeEnv = process.env.NODE_ENV || 'development';

if (!process.env.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is not set. Copy backend/.env.example to backend/.env and fill in the values.'
  );
}

module.exports = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv,
  mongoUri:
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
