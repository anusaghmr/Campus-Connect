const User = require('../models/user.model');
const Event = require('../models/event.model');
const AppError = require('../utils/AppError');
const { toUserDTO } = require('../utils/serialize');

const getMe = (user) => toUserDTO(user);

const updateMe = async (user, data) => {
  if (data.email && data.email.toLowerCase() !== user.email) {
    if (await User.exists({ email: data.email.toLowerCase() })) {
      throw new AppError(409, 'An account with this email already exists.');
    }
  }
  if (data.studentId && data.studentId !== user.studentId) {
    if (await User.exists({ studentId: data.studentId })) {
      throw new AppError(409, 'An account with this student ID already exists.');
    }
  }

  // Role, password and savedEvents can never be set through this endpoint.
  // Only explicitly supplied fields are assigned, so partial updates work.
  ['name', 'email', 'college', 'studentId', 'bio', 'avatar'].forEach((field) => {
    if (data[field] !== undefined) user[field] = data[field];
  });
  await user.save();
  return toUserDTO(user);
};

const changePassword = async (user, { currentPassword, newPassword }) => {
  const freshUser = await User.findById(user._id).select('+password');
  if (!freshUser || !(await freshUser.matchPassword(currentPassword))) {
    throw new AppError(401, 'Your current password is incorrect.');
  }
  freshUser.password = newPassword; // hashed by the model's pre-save hook
  await freshUser.save();
  return { message: 'Password updated successfully.' };
};

const toggleSavedEvent = async (user, eventId) => {
  if (!(await Event.exists({ _id: eventId }))) {
    throw new AppError(404, 'Event not found.');
  }

  const saved = user.savedEvents.map((id) => id.toString());
  if (saved.includes(eventId)) {
    user.savedEvents.pull(eventId);
  } else {
    user.savedEvents.addToSet(eventId);
  }
  await user.save();

  return {
    savedEventIds: user.savedEvents.map((id) => id.toString()),
  };
};

module.exports = { getMe, updateMe, changePassword, toggleSavedEvent };
