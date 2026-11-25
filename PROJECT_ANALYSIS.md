# CampusConnect — Project Analysis

> Prepared before implementation. This document is the source of truth for the
> restructuring and backend design. No files were modified before this report
> was written.

## 1. Project Overview

**CampusConnect** is a university campus event management platform. It lets
students discover, bookmark and register for campus events (workshops,
hackathons, seminars, sports, cultural shows, competitions), view their own
event passes and profile, and lets administrators create/edit/delete events and
audit student registrations through a dashboard.

### Intended users
| Role | What they can do |
|------|------------------|
| **Guest / public visitor** | Browse landing page, explore published events, view event details, register (after login), create account. |
| **Student** | Dashboard with personal stats, explore/search/filter events, register/cancel, bookmark events, view passes, edit profile and password. |
| **Admin** | Dashboard with platform stats and charts, manage events (create/edit/publish/unpublish/delete), audit registrations, revoke passes, export CSV roster. |

### Main features discovered in the code
1. Public landing page (hero, featured events, category tiles, "how it works", platform statistics).
2. Login page with student/administrator role tabs and "one-click demo" quick-fill.
3. Student registration page (name, email, student ID, college, password).
4. Student dashboard (greeting, total/upcoming/completed metrics, registered list, recommendations, activity log).
5. Explore events (text search, category filter, seat-availability filter, sorting, load more, registration modal).
6. Event details (banner, description, agenda, eligibility, organizer, seats progress, register/cancel/share/save).
7. My registrations (Upcoming / Completed / Cancelled / Saved tabs, search, ticket, cancel).
8. Student profile (view/edit profile, avatar change, change-password modal).
9. Admin dashboard (4 KPI cards, registrations-growth bar chart, participation-by-category bars, recent events table, recent registrations feed).
10. Manage events (search/filter table, preview/edit/delete actions with confirmation modal).
11. Create/Edit event (full form with validation, banner URL presets, draft/publish actions).
12. Registration management (search/filter roster, detail modal, revoke pass, CSV export).

## 2. Existing Technology Stack

| Item | Finding |
|------|---------|
| Framework | React 18.3.1 (no Next.js, no CRA) |
| Build tool | Vite 5.4.2 (`@vitejs/plugin-react`) |
| Language | JavaScript only (`.jsx`), **no TypeScript** |
| Styling | Tailwind CSS 3.4.10 + PostCSS + Autoprefixer; custom fonts via Google Fonts |
| Icons | lucide-react 1.16.0 |
| Routing | **No router library.** Navigation is a `currentPage` string in React Context (`App.jsx` switch statement). |
| State management | Single React Context (`src/context/AppContext.jsx`) + component-local `useState`. |
| HTTP client | **None.** No Axios, Fetch wrapper or API service exists. |
| Backend / DB | **None.** No server, no MongoDB code, no API. |
| Existing dependencies | `lucide-react`, `react`, `react-dom`; dev: `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `autoprefixer`, `postcss`, `tailwindcss`, `vite`. |
| Scripts | `dev`, `build`, `preview` (Vite defaults). |

## 3. Existing Frontend Structure

```
src/
├── App.jsx                       # page switch + global navbar/footer/toast
├── main.jsx                      # React root + AppProvider
├── index.css                     # Tailwind layers + scrollbar styling
├── context/AppContext.jsx        # ALL app state and "business logic"
├── data/initialData.js           # all mock records + CATEGORIES
├── components/
│   ├── common/FeedbackComponents.jsx   # Toast + Modal
│   ├── events/EventCard.jsx
│   └── navigation/{PublicNavbar,PublicFooter,StudentSidebar,AdminSidebar}.jsx
└── pages/                        # 12 page components (listed in section 1)
```

Root config: `index.html`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`,
`package.json`, `package-lock.json`. Generated artifacts present but not source:
`dist/`, `node_modules/`.

The UI is polished and consistent (indigo/slate palette, Plus Jakarta Sans,
responsive grids, sticky sidebars, modals, animations). It must be preserved.

## 4. Identified Mock Implementations (must be replaced)

### 4.1 Hardcoded data — `src/data/initialData.js`
- `INITIAL_EVENTS`: 7 event records (evt-101 … evt-107).
- `INITIAL_REGISTRATIONS`: 6 registration records.
- `DEFAULT_USER`, `DEFAULT_ADMIN`: fake logged-in identities.
- `CATEGORIES`: 6 category strings — **presentation constant, keep as a frontend constant**.

