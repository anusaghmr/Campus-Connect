const express = require('express');
const userController = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/me', userController.me);
router.put('/me', validate(userValidator.updateMe), userController.updateMe);
router.put('/me/password', validate(userValidator.changePassword), userController.changePassword);
router.put(
  '/me/saved-events/:eventId',
  validate(userValidator.eventIdParam, 'params'),
  userController.toggleSavedEvent
);

module.exports = router;
