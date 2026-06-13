# 🌱 MahaFarm API — Phase 2 (Backend)

The Express + MongoDB backend for MahaFarm. It provides authentication with
session cookies, full CRUD for every farm resource, and aggregate endpoints
that power the Phase 1 dashboard. Models intentionally mirror the frontend's
mock-data shapes, so Phase 3 swaps mocks for live calls with minimal changes.

`Node` · `Express 4` · `MongoDB` · `Mongoose 8` · `JWT` · `bcrypt`

---

## Quick start

```bash
cd server
cp .env.example .env        # then edit values as needed
npm install

# Make sure MongoDB is running locally (or set MONGODB_URI to Atlas)
npm run seed                # creates the demo farm + login
npm run dev                 # starts the API on http://localhost:5000
```

**Demo login (after seeding):**
`demo@mahafarm.ng` / `password123`

Verify it's up: open `http://localhost:5000/api/health`.

---

## How auth & sessions work

- On register/login the API signs a **JWT** and sets it in an **httpOnly cookie**
  named `token` — this is the session. The token is also returned in the JSON
  body for non-browser clients.
- Protected routes accept the cookie **or** an `Authorization: Bearer <token>` header.
- `POST /api/auth/logout` clears the cookie.
- Passwords are hashed with **bcrypt**; the password field is never returned.
- CORS is locked to `CLIENT_URL` with credentials enabled so the browser can
  send the cookie.

---

## API reference

Base URL: `http://localhost:5000/api`
🔒 = requires authentication. All resource routes are scoped to the logged-in
user's farm.

### Auth
| Method | Endpoint | Body | Purpose |
|--------|----------|------|---------|
| POST | `/auth/register` | `name, email, password, farmName?` | Create user + farm, start session |
| POST | `/auth/login` | `email, password` | Start session |
| POST | `/auth/logout` | — | End session |
| GET | `/auth/me` 🔒 | — | Current user + farm |
| PATCH | `/auth/farm` 🔒 | farm fields | Update farm profile |

### Fields · Sensors · Alerts · Products · Tasks
Each of these is a standard REST collection:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/{resource}` 🔒 | List all (this farm) |
| POST | `/{resource}` 🔒 | Create |
| GET | `/{resource}/:id` 🔒 | Get one |
| PATCH | `/{resource}/:id` 🔒 | Update |
| DELETE | `/{resource}/:id` 🔒 | Delete |

`{resource}` ∈ `fields`, `sensors`, `alerts`, `products`, `tasks`.

### Disease scans
| Method | Endpoint | Body | Purpose |
|--------|----------|------|---------|
| GET | `/scans` 🔒 | — | Scan history |
| POST | `/scans` 🔒 | `imageName?, crop?` | Run a (simulated) scan and store the result |

### Aggregates & services
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/dashboard/summary` 🔒 | KPIs, sensors, chart series, alerts, schedule, attention — everything the overview needs |
| GET | `/weather` 🔒 | Current conditions, 7-day forecast, advisories |
| POST | `/assistant` 🔒 | Body `{ message }` → `{ reply }` |
| GET | `/health` | Service health check |

---

## Project structure

```
server/
├── .env.example
├── package.json
└── src/
    ├── index.js              # Boot: connect DB, start server, graceful shutdown
    ├── app.js                # Express app: security, parsing, routes, errors
    ├── config/
    │   ├── env.js            # Loads & validates environment variables
    │   └── db.js             # Mongoose connection
    ├── models/               # User, Farm, Field, Sensor, Alert, Product, Task, Scan, Reading
    ├── controllers/          # One per resource + auth, dashboard, weather, assistant
    ├── routes/               # One per resource, aggregated in routes/index.js
    ├── middleware/           # auth (JWT), validate, errorHandler, notFound, rateLimiter
    ├── utils/                # ApiError, asyncHandler, token, timeAgo, crudFactory
    └── seed/                 # data.js (dataset) + seed.js (loader)
```

---

## Data models

| Model | Mirrors Phase 1 | Key fields |
|-------|-----------------|-----------|
| `User` | — | name, email, password (hashed), role, farm |
| `Farm` | `farmProfile` | name, owner, location, area, zones, waterSavedWeek |
| `Field` | `fields[]` | crop, variety, stage, progress, health, moisture, status |
| `Sensor` | `sensors[]` | label, value, unit, status, icon, zone |
| `Alert` | `alerts[]` | severity, title, body, zone, resolved |
| `Product` | `products[]` | name, grade, price, unit, stock, category, trend |
| `Task` | `schedule[]` | time, label, kind, auto |
| `Scan` | `diseaseResults[]` | crop, disease, pathogen, confidence, severity, treatment |
| `Reading` | `moistureSeries`, `waterSeries` | kind, series[] (chart snapshots) |

---

## Error format

All errors return a consistent shape:

```json
{ "error": { "message": "Validation failed", "details": [ ... ] } }
```

Handled automatically: invalid ObjectIds (400), duplicate keys like email (409),
Mongoose validation (400), auth failures (401), and missing routes (404).

---

## Security notes

- `helmet` sets safe HTTP headers.
- `express-rate-limit` throttles auth attempts (20 / 15 min) and the API overall.
- `express-validator` validates auth input before it reaches the controller.
- Set a strong `JWT_SECRET` and `COOKIE_SECURE=true` (HTTPS) in production.

---

## What's next — Phase 3 (Deployment)

- Point the frontend at this API via `VITE_API_BASE_URL` and replace the mock
  imports with `fetch` calls (the response shapes already match).
- Host the API (Render/Railway/Fly), use managed MongoDB (Atlas), and serve the
  built frontend (Vercel/Netlify) — wired together with environment variables.
