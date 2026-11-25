/**
 * Idempotent demo bootstrap. It NEVER overwrites existing records.
 *
 *   npm run seed
 *
 * Credentials are read from backend/.env (see .env.example). The values in this
 * file are development fallbacks only — set your own before using anywhere
 * other than a local machine.
 */
const mongoose = require('mongoose');
const { mongoUri } = require('../src/config/env');
const User = require('../src/models/user.model');
const Event = require('../src/models/event.model');
const Registration = require('../src/models/registration.model');
const { SEED_EVENTS, DEMO_STUDENT, DEMO_ADMIN } = require('../src/utils/seedData');

const adminEmail = (process.env.ADMIN_EMAIL || DEMO_ADMIN.email).toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || 'admin2026';
const studentEmail = (process.env.DEMO_STUDENT_EMAIL || DEMO_STUDENT.email).toLowerCase();
const studentPassword = process.env.DEMO_STUDENT_PASSWORD || 'student2026';

const run = async () => {
  await mongoose.connect(mongoUri);

  if ((await Event.countDocuments()) === 0) {
    await Event.insertMany(SEED_EVENTS);
    console.log(`Seeded ${SEED_EVENTS.length} events from the original project data.`);
  } else {
    console.log('Events already present — skipped event seeding.');
  }

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      ...DEMO_ADMIN,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Created administrator: ${adminEmail}`);
  } else {
    console.log(`Administrator already exists: ${adminEmail}`);
  }

  let student = await User.findOne({ email: studentEmail });
  if (!student) {
    student = await User.create({
      ...DEMO_STUDENT,
      email: studentEmail,
      password: studentPassword,
      role: 'student',
    });
    console.log(`Created demo student: ${studentEmail}`);
  } else {
    console.log(`Demo student already exists: ${studentEmail}`);
  }

  if ((await Registration.countDocuments()) === 0) {
    const events = await Event.find().sort({ startDate: 1 }).limit(6);
    const registrations = [
      { index: 0, date: '2026-11-18T10:14:00' },
      { index: 1, date: '2026-11-20T14:45:00' },
      { index: 2, date: '2026-11-21T11:20:00' },
    ].filter((item) => events[item.index]);

    if (registrations.length) {
      await Registration.insertMany(
        registrations.map((item) => ({
          event: events[item.index]._id,
          student: student._id,
          studentId: student.studentId,
          studentName: student.name,
          studentEmail: student.email,
          college: student.college,
          registeredAt: new Date(item.date),
          status: 'Confirmed',
        }))
      );
      console.log(`Seeded ${registrations.length} registrations for the demo student.`);
    }

    // Restore the two bookmarks the original UI started with.
    if (events[0] && events[3]) {
      student.savedEvents = [events[0]._id, events[3]._id];
      await student.save();
      console.log('Seeded 2 saved events for the demo student.');
    }
  } else {
    console.log('Registrations already present — skipped registration seeding.');
  }

  console.log('\nDemo credentials (local development only):');
  console.log(`  Student: ${studentEmail} / ${studentPassword}`);
  console.log(`  Admin:   ${adminEmail} / ${adminPassword}`);

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