### 4.2 localStorage persistence — `src/context/AppContext.jsx`
- `cc_events` → events array
- `cc_registrations` → registrations array
- `cc_saved_events` → bookmarked event IDs (global, not per user)
- Reads on init with `INITIAL_*` fallback, writes in `useEffect`.

### 4.3 Simulated operations — `src/context/AppContext.jsx`
- `loginUser(role, credentials)` — sets a fake user; admin/student decided by a UI tab, not credentials. No password check anywhere.
- `registerForEvent(eventId)` — mutates local arrays, checks duplicate/capacity locally, generates `reg-${Date.now()}`.
- `cancelRegistration(id)` — flips status locally and decrements count locally.
- `saveEvent(data)` — creates/updates local event with generated `evt-${Date.now()}`.
- `deleteEvent(id)` — filters local arrays (including registrations).
- `toggleSaveEvent(id)` — local array toggle.
- `updateProfile(data)` — merges into local user.
- `logout()` — clears local state only.

### 4.4 Fake / cosmetic-only interactions (documented, not silently left broken)
- **Forgot password** (`LoginPage.jsx`) — `alert(...)` with no action.
- **Change password** (`StudentProfilePage.jsx`) — validates two fields then only shows a success toast; current password never checked.
- **Download ticket** (`MyRegistrationsPage.jsx`) — toast only, no PDF.
- **Admin "Switch to Student View" / Student "Switch to Admin View"** — unrestricted role switching with no authorization.
- **Hardcoded reference date** `new Date('2026-11-20')` in `StudentDashboard.jsx` and `MyRegistrationsPage.jsx` for upcoming/completed classification.

### 4.5 Hardcoded dashboard numbers (presentation or mock analytics)
- Landing page: `98%`, `Over 3,400+ attendees`, `218 Registered`, `24+ Scheduled Events`, `150+`, `12,500+`, `35+`.
- Admin dashboard: `+18% this academic term`, `uniqueStudents + 1240`, `+28.4% YoY`, hardcoded `registrationTrends` array (Jul–Dec), `Peak: November 2026`, `Top Category: Competitions & Sports`.
- Category bars in admin dashboard derive from `registeredCount` in mock events — must come from DB.

**Decision:** Static marketing copy (hero slogan, "how it works", 3-step text) is
presentation content and will remain. All *data-derived* statistics will come
from the database/API. Hardcoded growth percentages that have no data source
will be replaced with labels that are true for the data shown, rather than
inventing numbers.

## 5. Required Database Entities

Derived from the UI fields and workflows (no invented entities):

### `users`
- `name`, `email` (unique, lowercase), `password` (bcrypt hash, never selected by default)
- `role`: `student` | `admin`
- Student-only profile: `studentId` (unique, sparse), `college`, `bio`, `avatar`
- `savedEvents`: `[ObjectId]` ref `events` (replaces `cc_saved_events`, now per-user)
- `createdAt` / `updatedAt` timestamps

### `events`
- `title`, `shortDescription`, `description`, `category`, `banner`
- `startDate`, `endDate`, `startTime`, `endTime`, `venue`
- `organizer`, `organizerEmail`
- `maxParticipants`, `registeredCount` (denormalized, atomically maintained)
- `registrationDeadline`, `status` (`Published` | `Draft` | `Closed`)
- `eligibility`, `agenda: [{ time, title }]`, `featured`
- Indexes: `category`, `status`, `startDate`

### `registrations`
- `event` (ObjectId ref `events`), `student` (ObjectId ref `users`)
- Denormalized display fields: `studentId`, `studentName`, `studentEmail`, `college`
- `registeredAt` (Date), `status` (`Confirmed` | `Cancelled`)
- Unique compound index on `(event, student)` (one active registration per student per event)
- Indexes: `event`, `student`, `status`

Dates are stored as `YYYY-MM-DD` strings because the existing UI formats and
compares them as strings; this preserves behavior exactly and avoids timezone
shifts.

## 6. Proposed API Endpoints (`/api/v1`)

### Auth
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/register` | public | Create student account (hashed password) |
| POST | `/auth/login` | public, rate-limited | Login with email + password, return JWT + user |
| GET | `/auth/me` | Bearer JWT | Restore session / verify identity |

### Events
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/events` | optional (admin sees drafts) | List events; query: `search`, `category`, `status`, `seats`, `sort` |
| GET | `/events/:id` | optional (admin sees drafts) | Single event |
| POST | `/events` | admin | Create event |
| PUT | `/events/:id` | admin | Update event |
| DELETE | `/events/:id` | admin | Delete event + its registrations |

