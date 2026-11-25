const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/token');

/** Verifies the Bearer token and attaches the authenticated user to req. */
const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;

  if (!token) {
    throw new AppError(401, 'Authentication required. Please log in.');
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError(401, 'This account no longer exists. Please log in again.');
  }

  req.user = user;
  next();
});

/**
 * Used on public event routes: an admin token (if present) reveals drafts,
 * while guests and students keep seeing published events only. An invalid
 * token is ignored here instead of blocking a public page.
 */
const optionalAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    try {
      const decoded = verifyToken(header.slice(7).trim());
      req.user = await User.findById(decoded.id);
    } catch (_error) {
      req.user = null;
    }
  }
  next();
});

/** Role guard: restrictTo('admin') blocks students and guests. */
const restrictTo = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(
      new AppError(403, 'You do not have permission to perform this action.')
    );
  }
  next();
};

module.exports = { protect, optionalAuth, restrictTo };
