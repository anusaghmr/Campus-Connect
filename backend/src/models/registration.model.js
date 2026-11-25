const mongoose = require('mongoose');

const STATUSES = ['Confirmed', 'Cancelled'];

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Denormalized student details keep roster tables fast and match the UI.
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    college: { type: String, default: '' },
    registeredAt: { type: Date, default: Date.now },
    status: { type: String, enum: STATUSES, default: 'Confirmed' },
  },
  { timestamps: true }
);

// One registration document per student/event. Cancellation flips the status,
// so a student can never hold two passes for the same event.
registrationSchema.index({ event: 1, student: 1 }, { unique: true });
registrationSchema.index({ student: 1 });
registrationSchema.index({ status: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
