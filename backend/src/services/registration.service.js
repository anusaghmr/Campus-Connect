const Event = require('../models/event.model');
const Registration = require('../models/registration.model');
const AppError = require('../utils/AppError');
const { toEventDTO, toRegistrationDTO, escapeRegex } = require('../utils/serialize');

const listRegistrations = async (query = {}, user) => {
  const filter = {};

  // Students only ever see their own passes; admins see the whole roster.
  if (user.role !== 'admin') filter.student = user._id;
  if (query.eventId) filter.event = query.eventId;
  if (query.status) filter.status = query.status;

  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [
      { studentName: pattern },
      { studentEmail: pattern },
      { studentId: pattern },
      { college: pattern },
    ];
  }

  const registrations = await Registration.find(filter).sort({ registeredAt: -1 }).lean();
  return registrations.map(toRegistrationDTO);
};

/**
 * Registers a student for an event. Business rules (published event, no
 * duplicate, capacity) live here, not in the controller or route.
 */
const createRegistration = async (eventId, user) => {
  const event = await Event.findById(eventId);
  if (!event) throw new AppError(404, 'Event not found.');
  if (event.status !== 'Published') {
    throw new AppError(400, 'This event is not open for registration.');
  }

  const existing = await Registration.findOne({ event: eventId, student: user._id });
  if (existing && existing.status === 'Confirmed') {
    throw new AppError(409, 'You are already registered for this event.');
  }

  if (event.registeredCount >= event.maxParticipants) {
    throw new AppError(400, 'This event has reached maximum capacity.');
  }

  let registration;
  if (existing) {
    // Re-activate a previously cancelled pass instead of creating a duplicate.
    existing.status = 'Confirmed';
    existing.registeredAt = new Date();
    await existing.save();
    registration = existing;
  } else {
    registration = await Registration.create({
      event: event._id,
      student: user._id,
      studentId: user.studentId || '',
      studentName: user.name,
      studentEmail: user.email,
      college: user.college || '',
      status: 'Confirmed',
    });
  }

  await Event.updateOne({ _id: event._id }, { $inc: { registeredCount: 1 } });
  const updatedEvent = await Event.findById(event._id);

  return {
    registration: toRegistrationDTO(registration),
    event: toEventDTO(updatedEvent),
  };
};

const cancelRegistration = async (id, user) => {
  const registration = await Registration.findById(id);
  if (!registration) throw new AppError(404, 'Registration not found.');

  if (user.role !== 'admin' && registration.student.toString() !== user._id.toString()) {
    throw new AppError(403, 'You can only cancel your own registrations.');
  }
  if (registration.status === 'Cancelled') {
    throw new AppError(400, 'This registration is already cancelled.');
  }

  registration.status = 'Cancelled';
  await registration.save();

  // Only decrement when the count is positive, so it can never go negative.
  await Event.updateOne(
    { _id: registration.event, registeredCount: { $gt: 0 } },
    { $inc: { registeredCount: -1 } }
  );
  const updatedEvent = await Event.findById(registration.event);

  return {
    registration: toRegistrationDTO(registration),
    event: updatedEvent ? toEventDTO(updatedEvent) : null,
  };
};

module.exports = { listRegistrations, createRegistration, cancelRegistration };
