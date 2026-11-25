const AppError = require('../utils/AppError');

/**
 * Joi validation middleware. Unknown fields are stripped (prevents clients
 * from injecting role, registeredCount or other privileged values).
 */
const validate = (schema, source = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message.replace(/"/g, ''),
    }));
    return next(new AppError(422, 'Validation failed', errors));
  }

  req[source] = value;
  next();
};

module.exports = validate;
