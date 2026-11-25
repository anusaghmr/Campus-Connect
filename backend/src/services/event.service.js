const Event = require('../models/event.model');
const Registration = require('../models/registration.model');
const AppError = require('../utils/AppError');
const { toEventDTO, escapeRegex } = require('../utils/serialize');

const SORTS = {
  upcoming: { startDate: 1 },
  popular: { registeredCount: -1 },
  title: { title: 1 },
};

const listEvents = async (query = {}, user) => {
  const isAdmin = user && user.role === 'admin';
  const filter = {};

  // Public visitors only ever see published events.
  if (!isAdmin && !query.status) filter.status = 'Published';
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;

  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [
      { title: pattern },
      { shortDescription: pattern },
      { description: pattern },
      { venue: pattern },
      { organizer: pattern },
    ];
  }

  if (query.seats === 'Available') {
    filter.$expr = { $lt: ['$registeredCount', '$maxParticipants'] };
  } else if (query.seats === 'Full') {
    filter.$expr = { $gte: ['$registeredCount', '$maxParticipants'] };
  }

  const events = await Event.find(filter).sort(SORTS[query.sort] || SORTS.upcoming).lean();
  return events.map(toEventDTO);
};

const getEventById = async (id, user) => {
  const event = await Event.findById(id);
  if (!event) throw new AppError(404, 'Event not found.');
  if (!user || user.role !== 'admin') {
    if (event.status !== 'Published') throw new AppError(404, 'Event not found.');
  }
  return toEventDTO(event);
};

const createEvent = async (data) => {
  const { registeredCount, id, ...safeData } = data;
  const event = await Event.create({ ...safeData, registeredCount: 0 });
  return toEventDTO(event);
};

const updateEvent = async (id, data) => {
  const event = await Event.findById(id);
  if (!event) throw new AppError(404, 'Event not found.');

  // Capacity counts are maintained by the registration service, never by a form.
  const { registeredCount, id: _ignoredId, ...safeData } = data;
  Object.entries(safeData).forEach(([key, value]) => {
    event[key] = value;
  });
  await event.save();
  return toEventDTO(event);
};

const deleteEvent = async (id) => {
  const event = await Event.findByIdAndDelete(id);
  if (!event) throw new AppError(404, 'Event not found.');
  await Registration.deleteMany({ event: event._id });
  return toEventDTO(event);
};

module.exports = { listEvents, getEventById, createEvent, updateEvent, deleteEvent };
