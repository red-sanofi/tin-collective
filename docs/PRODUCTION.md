# Production guide — tinkolektif.org

Complete reference for the **live** Tin Kolektif stack: web, API, admin, mobile, and server operations.

Quick links: [URLs & env vars](URLS-AND-CONFIG.md) · [Deploy scripts](../deploy/README.md) · [Nginx configs](../deploy/nginx/README.md) · [Mobile app](../mobile/README.md)

## Live URLs

| Service | URL | What runs there |
|---------|-----|-----------------|
| **Website** | https://tinkolektif.org | React SPA (built with `VITE_API_URL=https://api.tinkolektif.org`) |
| **In-app admin** | https://tinkolektif.org/admin | Staff UI inside the SPA |
| **API** | https://api.tinkolektif.org/ | Django REST — paths at **root** (no `/api` prefix) |
| **Django admin** | https://admin.tinkolektif.org/admin/ | Django admin + static files |
| **Mobile app** | Expo Go or store build | Calls `https://api.tinkolektif.org` via `EXPO_PUBLIC_API_URL` |

## Architecture

```text
Internet
   │
   ├─ tinkolektif.org ──────────► host nginx ──► Docker frontend :8080
   ├─ api.tinkolektif.org ──────► host nginx ──► Docker backend  :8000
   └─ admin.tinkolektif.org ────► host nginx ──► Docker backend  :8000
                                        │
                                   PostgreSQL (Docker, internal)
```

- **Host nginx** (on the VM): TLS termination, routing, static admin CSS via `/static/` proxy.
- **Docker Compose** (`docker-compose.prod.yml`): `db`, `backend`, `frontend` only.
- **No `/api` prefix** on the API host — clients call `https://api.tinkolektif.org/educations/`, not `…/api/educations/`.

Config files: `deploy/nginx/tinkolektif.org.conf`, `api.tinkolektif.org.conf`, `admin.tinkolektif.org.conf`, `upstream.conf`.

## One-command deploy (server)

After every `git pull`:

```bash
cd ~/tin-collective
git pull
bash deploy/production.sh
```

Or: `make production`

This script:

1. Creates `.env` from `.env.production.example` if missing
2. Sets production domain variables in `.env`
3. Runs `deploy/install-nginx.sh` (host nginx configs)
4. Builds and starts `docker-compose.prod.yml`
5. Waits for gunicorn (`deploy/wait-for-backend.sh`)
6. Runs `collectstatic`
7. Runs full health check (`deploy/check-site.sh`)

## First-time server setup

### 1. DNS

Create **A records** (same server IP for all):

| Host | Example |
|------|---------|
| `tinkolektif.org` | `187.77.x.x` |
| `www.tinkolektif.org` | same |
| `api.tinkolektif.org` | same |
| `admin.tinkolektif.org` | same |

### 2. Clone and configure

```bash
git clone https://github.com/red-sanofi/tin-collective.git
cd tin-collective
cp .env.production.example .env
```

Edit `.env` — **required before going live**:

- `DJANGO_SECRET_KEY` — long random string
- `POSTGRES_PASSWORD` — strong password
- OAuth keys (optional): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

### 3. TLS certificate

Certificate path used by all nginx vhosts: `/etc/letsencrypt/live/tinkolektif.org/`

Must include SANs for **all four hostnames**:

```bash
sudo certbot certonly --nginx --expand --cert-name tinkolektif.org \
  -d tinkolektif.org -d www.tinkolektif.org \
  -d api.tinkolektif.org -d admin.tinkolektif.org
```

### 4. Deploy

```bash
bash deploy/production.sh
```

### 5. Verify

```bash
bash deploy/check-site.sh
```

All checks should pass, including public API and admin HTTPS.

## Production `.env`

Template: `.env.production.example`. `production.sh` enforces these values:

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

The frontend **must** be built with `VITE_API_URL=https://api.tinkolektif.org` (handled by `production.sh` + `docker-compose.prod.yml`). If lists are empty on the site, rebuild the frontend container after checking `.env`.

## OAuth (production)

Register these **redirect / callback URIs** in Google Cloud Console and GitHub OAuth app settings:

