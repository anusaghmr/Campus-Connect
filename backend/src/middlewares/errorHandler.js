const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const { nodeEnv } = require('../config/env');

const notFound = (req, _res, next) => {
  next(new AppError(404, `Route ${req.originalUrl} was not found on this server.`));
};

const handleCastError = (error) =>
  new AppError(400, `Invalid value for field "${error.path}".`);

const handleDuplicateKey = (error) => {
  const field = Object.keys(error.keyPattern || {})[0] || 'field';
  return new AppError(409, `A record with this ${field} already exists.`);
};

const handleValidationError = (error) =>
  new AppError(
    422,
    'Validation failed',
    Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }))
  );

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  let error = err;

  if (err instanceof mongoose.Error.CastError) error = handleCastError(err);
  else if (err.code === 11000) error = handleDuplicateKey(err);
  else if (err instanceof mongoose.Error.ValidationError)
    error = handleValidationError(err);
  else if (!(err instanceof AppError)) {
    error = new AppError(500, 'Something went wrong on our end. Please try again later.');
  }

  if (nodeEnv === 'development' && !(err instanceof AppError)) {
    console.error(err);
  }

  const response = {
    success: false,
    message: error.message,
  };
  if (error.errors && error.errors.length) response.errors = error.errors;
  if (nodeEnv === 'development' && !(err instanceof AppError)) {
    response.stack = err.stack;
  }

  res.status(error.statusCode || 500).json(response);
};

module.exports = { notFound, errorHandler };
