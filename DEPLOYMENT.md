# 🚀 MahaFarm — Deployment Guide (Phase 3)

This guide covers running MahaFarm three ways: **local dev**, **one-command Docker**,
and **cloud hosting**. The frontend (Vite/React) lives at the project root; the backend
(Express/MongoDB) lives in [`server/`](./server).

---

## 0. How the pieces connect

```
Browser ──► Frontend (static, nginx/CDN) ──► /api ──► Backend (Express) ──► MongoDB
                         VITE_API_BASE_URL              MONGODB_URI
```

Two settings drive everything:

| Where | Variable | Meaning |
|-------|----------|---------|
| Frontend | `VITE_API_BASE_URL` | Base URL the browser calls (e.g. `/api` or `https://api.example.com/api`) |
| Frontend | `VITE_ENABLE_MOCK_DATA` | `true` = run on built-in mock data (no backend); `false` = call the real API |
| Backend | `MONGODB_URI` | MongoDB connection string |
| Backend | `JWT_SECRET` | Secret used to sign session tokens |
| Backend | `COOKIE_SECURE` | `true` over HTTPS (sets `SameSite=None; Secure` for cross-site cookies) |
| Backend | `CLIENT_URL` | Frontend origin, allowed by CORS |

> The session is a JWT in an httpOnly cookie. When the frontend and API are on
> **different domains** (e.g. Vercel + Render), set `COOKIE_SECURE=true` and a
> correct `CLIENT_URL` so the browser will store and send the cookie.

---

## 1. Local development (two terminals)

**Terminal A — backend**
```bash
cd server
cp .env.example .env          # set MONGODB_URI + JWT_SECRET
npm install
npm run seed                  # creates the demo farm + login
npm run dev                   # http://localhost:5000
```

**Terminal B — frontend**
```bash
cp .env.example .env          # set VITE_ENABLE_MOCK_DATA=false to use the API
npm install
npm run dev                   # http://localhost:5173
```

- Leave `VITE_ENABLE_MOCK_DATA=true` to run the UI with **no backend at all**.
- Set it to `false` (with the API running) to exercise the real endpoints.

**Demo login:** `demo@mahafarm.ng` / `password123`

---

## 2. One-command Docker (full stack)

Requires Docker + Docker Compose. From the project root:

```bash
docker compose up --build
# first run only — load the demo data:
docker compose exec api npm run seed
```

Then open **http://localhost:8080**.

What it runs:

| Service | Image / build | Port | Notes |
|---------|---------------|------|-------|
| `mongo` | `mongo:7` | internal | data persisted in the `mongo_data` volume |
| `api` | `./server/Dockerfile` | `5000` | Express backend |
| `web` | `./Dockerfile` (nginx) | `8080` | built frontend; proxies `/api` → `api:5000` |

Because nginx proxies `/api` to the backend, the browser talks to a **single origin**
(`localhost:8080`) — no CORS, and cookies just work.

Tear down (keep data): `docker compose down`
Tear down (wipe data): `docker compose down -v`

---

## 3. Cloud hosting

### Step 1 — Database (MongoDB Atlas)
1. Create a free cluster at mongodb.com/atlas.
2. Add a database user and allow network access.
3. Copy the connection string → this is your `MONGODB_URI`.

### Step 2a — Deploy with the Render blueprint (API + frontend together)
The repo ships a [`render.yaml`](./render.yaml). In Render: **New → Blueprint**, point it
at the repo, then set the `sync: false` variables in the dashboard:

- `mahafarm-api` → `MONGODB_URI` (Atlas), `CLIENT_URL` (the static site URL)
- `mahafarm-web` → `VITE_API_BASE_URL` (e.g. `https://mahafarm-api.onrender.com/api`)

`JWT_SECRET` is generated automatically; `COOKIE_SECURE` is already `true`.
After the first deploy, seed once from the API service shell: `npm run seed`.

### Step 2b — Or split: Vercel/Netlify (frontend) + Render (API)
- **Frontend:** import the repo into Vercel ([`vercel.json`](./vercel.json)) or Netlify
  ([`netlify.toml`](./netlify.toml)). Both include the SPA rewrite. Set env vars:
  `VITE_API_BASE_URL=https://<your-api>/api` and `VITE_ENABLE_MOCK_DATA=false`.
- **Backend:** deploy `server/` to Render/Railway/Fly with the env vars from the table
  above. Set `CLIENT_URL` to your frontend's URL.

---

## 4. Production checklist

- [ ] Strong, unique `JWT_SECRET` (e.g. `openssl rand -hex 32`)
- [ ] `COOKIE_SECURE=true` and the site served over HTTPS
- [ ] `CLIENT_URL` exactly matches the frontend origin (scheme + host, no trailing slash)
- [ ] `VITE_ENABLE_MOCK_DATA=false` in the deployed frontend
- [ ] Atlas IP access list allows your API host
- [ ] Run `npm run seed` once (or create a real account via the Register screen)
- [ ] CI green — see [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)

---

## 5. Continuous integration

`.github/workflows/ci.yml` runs on every push/PR:
- **frontend** — installs deps and runs `npm run build`
- **backend** — installs deps and syntax-checks every source file

Extend it with real test suites as the project grows.

---

## 6. Troubleshooting

### "No open ports detected on 0.0.0.0" (Render / cloud)
The platform waits for your app to bind a port on `0.0.0.0`. If it never does, the
deploy fails with this message. Causes and fixes:

1. **The server crashed before listening.** Most often the MongoDB connection failed
   and the process exited. The server now **opens the port first, then connects to the
   database** (`server/src/index.js`), so the port stays open and the real error shows in
   the logs. Re-deploy and read the logs for the actual cause.
2. **`MONGODB_URI` missing or wrong.** Set it in the dashboard. Look for
   `✖ MongoDB connection failed: …` in the logs.
3. **Atlas is blocking the host.** In MongoDB Atlas → **Network Access**, allow
   `0.0.0.0/0` (or your host's outbound IPs). A wrong username/password shows as an
   authentication error in the logs.
4. **Don't hard-code or override `PORT`.** Render injects `PORT`; the app reads
   `process.env.PORT` and binds `0.0.0.0`. Remove any fixed `PORT` you set in the dashboard.
5. **Start command / root dir.** API service: **root directory** `server`, **start
   command** `node src/index.js` (already set in `render.yaml`).

### Cookies don't persist / "Please log in" after signing in across domains
When the frontend and API are on different domains, set `COOKIE_SECURE=true` (HTTPS),
serve both over HTTPS, and set `CLIENT_URL` to the exact frontend origin so CORS allows
credentials. The cookie is then sent as `SameSite=None; Secure`.

### CORS errors in the browser console
Set the API's `CLIENT_URL` to the frontend's exact origin (scheme + host, no trailing
slash). With the Docker setup this isn't needed — nginx proxies `/api`, so it's same-origin.

### "Usage: nodemon …" then "Application exited early"
Your service's **Start Command** is running `nodemon` (a dev-only tool) and/or pointing at
a file that doesn't exist (there is no `server.js` at the repo root — the entry is
`src/index.js`). In production:

- Set **Start Command** to `npm start` (which runs `node src/index.js`) or `node server.js`.
- Set **Root Directory** to `server`.
- Never use `nodemon` in production — with `NODE_ENV=production`, dev dependencies aren't
  installed, so `npx nodemon` can't run. `nodemon` is only for local dev (`npm run dev`).
