const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const AppError = require('./AppError');

const signToken = (user) =>
  jwt.sign({ id: user._id ? user._id.toString() : user.id, role: user.role }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError(401, 'Your session has expired. Please log in again.');
    }
    throw new AppError(401, 'Invalid authentication token. Please log in again.');
  }
};

module.exports = { signToken, verifyToken };
