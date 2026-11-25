const express = require('express');
const eventController = require('../controllers/event.controller');
const eventValidator = require('../validators/event.validator');
const validate = require('../middlewares/validate');
const { protect, optionalAuth, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.get(
  '/',
  optionalAuth,
  validate(eventValidator.listQuery, 'query'),
  eventController.list
);
router.get(
  '/:id',
  optionalAuth,
  validate(eventValidator.idParam, 'params'),
  eventController.getById
);
router.post(
  '/',
  protect,
  restrictTo('admin'),
  validate(eventValidator.create),
  eventController.create
);
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(eventValidator.idParam, 'params'),
  validate(eventValidator.update),
  eventController.update
);
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  validate(eventValidator.idParam, 'params'),
  eventController.remove
);

module.exports = router;
