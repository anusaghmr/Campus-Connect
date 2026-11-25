const express = require('express');
const registrationController = require('../controllers/registration.controller');
const registrationValidator = require('../validators/registration.validator');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get(
  '/',
  validate(registrationValidator.listQuery, 'query'),
  registrationController.list
);
router.post('/', validate(registrationValidator.create), registrationController.create);
router.delete(
  '/:id',
  validate(registrationValidator.idParam, 'params'),
  registrationController.remove
);

module.exports = router;
