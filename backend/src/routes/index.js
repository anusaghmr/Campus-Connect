const express = require('express');

const authRoutes = require('./auth.routes');
const eventRoutes = require('./event.routes');
const registrationRoutes = require('./registration.routes');
const userRoutes = require('./user.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/registrations', registrationRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
