const Joi = require('joi');
const { CATEGORIES, EVENT_STATUSES, DATE_PATTERN, OBJECT_ID_PATTERN } = require('../config/constants');

const eventFields = {
  title: Joi.string().trim().min(3).max(200),
  shortDescription: Joi.string().allow('').max(400),
  description: Joi.string().min(10),
  category: Joi.string().valid(...CATEGORIES),
  banner: Joi.string().allow(''),
  startDate: Joi.string().pattern(DATE_PATTERN).messages({
    'string.pattern.base': 'Start date must use YYYY-MM-DD format',
  }),
  endDate: Joi.string().allow('').pattern(DATE_PATTERN).messages({
    'string.pattern.base': 'End date must use YYYY-MM-DD format',
  }),
  startTime: Joi.string().allow('').max(40),
  endTime: Joi.string().allow('').max(40),
  venue: Joi.string().trim().min(2).max(200),
  organizer: Joi.string().trim().min(2).max(200),
  organizerEmail: Joi.string().allow('').email(),
  maxParticipants: Joi.number().integer().min(1).max(100000),
  registrationDeadline: Joi.string().pattern(DATE_PATTERN).messages({
    'string.pattern.base': 'Registration deadline must use YYYY-MM-DD format',
  }),
  status: Joi.string().valid(...EVENT_STATUSES),
  eligibility: Joi.string().allow('').max(500),
  agenda: Joi.array().items(
    Joi.object({ time: Joi.string().required(), title: Joi.string().required() })
  ),
  featured: Joi.boolean(),
};

const requiredForCreate = {
  title: eventFields.title.required(),
  description: eventFields.description.required(),
  category: eventFields.category.required(),
  startDate: eventFields.startDate.required(),
  venue: eventFields.venue.required(),
  organizer: eventFields.organizer.required(),
  maxParticipants: eventFields.maxParticipants.required(),
  registrationDeadline: eventFields.registrationDeadline.required(),
};

const create = Joi.object({ ...eventFields, ...requiredForCreate });
const update = Joi.object(eventFields).min(1);

const listQuery = Joi.object({
  search: Joi.string().allow('').max(150),
  category: Joi.string().valid(...CATEGORIES),
  status: Joi.string().valid(...EVENT_STATUSES),
  seats: Joi.string().valid('Available', 'Full'),
  sort: Joi.string().valid('upcoming', 'popular', 'title'),
});

const idParam = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_PATTERN).required(),
});

module.exports = { create, update, listQuery, idParam };
