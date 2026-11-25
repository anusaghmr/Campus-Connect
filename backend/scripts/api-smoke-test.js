/**
 * End-to-end API smoke test against a running backend with seeded data.
 *   node scripts/api-smoke-test.js
 */
const mongoose = require('mongoose');
const { mongoUri } = require('../src/config/env');
const User = require('../src/models/user.model');
const Registration = require('../src/models/registration.model');

const BASE = 'http://127.0.0.1:5000/api/v1';
let passed = 0;
let failed = 0;

const check = (name, condition, detail = '') => {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`  FAIL  ${name} ${detail}`);
  }
};

const request = async (method, path, { token, body } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch (_error) {
    payload = null;
  }
  return { status: response.status, payload };
};

const run = async () => {
  console.log('\n--- Public routes ---');
  const health = await request('GET', '/health');
  check('GET /health returns 200', health.status === 200, health.status);

  const publicEvents = await request('GET', '/events');
  check('GET /events returns published events', publicEvents.status === 200 && publicEvents.payload.data.length === 7, publicEvents.payload?.data?.length);
  const events = publicEvents.payload.data;
  const targetEvent = events[4];

  const filtered = await request('GET', '/events?category=Sports&sort=title');
  check('GET /events supports category filter', filtered.status === 200 && filtered.payload.data.length === 1, filtered.payload?.data?.length);

  const unauthorized = await request('GET', '/registrations');
  check('GET /registrations requires auth (401)', unauthorized.status === 401, unauthorized.status);

  console.log('\n--- Student auth ---');
  const studentLogin = await request('POST', '/auth/login', {
    body: { email: 'anusha.g@campus.edu', password: 'student2026' },
  });
  check('Student login succeeds', studentLogin.status === 200, studentLogin.payload?.message);
  const studentToken = studentLogin.payload.data.token;
  check('Login response contains no password hash', !JSON.stringify(studentLogin.payload).includes('password'));

  const me = await request('GET', '/auth/me', { token: studentToken });
  check('GET /auth/me returns student role', me.status === 200 && me.payload.data.user.role === 'student');

  const badLogin = await request('POST', '/auth/login', {
    body: { email: 'anusha.g@campus.edu', password: 'wrong-password' },
  });
  check('Wrong password returns 401', badLogin.status === 401, badLogin.status);

  const invalidBody = await request('POST', '/auth/login', { body: { email: 'not-an-email', password: '' } });
  check('Joi validation returns 422', invalidBody.status === 422 && Array.isArray(invalidBody.payload.errors), invalidBody.status);

  console.log('\n--- Student registrations ---');
  const myRegs = await request('GET', '/registrations', { token: studentToken });
  const allOwn = myRegs.payload.data.every((r) => r.studentEmail === 'anusha.g@campus.edu');
  check(
    'Student sees only own registrations',
    myRegs.status === 200 && myRegs.payload.data.length >= 3 && allOwn,
    myRegs.payload?.data?.length
  );

  const register = await request('POST', '/registrations', { token: studentToken, body: { eventId: targetEvent.id } });
  check('Student can register for an event', register.status === 201, register.payload?.message);
  const regId = register.payload?.data?.registration?.id;
  check('Registration increments event count', register.payload?.data?.event?.registeredCount === targetEvent.registeredCount + 1);

  const duplicate = await request('POST', '/registrations', { token: studentToken, body: { eventId: targetEvent.id } });
  check('Duplicate registration returns 409', duplicate.status === 409, duplicate.status);

  const cancel = await request('DELETE', `/registrations/${regId}`, { token: studentToken });
  check('Student can cancel own registration', cancel.status === 200, cancel.payload?.message);
  check('Cancellation restores event count', cancel.payload?.data?.event?.registeredCount === targetEvent.registeredCount);

  console.log('\n--- Student forbidden actions ---');
  const forbiddenCreate = await request('POST', '/events', { token: studentToken, body: { title: 'Nope' } });
  check('Student cannot create events (403)', forbiddenCreate.status === 403, forbiddenCreate.status);
  const forbiddenStats = await request('GET', '/dashboard/stats', { token: studentToken });
  check('Student cannot read admin stats (403)', forbiddenStats.status === 403, forbiddenStats.status);

  console.log('\n--- Saved events & profile ---');
  const saved = await request('PUT', `/users/me/saved-events/${targetEvent.id}`, { token: studentToken });
  check('Bookmark toggle returns saved ids', saved.status === 200 && Array.isArray(saved.payload.data.savedEventIds), saved.status);
  const unsaved = await request('PUT', `/users/me/saved-events/${targetEvent.id}`, { token: studentToken });
  check('Bookmark toggle is reversible', unsaved.status === 200 && !unsaved.payload.data.savedEventIds.includes(targetEvent.id));

  const profile = await request('PUT', '/users/me', { token: studentToken, body: { bio: 'Updated via API smoke test.' } });
  check('Profile update persists', profile.status === 200 && profile.payload.data.user.bio.includes('API smoke test'), profile.status);

  console.log('\n--- Admin auth, dashboard and event CRUD ---');
  const adminLogin = await request('POST', '/auth/login', {
    body: { email: 'admin.vance@campus.edu', password: 'admin2026' },
  });
  check('Admin login succeeds', adminLogin.status === 200, adminLogin.payload?.message);
  const adminToken = adminLogin.payload.data.token;

  const stats = await request('GET', '/dashboard/stats', { token: adminToken });
  check('Admin stats endpoint returns aggregates', stats.status === 200 && stats.payload.data.totalEvents === 7, stats.payload?.data?.totalEvents);
  check('Stats include category counts and trends', Array.isArray(stats.payload.data.categoryCounts) && Array.isArray(stats.payload.data.registrationTrends));

  const allRegs = await request('GET', '/registrations', { token: adminToken });
  check('Admin sees the full roster', allRegs.status === 200 && allRegs.payload.data.length >= 3, allRegs.payload?.data?.length);

  const newEventBody = {
    title: 'Smoke Test Workshop',
    description: 'Temporary event created by the automated API smoke test.',
    category: 'Workshops',
    startDate: '2026-12-31',
    registrationDeadline: '2026-12-30',
    venue: 'Test Lab',
    organizer: 'Test Organizer',
    maxParticipants: 10,
    status: 'Draft',
  };
  const created = await request('POST', '/events', { token: adminToken, body: newEventBody });
  check('Admin can create an event', created.status === 201, created.payload?.message);
  const createdId = created.payload?.data?.id;

  const adminEvents = await request('GET', '/events', { token: adminToken });
  check('Admin can see draft events', adminEvents.status === 200 && adminEvents.payload.data.length === 8, adminEvents.payload?.data?.length);

  const updated = await request('PUT', `/events/${createdId}`, { token: adminToken, body: { title: 'Smoke Test Workshop (Updated)' } });
  check('Admin can update an event', updated.status === 200 && updated.payload.data.title.includes('Updated'));

  const deleted = await request('DELETE', `/events/${createdId}`, { token: adminToken });
  check('Admin can delete an event', deleted.status === 200, deleted.payload?.message);

  const notFound = await request('GET', '/events/000000000000000000000000', { token: adminToken });
  check('Missing event returns 404', notFound.status === 404, notFound.status);

  console.log('\n--- Registration endpoint (fresh account) ---');
  const email = `smoke.${Date.now()}@campus.edu`;
  const registered = await request('POST', '/auth/register', {
    body: {
      name: 'Smoke Test Student',
      email,
      college: 'Faculty of Computer Engineering & Tech',
      studentId: `STU-SMOKE-${Date.now()}`,
      password: 'smoke1234',
      confirmPassword: 'smoke1234',
    },
  });
  check('Student registration endpoint works', registered.status === 201, registered.payload?.message);
  const change = await request('PUT', '/users/me/password', {
    token: registered.payload?.data?.token,
    body: { currentPassword: 'smoke1234', newPassword: 'smoke5678', confirmNewPassword: 'smoke5678' },
  });
  check('Password change verifies current password', change.status === 200, change.payload?.message);
  const relogin = await request('POST', '/auth/login', { body: { email, password: 'smoke5678' } });
  check('New password works after change', relogin.status === 200, relogin.status);

  // Remove records created only for this test (no public delete-user route).
  await mongoose.connect(mongoUri);
  await User.deleteOne({ email });
  if (regId) await Registration.deleteOne({ _id: regId });
  await mongoose.disconnect();

  console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
  if (failed) process.exit(1);
};

run().catch((error) => {
  console.error('Smoke test crashed:', error);
  process.exit(1);
});
