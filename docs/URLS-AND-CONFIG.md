# URLs and configuration reference

Single reference for **local development**, **production-like Docker**, **live production**, and the **mobile app**.

**Full production guide:** [PRODUCTION.md](PRODUCTION.md)

## Public URLs (production)

| Service | URL | Notes |
|---------|-----|--------|
| Website | https://tinkolektif.org | React SPA (nginx → Docker `:8080`) |
| API | https://api.tinkolektif.org/ | Django REST — **no `/api` prefix** |
| Django admin | https://admin.tinkolektif.org/admin/ | Staff backend admin |
| In-app admin | https://tinkolektif.org/admin | Staff UI inside the SPA |

**DNS:** A records for `tinkolektif.org`, `www.tinkolektif.org`, `api.tinkolektif.org`, and `admin.tinkolektif.org` must point to the server IP.

**TLS:** One Let's Encrypt certificate at `/etc/letsencrypt/live/tinkolektif.org/` must include all four hostnames. If api/admin fail with connection errors, run `bash deploy/fix-subdomains.sh` on the server.

## Local development (Docker — recommended)

Start with `make build` from the repo root. Uses `docker-compose.yml` and `.env` (copied from `.env.example` on first run).

| Service | Browser URL | Docker mapping |
|---------|-------------|----------------|
| App | http://localhost:8080 | `8080 → 5173` (Vite) |
| API | http://localhost:8000/ | `8000 → 8000` |
| Django admin | http://localhost:8000/admin/ | same backend |
| In-app admin | http://localhost:8080/admin | SPA route |

Demo accounts: `admin` / `admin12345`, `demo` / `demo12345`

### Local `.env` (from `.env.example`)

```bash
FRONTEND_URL=http://localhost:8080
BACKEND_PUBLIC_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080,http://localhost:5173,http://127.0.0.1:5173
```

Use `FRONTEND_URL=http://localhost:5173` only if you run the frontend with `npm run dev` **outside** Docker (port 5173 directly).

## Production-like local Docker

`make prod` uses `docker-compose.prod.yml` — same port layout as the server (`8080` frontend, `8000` backend) but on localhost. Frontend is built with production API URL unless overridden in `.env`.

| Service | URL |
|---------|-----|
| App | http://localhost:8080 |
| API (container) | http://localhost:8000/ |

For a full server deploy, use `.env.production.example` and `bash deploy/production.sh` — see [deploy/README.md](../deploy/README.md).

## Production server `.env`

Copy `.env.production.example` → `.env` on the server. `deploy/production.sh` also enforces these values:

```bash
DJANGO_DEBUG=false
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend,tinkolektif.org,www.tinkolektif.org,api.tinkolektif.org,admin.tinkolektif.org
CORS_ALLOWED_ORIGINS=https://tinkolektif.org,https://www.tinkolektif.org
CSRF_TRUSTED_ORIGINS=https://admin.tinkolektif.org
FRONTEND_URL=https://tinkolektif.org
BACKEND_PUBLIC_URL=https://api.tinkolektif.org
SITE_DOMAIN=tinkolektif.org
API_SITE_DOMAIN=api.tinkolektif.org
VITE_API_URL=https://api.tinkolektif.org
```

Replace `DJANGO_SECRET_KEY` and `POSTGRES_PASSWORD` before going live.

## Mobile app (`mobile/`)

Expo **SDK 54** (matches App Store Expo Go). Requires Node.js **20.19+**.

| Environment | `EXPO_PUBLIC_API_URL` in `mobile/.env` |
|-------------|----------------------------------------|
| **Production (Expo Go or store)** | `https://api.tinkolektif.org` |
| iOS Simulator + local Docker | `http://127.0.0.1:8000` |
| Android Emulator + local Docker | `http://10.0.2.2:8000` |
| Physical phone + local Docker (same Wi‑Fi) | `http://YOUR_PC_LAN_IP:8000` |

Production quick start:

```bash
cd mobile
echo 'EXPO_PUBLIC_API_URL=https://api.tinkolektif.org' > .env
npm install
npx expo start -c
```

See [mobile/README.md](../mobile/README.md) and [PRODUCTION.md](PRODUCTION.md#mobile-app-production).

## Deploy scripts (server)

| Script | Purpose |
|--------|---------|
| `deploy/production.sh` | Full deploy after `git pull` |
| `deploy/check-site.sh` | Health check (local Docker + public HTTPS) |
| `deploy/fix-subdomains.sh` | Fix api/admin TLS or nginx |
| `deploy/diagnose-public.sh` | DNS / nginx / cert debugging |
| `deploy/diagnose-admin.sh` | Admin static CSS debugging |
| `deploy/install-nginx.sh` | Install host nginx configs only |

## Which file to edit

| Environment | Google / GitHub callback |
|-------------|--------------------------|
| Local | `http://localhost:8000/auth/social/{google\|github}/login/callback/` |
| Production | `https://api.tinkolektif.org/auth/social/{google\|github}/login/callback/` |

Also set `FRONTEND_URL` to match where users open the app (local: `http://localhost:8080`, production: `https://tinkolektif.org`).

## API paths (no prefix)

All clients call the API at the **root** of the API host:

```text
GET  /
POST /auth/register/
POST /auth/login/
GET  /auth/me/
GET  /educations/
GET  /educations/{slug}/
POST /educations/{slug}/register/
GET  /announcements/
POST /join/
GET  /site/settings/
GET  /social/feed/
```

There is **no** `/api` prefix on production or in current frontend/mobile clients.

## Which file to edit

| Goal | File |
|------|------|
| Local Docker env | `.env` (from `.env.example`) |
| Production server env | `.env` (from `.env.production.example`) |
| Mobile API target | `mobile/.env` (`EXPO_PUBLIC_API_URL`) |
| Host nginx / TLS | `deploy/nginx/*.conf`, `bash deploy/install-nginx.sh` |
| One-command server deploy | `bash deploy/production.sh` |
| Health check | `bash deploy/check-site.sh` |
| Full production guide | [docs/PRODUCTION.md](PRODUCTION.md) |

## OAuth redirect URIs