### Registrations
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/registrations` | required | Student: own only; admin: all (query: `eventId`, `status`, `search`) |
| POST | `/registrations` | student | Register for event (duplicate + capacity checks, atomic count update) |
| DELETE | `/registrations/:id` | required | Cancel/revoke (owner or admin), atomic count decrement |

### Users
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| PUT | `/users/me` | required | Update own profile |
| PUT | `/users/me/password` | required | Change own password (verify current) |
| PUT | `/users/me/saved-events/:eventId` | required | Toggle bookmark |

### Dashboard
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/dashboard/stats` | admin | Real aggregates: counts, category counts, monthly registration trend, recent events/registrations |

## 7. Authentication & Authorization Requirements

- The app has two real roles → JWT auth + role checks are required.
- Passwords hashed with `bcryptjs`; never returned (Mongoose `select: false` + JSON transform).
- `JWT_SECRET` from environment; token stored in `localStorage` by the frontend.
- Session restored on load via `GET /auth/me` (survives refresh).
- Protected mutations: students may only cancel their own registrations and edit their own profile; admins may manage all events and registrations.
- The frontend role tab becomes a *login form mode only* — the server decides the actual role from the stored user.
- Rate limiting on `/auth/*`; Helmet, CORS allowlist, mongo-sanitize, Joi body validation, centralized error responses.

### Admin bootstrap (secure setup)
An admin cannot self-register. A small, documented seed script
(`backend/scripts/seed.js`) creates the admin from `ADMIN_EMAIL` /
`ADMIN_PASSWORD` environment variables (never hardcoded in app code), and
seeds the original 7 events plus one demo student from env variables so the
project is immediately demonstrable. The script is idempotent and refuses to
overwrite existing records.

## 8. Existing Issues and Inconsistencies

1. **No backend at all** — every "database" operation is a local array mutation.
2. **Data loss on refresh** until localStorage was added; localStorage is per-browser, not shared, and is not a database.
3. **Fake authentication** — role chosen by a UI toggle; no credentials verified. `LoginPage` initial password `password123` differs from quick-fill `student2026`.
4. **Role bypass** — sidebar "Switch to Admin View" gives any visitor admin UI.
5. **Date inconsistency** — hardcoded "today" (`2026-11-20`) makes upcoming/completed wrong over time. Replace with real current date.
6. **Inconsistent ID schemes** — events `evt-101`, registrations `reg-1`, generated IDs with `Date.now()`; Mongo ObjectIds will be serialized back to stable `id` strings.
7. **`registeredCount` duplicated** in events and derived from registrations; must be kept consistent atomically in the service layer.
8. **Bookmarks are global** in localStorage, not tied to a user.
9. **Mock analytics** presented as live ("Updated real-time from registration collections", "Real-time database sync").
10. **Dead-end actions** — forgot password, change password, download ticket show messages but do nothing real.
11. **No error/loading states** — the UI assumes data is always present. Needs API loading/error/empty handling.

## 9. Implementation Plan

1. **Phase 2 — Restructure**: move all frontend source/config (excluding generated `node_modules`/`dist` from source tree, but relocating them so installs stay local) into `frontend/`; verify build. Create independent `backend/`.
2. **Phase 3/4 — Backend**: Express app with five layers (routes → middleware → controllers → services → Mongoose models), MongoDB connection with graceful failure, env config, security middleware, centralized errors.
3. **Phase 5 — Integration**: add `frontend/src/services/api.js` (Axios, base URL from `VITE_API_BASE_URL`, auth header interceptor, error normalization). Rewrite `AppContext` to call APIs and expose the same names pages already use (plus `registerStudent`, `changePassword`, `stats`), with loading/error/empty handling. Update Login, Registration and Profile pages for real auth.
4. **Phase 6 — Security**: bcrypt, JWT, guards, Joi validation, sanitize, rate limit, CORS, Helmet.
5. **Phase 7/8 — Docs & config**: `.env.example` files, `API_DOCUMENTATION.md`, root `README.md`.
6. **Phase 9 — Verify**: start backend, connect Mongo, seed, exercise every endpoint via HTTP (auth, CRUD, authorization, validation), build frontend, run both servers, check integration in browser if available.
7. **Phase 10 — Review**: remove leftover mock data, fix broken imports, confirm no secrets committed, confirm UI unchanged.

### Explicit non-goals
- No redesign of the UI, no new pages, no router migration, no TypeScript.
- No invented features (e.g. real PDF tickets, password-reset emails) — these are
  cosmetic in the original and are not backed by any documented requirement.
  Where such a button exists it will either call a real API (change password)
  or be given honest, functional feedback rather than a false success message.
- No system-wide MongoDB changes; the existing local service is used as-is.
