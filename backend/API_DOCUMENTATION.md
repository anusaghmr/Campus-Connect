# CampusConnect REST API Documentation

Base URL: `http://localhost:5000/api/v1`

All responses use a consistent envelope:

```json
{ "success": true, "message": "…", "data": {} }
```

Errors:

```json
{ "success": false, "message": "…", "errors": [{ "field": "email", "message": "…" }] }
```

Authentication uses a JWT sent as `Authorization: Bearer <token>`. Tokens are
returned by `POST /auth/login` and `POST /auth/register`. Roles are
`student` and `admin`; they are stored in the database and inside the signed
token, never read from the request body.

---

## Health

### `GET /health`
- **Purpose:** Check that the API process is running.
- **Auth:** none.
- **Response 200:** `{ success: true, message: "CampusConnect API is running.", data: { status: "ok", uptime: 12 } }`

---

## Authentication

### `POST /auth/register`
- **Purpose:** Create a student account. Admin accounts cannot be created here.
- **Auth:** none.
- **Rate limit:** included in the auth limiter group.
- **Body:**
```json
{
  "name": "Alex Morgan",
  "email": "alex@campus.edu",
  "college": "Faculty of Computer Engineering & Tech",
  "studentId": "STU-2026-1001",
  "password": "secret123",
  "confirmPassword": "secret123"
}
```
- **Response 201:** `{ success: true, message: "Student account created successfully.", data: { token, user } }`
- **Errors:** `400` invalid, `409` email/student ID already exists, `422` validation failure.

### `POST /auth/login`
- **Purpose:** Verify credentials and issue a JWT. The role in the response comes from the database.
- **Auth:** none.
- **Rate limit:** max 20 requests per 15 minutes per IP.
- **Body:** `{ "email": "anusha.g@campus.edu", "password": "student2026" }`
- **Response 200:** `{ success: true, message: "Welcome back, Anusha Ghimire!", data: { token, user } }`
- **Errors:** `401` invalid email/password or expired token input, `422` validation failure, `429` rate limit exceeded.

### `GET /auth/me`
- **Purpose:** Restore the current session after a browser refresh.
- **Auth:** required.
- **Response 200:** `{ success: true, message: "Authenticated user retrieved.", data: { user } }`
- **Errors:** `401` missing/invalid token, `404` user no longer exists.

---

## Events

### `GET /events`
- **Purpose:** List events, with optional server-side search, filtering and sorting. Guests and students see only `Published` events; an authenticated admin sees all statuses.
- **Auth:** optional (admin token reveals drafts).
- **Query parameters (all optional):**
  - `search` — matches title, short description, full description, venue, organizer.
  - `category` — one of Technology, Workshops, Sports, Cultural, Competitions, Seminars.
  - `status` — Published | Draft | Closed.
  - `seats` — `Available` or `Full`.
  - `sort` — `upcoming` (default), `popular`, `title`.
- **Response 200:** `{ success: true, message: "Events retrieved successfully.", data: [event, …] }`
- **Errors:** `422` invalid query value.

### `GET /events/:id`
- **Purpose:** Retrieve one event with its full agenda.
- **Auth:** optional; non-admins receive 404 for Draft/Closed events.
- **Response 200:** `{ success: true, message: "Event retrieved successfully.", data: event }`
- **Errors:** `400` malformed id, `404` not found or not visible.

### `POST /events`
- **Purpose:** Create an event.
- **Auth:** required, admin only.
- **Body:**
```json
{
  "title": "Robotics Symposium",
  "shortDescription": "Short card summary",
  "description": "Full event description (minimum 10 characters)",
  "category": "Workshops",
  "banner": "https://images.unsplash.com/…",
  "startDate": "2026-12-30",
  "endDate": "2026-12-30",
  "startTime": "10:00 AM",
  "endTime": "04:00 PM",
  "venue": "Robotics Lab",
  "organizer": "Robotics Club",
  "organizerEmail": "robotics@campus.edu",
  "maxParticipants": 100,
  "registrationDeadline": "2026-12-28",
  "status": "Published",
  "eligibility": "Open to all students",
  "agenda": [{ "time": "10:00 AM", "title": "Opening" }],
  "featured": false
}
```
- **Response 201:** `{ success: true, message: "Event created successfully.", data: event }`
- **Errors:** `401` no token, `403` student token, `409` duplicate, `422` validation failure.

