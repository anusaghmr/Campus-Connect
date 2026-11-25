const Event = require('../models/event.model');
const Registration = require('../models/registration.model');
const { CATEGORIES } = require('../config/constants');
const { toEventDTO, toRegistrationDTO } = require('../utils/serialize');

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const pad = (number) => String(number).padStart(2, '0');

/** Monthly registration counts for the last six calendar months. */
const buildTrends = (registrations) => {
  const now = new Date();
  const trends = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = `${monthDate.getFullYear()}-${pad(monthDate.getMonth() + 1)}`;
    const count = registrations.filter((registration) => {
      const date = new Date(registration.registeredAt);
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}` === key;
    }).length;

    trends.push({ month: MONTHS[monthDate.getMonth()], registrations: count });
  }
  return trends;
};

const getStats = async () => {
  const events = await Event.find().lean();
  const registrations = await Registration.find().lean();
  const activeRegistrations = registrations.filter((r) => r.status === 'Confirmed');

  const categoryCounts = CATEGORIES.map((category) => {
    const inCategory = events.filter((event) => event.category === category);
    return {
      category,
      count: inCategory.reduce((sum, event) => sum + (event.registeredCount || 0), 0),
    };
  }).sort((a, b) => b.count - a.count);

  const registrationTrends = buildTrends(activeRegistrations);
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 4)
    .map(toEventDTO);
  const recentRegistrations = [...activeRegistrations]
    .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
    .slice(0, 5)
    .map(toRegistrationDTO);

  return {
    totalEvents: events.length,
    activeEvents: events.filter((event) => event.status === 'Published').length,
    totalRegistrations: activeRegistrations.length,
    uniqueStudents: new Set(activeRegistrations.map((r) => r.student.toString())).size,
    categoryCounts,
    maxCategoryCount: Math.max(...categoryCounts.map((c) => c.count), 1),
    topCategory: categoryCounts[0] ? categoryCounts[0].category : CATEGORIES[0],
    registrationTrends,
    maxTrend: Math.max(...registrationTrends.map((t) => t.registrations), 1),
    recentEvents,
    recentRegistrations,
  };
};

module.exports = { getStats };