| Provider | Callback URL |
|----------|--------------|
| Google | `https://api.tinkolektif.org/auth/social/google/login/callback/` |
| GitHub | `https://api.tinkolektif.org/auth/social/github/login/callback/` |

In server `.env`:

```bash
FRONTEND_URL=https://tinkolektif.org
BACKEND_PUBLIC_URL=https://api.tinkolektif.org
```

## Site settings (default theme)

Staff can set the site-wide default theme (default: **Sanat Galerisi / gallery**) via:

- In-app admin: https://tinkolektif.org/admin
- API: `GET/PATCH https://api.tinkolektif.org/site/settings/`
- Django admin on `siteconfig`

## Mobile app (production)

The Expo app (`mobile/`) uses **SDK 54** (matches App Store Expo Go). It talks to the same API as the web app.

### Run on a phone against production (Expo Go)

```bash
cd mobile
cp .env.example .env
# set: EXPO_PUBLIC_API_URL=https://api.tinkolektif.org

rm -rf node_modules package-lock.json
npm install
npx expo start -c
```

Scan the QR code with Expo Go. No local Docker or backend required.

Requires **Node.js 20.19+**. See [mobile/README.md](../mobile/README.md) for install troubleshooting.

### Store builds

```bash
EXPO_PUBLIC_API_URL=https://api.tinkolektif.org eas build --platform all
```

Native apps are not subject to browser CORS — they only need HTTPS to `api.tinkolektif.org`.

## Deploy scripts reference

| Script | When to use |
|--------|-------------|
| **`deploy/production.sh`** | Full deploy after `git pull` |
| `deploy/check-site.sh` | Health check only |
| `deploy/fix-subdomains.sh` | api/admin return `000` or TLS errors |
| `deploy/diagnose-public.sh` | DNS, nginx, cert SAN debugging |
| `deploy/diagnose-admin.sh` | Admin CSS / static routing |
| `deploy/install-nginx.sh` | Reinstall host nginx configs |
| `deploy/wait-for-backend.sh` | Wait for gunicorn on `:8000` |

## Troubleshooting

### Main site OK, api or admin fails (`000` / connection error)

Almost always **nginx or TLS**, not Django:

```bash
bash deploy/diagnose-public.sh
bash deploy/fix-subdomains.sh
bash deploy/check-site.sh
```

Common causes: api/admin nginx configs not installed; Let's Encrypt cert missing subdomain SANs.

### Admin page has no CSS

```bash
bash deploy/diagnose-admin.sh
curl -I https://admin.tinkolektif.org/static/admin/css/base.css   # expect 200
```

Ensure `^~ /static/` is proxied **before** the catch-all in `admin.tinkolektif.org.conf`.

### Frontend loads but data lists are empty

```bash
grep VITE_API_URL .env   # must be https://api.tinkolektif.org
docker compose -f docker-compose.prod.yml up --build -d frontend
curl -sS https://api.tinkolektif.org/educations/ | head
bash deploy/check-site.sh
```

### Backend not ready after deploy

First boot can take ~2–3 minutes (migrations + seed):

```bash
bash deploy/wait-for-backend.sh
bash deploy/check-site.sh
```

### 502 Bad Gateway

```bash
docker compose -f docker-compose.prod.yml ps
curl http://127.0.0.1:8000/
curl http://127.0.0.1:8080/
docker compose -f docker-compose.prod.yml logs backend --tail 50
```

## What changed from early deployments

| Old | Current |
|-----|---------|
| API at `tinkolektif.org/api/…` | Dedicated host `api.tinkolektif.org/` (no prefix) |
| Single nginx vhost | Separate configs per subdomain |
| Frontend `VITE_API_URL=/api` | `VITE_API_URL=https://api.tinkolektif.org` |
| Admin static broken by redirect | `location = /` redirect only; `/static/` proxied first |

## Quick verification commands

```bash
# From anywhere
curl -sS https://tinkolektif.org/ | head
curl -sS https://api.tinkolektif.org/
curl -sS -o /dev/null -w "%{http_code}\n" https://admin.tinkolektif.org/admin/

# On the server
bash deploy/check-site.sh
docker compose -f docker-compose.prod.yml ps
```
