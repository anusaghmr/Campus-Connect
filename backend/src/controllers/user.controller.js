const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const me = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user);
  sendSuccess(res, 200, 'Profile retrieved successfully.', { user });
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user, req.body);
  sendSuccess(res, 200, 'Profile updated successfully.', { user });
});

const changePassword = asyncHandler(async (req, res) => {
  const result = await userService.changePassword(req.user, req.body);
  sendSuccess(res, 200, result.message);
});

const toggleSavedEvent = asyncHandler(async (req, res) => {
  const result = await userService.toggleSavedEvent(req.user, req.params.eventId);
  sendSuccess(res, 200, 'Saved events updated successfully.', result);
});

module.exports = { me, updateMe, changePassword, toggleSavedEvent };
