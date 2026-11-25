/**
 * Converts Mongoose documents into the exact plain-object shapes the existing
 * React UI already expects (string ids, YYYY-MM-DD dates, friendly timestamps).
 */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const pad = (number) => String(number).padStart(2, '0');

const formatRegisteredAt = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  let hours = date.getHours();
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${pad(date.getMinutes())} ${meridiem}`;
};

const plain = (doc) => (doc && typeof doc.toObject === 'function' ? doc.toObject() : { ...doc });

const idOf = (value) => {
  if (!value) return undefined;
  return (value._id || value).toString();
};

const toEventDTO = (doc) => {
  if (!doc) return null;
  const event = plain(doc);
  return {
    id: idOf(event._id || event.id),
    title: event.title,
    shortDescription: event.shortDescription || '',
    description: event.description || '',
    category: event.category,
    banner: event.banner || '',
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    startTime: event.startTime || '',
    endTime: event.endTime || '',
    venue: event.venue,
    organizer: event.organizer,
    organizerEmail: event.organizerEmail || '',
    maxParticipants: event.maxParticipants,
    registeredCount: event.registeredCount || 0,
    registrationDeadline: event.registrationDeadline,
    status: event.status,
    eligibility: event.eligibility || '',
    agenda: (event.agenda || []).map((item) => ({ time: item.time, title: item.title })),
    featured: Boolean(event.featured),
  };
};

const toUserDTO = (doc) => {
  if (!doc) return null;
  const user = plain(doc);
  return {
    id: idOf(user._id || user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    college: user.college || '',
    studentId: user.studentId || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
    savedEventIds: (user.savedEvents || []).map(idOf),
  };
};

const toRegistrationDTO = (doc) => {
  if (!doc) return null;
  const registration = plain(doc);
  return {
    id: idOf(registration._id || registration.id),
    eventId: idOf(registration.event || registration.eventId),
    studentId: registration.studentId || '',
    studentName: registration.studentName || '',
    studentEmail: registration.studentEmail || '',
    college: registration.college || '',
    registeredAt: formatRegisteredAt(registration.registeredAt),
    status: registration.status,
  };
};

/** Escapes user input used inside a MongoDB $regex (prevents regex injection). */
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = {
  toEventDTO,
  toUserDTO,
  toRegistrationDTO,
  formatRegisteredAt,
  escapeRegex,
};
