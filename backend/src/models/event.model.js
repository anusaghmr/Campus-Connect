const mongoose = require('mongoose');
const {
  CATEGORIES,
  EVENT_STATUSES: STATUSES,
  DATE_PATTERN: datePattern,
} = require('../config/constants');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, required: true },
    category: { type: String, enum: CATEGORIES, required: true },
    banner: { type: String, default: '' },
    startDate: { type: String, required: true, match: datePattern },
    endDate: { type: String, default: '', match: datePattern },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    venue: { type: String, required: true, trim: true },
    organizer: { type: String, required: true, trim: true },
    organizerEmail: { type: String, default: '' },
    maxParticipants: { type: Number, required: true, min: 1 },
    registeredCount: { type: Number, default: 0, min: 0 },
    registrationDeadline: { type: String, required: true, match: datePattern },
    status: { type: String, enum: STATUSES, default: 'Published' },
    eligibility: { type: String, default: '' },
    agenda: [
      {
        _id: false,
        time: { type: String, required: true },
        title: { type: String, required: true },
      },
    ],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ startDate: 1 });

module.exports = mongoose.model('Event', eventSchema);
