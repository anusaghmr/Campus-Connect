const Joi = require('joi');
const { OBJECT_ID_PATTERN } = require('../config/constants');

const updateMe = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().email().trim().lowercase().max(150),
  college: Joi.string().trim().min(2).max(200),
  studentId: Joi.string().trim().min(3).max(50),
  bio: Joi.string().allow('').max(1000),
  avatar: Joi.string().allow(''),
}).min(1);

const changePassword = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(128).required(),
  confirmNewPassword: Joi.any()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({ 'any.only': 'New passwords do not match' }),
});

const eventIdParam = Joi.object({
  eventId: Joi.string().pattern(OBJECT_ID_PATTERN).required(),
});

module.exports = { updateMe, changePassword, eventIdParam };
