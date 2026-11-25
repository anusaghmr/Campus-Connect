const registrationService = require('../services/registration.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const list = asyncHandler(async (req, res) => {
  const registrations = await registrationService.listRegistrations(req.query, req.user);
  sendSuccess(res, 200, 'Registrations retrieved successfully.', registrations);
});

const create = asyncHandler(async (req, res) => {
  const result = await registrationService.createRegistration(req.body.eventId, req.user);
  sendSuccess(res, 201, 'Registration confirmed successfully.', result);
});

const remove = asyncHandler(async (req, res) => {
  const result = await registrationService.cancelRegistration(req.params.id, req.user);
  sendSuccess(res, 200, 'Registration cancelled successfully.', result);
});

module.exports = { list, create, remove };
