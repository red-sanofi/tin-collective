# Frontend (React SPA)

**Türkçe:** [README.tr.md](README.tr.md)

React single-page application for [Tin Kolektif](https://tinkolektif.org), built with Vite.

**URLs and env vars:** [docs/URLS-AND-CONFIG.md](../docs/URLS-AND-CONFIG.md) · **Production:** [docs/PRODUCTION.md](../docs/PRODUCTION.md)

## Run with Docker (recommended)

From the repository root:

```bash
make build
```

| URL | Purpose |
|-----|---------|
| http://localhost:8080 | App (port mapped to Vite inside the container) |
| http://localhost:8080/admin | In-app staff admin |
| http://localhost:8000/ | API (called directly by the browser) |

## Run locally without Docker (advanced)

Requirements:

- Node.js 20+
- Backend API on http://localhost:8000

```bash
cd frontend
npm install
cp ../.env.example ../.env   # if needed
npm run dev
```

Open http://localhost:5173 and set in `.env`:

```bash
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:8000
```

The Vite dev server can proxy API paths (`/auth`, `/educations`, `/announcements`, `/join`, `/social`, `/site`) to the backend when `VITE_API_PROXY_TARGET` is set (Docker sets this automatically).

## Production

The live site is **https://tinkolektif.org**. The built bundle calls **https://api.tinkolektif.org** (no `/api` prefix). Set at build time:

```bash
VITE_API_URL=https://api.tinkolektif.org
```

`docker-compose.prod.yml` and `deploy/production.sh` apply this on the server.

## Scripts

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/educations` | Education listings |
| `/educations/:slug` | Education detail + registration |
| `/announcements` | Announcements |
| `/join-us` | Join application form |
| `/login`, `/register` | Authentication |
| `/profile` | User profile and registrations |
| `/admin` | Staff-only content creation |

## Internationalization

- Default language: Turkish (`tr`)
- Also available: English (`en`)
- Language switcher saves choice in `localStorage`
- API requests send `Accept-Language` for localized errors

## Environment

| Variable | Local (Docker) | Production |
|----------|----------------|------------|
| `VITE_API_URL` | `http://localhost:8000` | `https://api.tinkolektif.org` |
| `VITE_API_PROXY_TARGET` | `http://backend:8000` (inside Compose) | N/A (nginx serves static build) |
