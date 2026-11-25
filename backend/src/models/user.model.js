const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
      required: true,
    },
    college: { type: String, default: '' },
    studentId: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true,
      trim: true,
    },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// A password hash must never leave the server, even if a document is returned.
userSchema.set('toJSON', {
  transform(_doc, returned) {
    delete returned.password;
    delete returned.__v;
    return returned;
  },
});

module.exports = mongoose.model('User', userSchema);
