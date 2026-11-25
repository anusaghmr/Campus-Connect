const eventService = require('../services/event.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const list = asyncHandler(async (req, res) => {
  const events = await eventService.listEvents(req.query, req.user);
  sendSuccess(res, 200, 'Events retrieved successfully.', events);
});

const getById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id, req.user);
  sendSuccess(res, 200, 'Event retrieved successfully.', event);
});

const create = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(req.body);
  sendSuccess(res, 201, 'Event created successfully.', event);
});

const update = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body);
  sendSuccess(res, 200, 'Event updated successfully.', event);
});

const remove = asyncHandler(async (req, res) => {
  const event = await eventService.deleteEvent(req.params.id);
  sendSuccess(res, 200, 'Event and its registrations were deleted.', event);
});

module.exports = { list, getById, create, update, remove };
