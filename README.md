# CampusConnect — MERN Student Event Management Platform

CampusConnect is a university event platform where students can discover,
bookmark and register for campus events, and administrators can publish events
and audit registrations. The original project was a React UI backed by mock
data and `localStorage`; it is now a complete MERN application backed by
Express, MongoDB and Mongoose.

- Detailed pre-implementation findings: [`PROJECT_ANALYSIS.md`](PROJECT_ANALYSIS.md)
- Backend endpoint reference: [`backend/API_DOCUMENTATION.md`](backend/API_DOCUMENTATION.md)

---

## 1. Technology stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5, Tailwind CSS 3, lucide-react, Axios |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB (local service on port 27017) |
| Security | bcryptjs, JWT, Helmet, CORS allowlist, express-rate-limit, express-mongo-sanitize, Joi |
| Language | JavaScript (`.jsx` on the frontend, CommonJS on the backend) |

---

## 2. Folder structure

```
homework/
├── frontend/
│   ├── public/                 # (Vite serves static files from the project root)
│   ├── src/
│   │   ├── assets/             # reserved for local assets
│   │   ├── components/         # shared cards, navigation, feedback
│   │   ├── context/            # AppContext — the only UI ↔ API integration point
│   │   ├── data/               # categories constant
│   │   ├── hooks/              # reserved for custom hooks
│   │   ├── layouts/            # reserved for layouts
│   │   ├── pages/              # 12 preserved pages
│   │   ├── services/           # Axios client + grouped API calls
│   │   ├── utils/              # shared helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── scripts/                # seed + API smoke test
│   ├── src/
│   │   ├── config/             # env, MongoDB connection, constants
│   │   ├── controllers/        # thin HTTP layer
│   │   ├── middlewares/        # auth, validation, logging, errors, rate limit
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # /api/v1 routes
│   │   ├── services/           # business logic
│   │   ├── utils/              # errors, tokens, serialization
│   │   ├── validators/         # Joi schemas
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── API_DOCUMENTATION.md
│   └── package.json
├── PROJECT_ANALYSIS.md
└── README.md
```

Request flow (five layers):

```
React page → AppContext → Axios service → Express route → middleware →
controller → service → Mongoose model → MongoDB
```

---

## 3. Prerequisites

- **Node.js 18+** and npm (Node 24 / npm 12 were used during development).
- **MongoDB Community Server** installed locally. The service must be running on `127.0.0.1:27017`.

Check your installation:

```powershell
node --version
npm --version
Get-Service MongoDB
```

---

## 4. MongoDB setup

The installer normally registers MongoDB as a Windows service which starts
automatically. If it is stopped, start it with:

```powershell
Start-Service MongoDB
```

If MongoDB is not registered as a service, start it manually with a data directory:

```powershell
New-Item -ItemType Directory -Force -Path C:\data\db
& "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath C:\data\db
```

The application creates and uses the database **`campusconnect`**. Change the
name in `MONGODB_URI` if you prefer. Existing data is never deleted by the app
or by the seed script.

---

## 5. Environment configuration

### Backend

```powershell
cd backend
copy .env.example .env
```

