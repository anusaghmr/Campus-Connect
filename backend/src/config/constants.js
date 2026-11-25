// Presentation categories preserved from the original frontend (initialData.js).
const CATEGORIES = [
  'Technology',
  'Workshops',
  'Sports',
  'Cultural',
  'Competitions',
  'Seminars',
];

const EVENT_STATUSES = ['Published', 'Draft', 'Closed'];
const REGISTRATION_STATUSES = ['Confirmed', 'Cancelled'];
const ROLES = ['student', 'admin'];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

module.exports = {
  CATEGORIES,
  EVENT_STATUSES,
  REGISTRATION_STATUSES,
  ROLES,
  DATE_PATTERN,
  OBJECT_ID_PATTERN,
};
