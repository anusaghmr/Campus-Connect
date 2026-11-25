const Joi = require('joi');
const { OBJECT_ID_PATTERN, REGISTRATION_STATUSES } = require('../config/constants');

const create = Joi.object({
  eventId: Joi.string().pattern(OBJECT_ID_PATTERN).required(),
});

const idParam = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_PATTERN).required(),
});

const listQuery = Joi.object({
  eventId: Joi.string().pattern(OBJECT_ID_PATTERN),
  status: Joi.string().valid(...REGISTRATION_STATUSES),
  search: Joi.string().allow('').max(150),
});

module.exports = { create, idParam, listQuery };