Then edit `backend/.env`:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/campusconnect
FRONTEND_URL=http://localhost:5173
JWT_SECRET=a-long-random-string-of-your-choice
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin.vance@campus.edu
ADMIN_PASSWORD=choose-a-strong-admin-password
DEMO_STUDENT_EMAIL=anusha.g@campus.edu
DEMO_STUDENT_PASSWORD=choose-a-demo-password
```

`JWT_SECRET` is required — the server refuses to start without it. `.env` is
gitignored and never exposed to the frontend.

### Frontend

```powershell
cd frontend
copy .env.example .env.local
```

`frontend/.env.local` contains only the public API URL:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 6. Install and seed

Open two terminals in the project root.

Terminal 1 — backend:

```powershell
cd backend
npm install
npm run seed
npm run dev
```

`npm run seed` is idempotent. On an empty database it inserts:
- the original 7 events from the project,
- one administrator and one demo student (credentials from `.env`),
- 3 registrations and 2 bookmarks for the demo student.

It never overwrites records that already exist.

Terminal 2 — frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

Default local demo accounts (matching the one-click pills on the login page):

| Role | Email | Password |
|------|-------|----------|
| Student | `anusha.g@campus.edu` | `student2026` |
| Admin | `admin.vance@campus.edu` | `admin2026` |

> These credentials are for local demonstration only. Change them in
> `backend/.env` for anything beyond your own machine, and update the quick-fill
> values in `frontend/src/pages/LoginPage.jsx` accordingly.

---

## 7. Running without seeding

If you skip `npm run seed`, the app still works: the database is empty, the
landing page shows zero events, and you can create the first student account
through the registration page. To create an admin, set `ADMIN_EMAIL` and
`ADMIN_PASSWORD` in `.env` and run `npm run seed` (it creates only the missing
accounts and initial events).

---

## 8. Verification commands

With the backend running:

```powershell
cd backend
node scripts/api-smoke-test.js
```

Expected result: `32 passed, 0 failed`. The test exercises public routes,
authentication, validation, student/admin authorization, registration CRUD,
bookmarks, profile updates, password changes, admin dashboard aggregates and
event CRUD. It removes the temporary records it creates.

Frontend production build:

```powershell
cd frontend
npm run build
```

---

## 9. What changed from the mock version

| Mock implementation | Replacement |
|---------------------|-------------|
| `INITIAL_EVENTS`, `INITIAL_REGISTRATIONS` arrays | `events` and `registrations` MongoDB collections |
| `DEFAULT_USER`, `DEFAULT_ADMIN`, role chosen by a UI tab | Real login with bcrypt + JWT; role stored in the database |
| `cc_events`, `cc_registrations`, `cc_saved_events` in `localStorage` | MongoDB; only the JWT is stored in `localStorage` |
| Fake `loginUser`, `registerForEvent`, `cancelRegistration`, `saveEvent`, `deleteEvent`, `updateProfile` | Axios calls to REST endpoints, with loading/error/toast handling |
| Global bookmarks | `savedEvents` array on the user document |
| Static dashboard numbers and fake monthly chart | `GET /dashboard/stats` aggregates from MongoDB |
| Hardcoded "today" (`2026-11-20`) | Current date |
| "Change password" that only showed a toast | `PUT /users/me/password` with current-password verification |
| "Forgot password" false-success alert | Honest message pointing to campus administration |
| "Ticket download" false-success toast | Copies the real pass details to the clipboard |
| Unrestricted "Switch to Admin View" | Navigation guard based on the authenticated role |

The visual design, colours, typography, page structure, navigation and all 12
pages were preserved.

---

## 10. Security notes

- Passwords are hashed with bcrypt (10 rounds) and are excluded from queries and JSON responses.
- JWT secret comes from `.env`; tokens expire after 7 days by default.
- Students can edit only their own profile and cancel only their own registrations.
- Admin endpoints check the role on the server, not just in the UI.
- Joi schemas strip unknown fields, so clients cannot inject `role`, `registeredCount`, etc.
- `express-mongo-sanitize` removes `$`/`.` from user input (NoSQL injection protection).
- Helmet sets security headers; CORS only allows the configured frontend origins.
- Auth endpoints are rate limited; errors are centralised and stack traces are hidden in production.
- No secrets or `.env` files are committed.

---

## 11. Troubleshooting

| Problem | Fix |
|---------|-----|
| `JWT_SECRET is not set` | Create `backend/.env` from `.env.example` and restart the backend. |
| `Cannot reach the server` banner in UI | Start the backend (`npm run dev` in `backend`) and confirm `http://localhost:5000/api/v1/health` returns JSON. |
| MongoDB connection failed | Start the MongoDB service (`Start-Service MongoDB`). |
| CORS error in browser console | Make sure `FRONTEND_URL` matches the exact frontend URL and that you open `http://localhost:5173`. |
| Port already in use | Stop the process using port 5000/5173, or change `PORT`/Vite port. |
| Login says "Invalid email or password" | Run `npm run seed`, or check the credentials in `backend/.env`; quick-fill uses the default local values. |
| Events look empty | Run `npm run seed`, or create an event from the admin portal. |
| Browser refresh logs you out | That means the JWT expired or `.env` changed; log in again. |

---

## 12. Known limitations

- Password-reset emails and PDF ticket generation were not part of the original
  documented feature set, so they were not invented. Their buttons now give
  honest, working feedback instead of a fake success message.
- The SPA uses context-based page switching (as in the original project), so
  URLs do not change per page and browser Back does not navigate between pages.
- Registration counts seeded from the original data are aggregate figures; the
  seeded roster contains 3 example registrations for the demo student.
