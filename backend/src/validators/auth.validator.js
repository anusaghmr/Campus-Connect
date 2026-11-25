const Joi = require('joi');

const register = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().trim().lowercase().max(150).required(),
  college: Joi.string().trim().min(2).max(200).required(),
  studentId: Joi.string().trim().min(3).max(50).required(),
  password: Joi.string().min(6).max(128).required(),
  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' }),
});

const login = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(1).required(),
});

module.exports = { register, login };
