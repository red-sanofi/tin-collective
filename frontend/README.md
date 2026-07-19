# Frontend (React SPA)

React single-page application for Tin Kolektif, built with Vite.

## Run with Docker (recommended)

From the repository root:

```bash
make build
```

The frontend starts automatically on http://localhost:5173.

## Run locally without Docker (advanced)

Requirements:

- Node.js 20+
- Backend API running on http://localhost:8000

Steps:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

The Vite dev server proxies `/api` requests to the backend.

## Scripts

```bash
npm run dev      # Start dev server
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
- Language switcher in the header saves your choice in `localStorage`
- Date and time formatting follows the active language
- API requests send `Accept-Language` so backend validation messages match the UI

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | API base path used by the browser |
| `VITE_API_PROXY_TARGET` | `http://backend:8000` | Dev proxy target inside Docker |
