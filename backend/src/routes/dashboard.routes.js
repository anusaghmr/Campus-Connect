const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.get('/stats', protect, restrictTo('admin'), dashboardController.stats);

module.exports = router;