### `PUT /events/:id`
- **Purpose:** Update any subset of event fields. `registeredCount`, `id` and `role` are ignored even if sent.
- **Auth:** required, admin only.
- **Body:** any valid subset of the create fields (at least one).
- **Response 200:** `{ success: true, message: "Event updated successfully.", data: event }`
- **Errors:** `400` malformed id, `401`, `403`, `404`, `422`.

### `DELETE /events/:id`
- **Purpose:** Delete an event and all of its registrations.
- **Auth:** required, admin only.
- **Response 200:** `{ success: true, message: "Event and its registrations were deleted.", data: event }`
- **Errors:** `400`, `401`, `403`, `404`.

---

## Registrations

### `GET /registrations`
- **Purpose:** List registrations. Students receive only their own; admins receive the full roster.
- **Auth:** required.
- **Query parameters:** `eventId`, `status` (`Confirmed`/`Cancelled`), `search` (student name, email, ID, college).
- **Response 200:** `{ success: true, message: "Registrations retrieved successfully.", data: [registration, …] }`
- **Errors:** `401`, `422`.

### `POST /registrations`
- **Purpose:** Register the authenticated student for an event.
- **Auth:** required (student or admin token).
- **Business rules (service layer):** event must exist and be `Published`, no duplicate active pass, capacity must not be exceeded. Cancelling then re-registering reactivates the existing document. `registeredCount` is incremented atomically.
- **Body:** `{ "eventId": "<24-char ObjectId>" }`
- **Response 201:**
```json
{
  "success": true,
  "message": "Registration confirmed successfully.",
  "data": { "registration": {…}, "event": {…} }
}
```
- **Errors:** `400` event closed or full, `401`, `404` event missing, `409` duplicate, `422` invalid id.

### `DELETE /registrations/:id`
- **Purpose:** Cancel/revoke a registration. Students can only cancel their own; admins can cancel any.
- **Auth:** required.
- **Response 200:** `{ success: true, message: "Registration cancelled successfully.", data: { registration, event } }`
- **Errors:** `400` already cancelled, `401`, `403` not the owner, `404`, `422`.

---

## Users

### `GET /users/me`
- **Purpose:** Return the authenticated user's profile and saved event IDs.
- **Auth:** required.
- **Response 200:** `{ success: true, message: "Profile retrieved successfully.", data: { user } }`
- **Errors:** `401`.

### `PUT /users/me`
- **Purpose:** Update own profile (partial updates supported).
- **Auth:** required.
- **Body:** any of `name`, `email`, `college`, `studentId`, `bio`, `avatar`. `role`, `password` and `savedEvents` are stripped by validation.
- **Response 200:** `{ success: true, message: "Profile updated successfully.", data: { user } }`
- **Errors:** `401`, `409` email/student ID taken, `422` validation failure.

### `PUT /users/me/password`
- **Purpose:** Change own password after verifying the current one.
- **Auth:** required.
- **Body:**
```json
{
  "currentPassword": "student2026",
  "newPassword": "newSecret123",
  "confirmNewPassword": "newSecret123"
}
```
- **Response 200:** `{ success: true, message: "Password updated successfully." }`
- **Errors:** `401` wrong current password, `422` validation/mismatch.

### `PUT /users/me/saved-events/:eventId`
- **Purpose:** Toggle a bookmark for an event (adds if absent, removes if present).
- **Auth:** required.
- **Response 200:** `{ success: true, message: "Saved events updated successfully.", data: { savedEventIds: [ … ] } }`
- **Errors:** `401`, `404` event missing, `422` invalid id.

---

## Dashboard

### `GET /dashboard/stats`
- **Purpose:** Real aggregates computed from MongoDB for the admin dashboard.
- **Auth:** required, admin only.
- **Response 200** `data` contains:
  - `totalEvents`, `activeEvents`, `totalRegistrations`, `uniqueStudents`
  - `categoryCounts: [{ category, count }]`, `maxCategoryCount`, `topCategory`
  - `registrationTrends: [{ month, registrations }]` for the last 6 months, `maxTrend`
  - `recentEvents: [event]`, `recentRegistrations: [registration]`
- **Errors:** `401`, `403`.

---

## General error codes

| Code | Meaning |
|------|---------|
| 400 | Malformed identifier or a business rule was violated |
| 401 | Authentication required / invalid credentials or token |
| 403 | Authenticated but not authorized (role or ownership) |
| 404 | Resource not found or not visible to this user |
| 409 | Duplicate email, student ID or registration |
| 422 | Joi/Mongoose validation failure |
| 429 | Too many authentication attempts |
| 500 | Unexpected server error (stack trace hidden in production) |
