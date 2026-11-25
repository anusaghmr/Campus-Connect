const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const stats = asyncHandler(async (_req, res) => {
  const data = await dashboardService.getStats();
  sendSuccess(res, 200, 'Dashboard statistics retrieved successfully.', data);
});

module.exports = { stats };
