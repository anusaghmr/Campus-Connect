const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/token');
const { toUserDTO } = require('../utils/serialize');

const buildSession = (user) => ({
  token: signToken(user),
  user: toUserDTO(user),
});

const registerStudent = async ({ confirmPassword, ...data }) => {
  if (await User.exists({ email: data.email.toLowerCase() })) {
    throw new AppError(409, 'An account with this email already exists.');
  }
  if (await User.exists({ studentId: data.studentId })) {
    throw new AppError(409, 'An account with this student ID already exists.');
  }

  const user = await User.create({ ...data, role: 'student' });
  return buildSession(user);
};

const login = async ({ email, password }) => {
  // select('+password') is required because the field is select:false by default.
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new AppError(401, 'Invalid email or password.');
  }

  return buildSession(user);
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, 'User not found.');
  return toUserDTO(user);
};

module.exports = { registerStudent, login, getUserById };
