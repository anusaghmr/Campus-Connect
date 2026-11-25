const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const register = asyncHandler(async (req, res) => {
  const session = await authService.registerStudent(req.body);
  sendSuccess(res, 201, 'Student account created successfully.', session);
});

const login = asyncHandler(async (req, res) => {
  const session = await authService.login(req.body);
  sendSuccess(res, 200, `Welcome back, ${session.user.name}!`, session);
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user._id);
  sendSuccess(res, 200, 'Authenticated user retrieved.', { user });
});

module.exports = { register, login, me };
