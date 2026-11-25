const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const { frontendUrl } = require('./config/env');
const requestLogger = require('./middlewares/requestLogger');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

// Basic HTTP security + same-origin policy for the API.
app.use(helmet());

const allowedOrigins = new Set([
  frontendUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
]);
app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an Origin (curl, server-to-server) are allowed.
      callback(null, !origin || allowedOrigins.has(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
// Strips $ and . from user input to prevent NoSQL injection.
app.use(mongoSanitize({ replaceWith: '_' }));
app.use(requestLogger);

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusConnect API is running.',
    data: { status: 'ok', uptime: Math.round(process.uptime()) },
  });
});

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
