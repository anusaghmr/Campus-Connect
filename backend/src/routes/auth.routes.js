const express = require('express');
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/register', validate(authValidator.register), authController.register);
router.post('/login', authLimiter, validate(authValidator.login), authController.login);
router.get('/me', protect, authController.me);

module.exports = router;
