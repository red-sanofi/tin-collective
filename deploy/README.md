# Production deployment — tinkolektif.org

**Türkçe:** [README.tr.md](README.tr.md)

Host **nginx** (TLS + routing) runs on the VM. **Docker Compose** runs the app.

**URL and env reference:** [docs/URLS-AND-CONFIG.md](../docs/URLS-AND-CONFIG.md)  
**Full production guide:** [docs/PRODUCTION.md](../docs/PRODUCTION.md)

## Public URLs

| URL | Service | Docker port |
|-----|---------|-------------|
| https://tinkolektif.org | React frontend + in-app `/admin` | `127.0.0.1:8080` |
| https://api.tinkolektif.org/ | Django API (**no `/api` prefix**) | `127.0.0.1:8000` |
| https://admin.tinkolektif.org/admin/ | Django admin | `127.0.0.1:8000` |

**DNS:** A records for `tinkolektif.org`, `www`, `api`, and `admin` → server IP.

**TLS:** Certificate at `/etc/letsencrypt/live/tinkolektif.org/` must include all hostnames. Use `bash deploy/fix-subdomains.sh` if api/admin return connection errors.

## One command

Run this on the server whenever you pull changes or need to fix the stack:

```bash
cd ~/tin-collective && git pull && bash deploy/production.sh
```

Equivalent:

```bash
make production
```

This single script:

1. Creates `.env` from `.env.production.example` if missing
2. Applies production domain settings (`tinkolektif.org`, `api.tinkolektif.org`, …)
3. Installs host nginx configs from `deploy/nginx/`
4. Builds and starts `docker-compose.prod.yml`
5. Waits for the backend to finish migrations and boot gunicorn
6. Runs `collectstatic`
7. Runs the full health check (`deploy/check-site.sh`)

If anything fails, read the output — backend logs are printed automatically when the wait step times out.

## Required production `.env`

Copy `.env.production.example` to `.env` and set secrets. `production.sh` ensures at least:

```bash
VITE_API_URL=https://api.tinkolektif.org
BACKEND_PUBLIC_URL=https://api.tinkolektif.org
FRONTEND_URL=https://tinkolektif.org
CORS_ALLOWED_ORIGINS=https://tinkolektif.org,https://www.tinkolektif.org
CSRF_TRUSTED_ORIGINS=https://admin.tinkolektif.org
```

## First-time server setup

```bash
git clone https://github.com/red-sanofi/tin-collective.git
cd tin-collective
cp .env.production.example .env
# Edit .env — set DJANGO_SECRET_KEY and POSTGRES_PASSWORD

# TLS (once): expand cert for all subdomains, then deploy
sudo certbot certonly --nginx --expand --cert-name tinkolektif.org \
  -d tinkolektif.org -d www.tinkolektif.org \
  -d api.tinkolektif.org -d admin.tinkolektif.org

bash deploy/production.sh
```

If nginx or api/admin HTTPS fails after deploy: `bash deploy/fix-subdomains.sh`

## Scripts

| Script | Purpose |
|--------|---------|
| **`deploy/production.sh`** | **Main one-command deploy (use this)** |
| `deploy/fix-production.sh` | Alias for `production.sh` |
| `deploy/check-site.sh` | Health check only |
| `deploy/wait-for-backend.sh` | Wait for gunicorn on `:8000` |
| `deploy/install-nginx.sh` | Install host nginx configs only |
| `deploy/fix-subdomains.sh` | **Fix api/admin `000` errors (nginx + TLS expand)** |
| `deploy/diagnose-public.sh` | DNS / nginx / SSL for api + admin subdomains |
| `deploy/diagnose-admin.sh` | Admin static file debug |

## Mobile app (production API)

The Expo app in `mobile/` calls `https://api.tinkolektif.org` when `EXPO_PUBLIC_API_URL` is set in `mobile/.env`. No server-side changes needed — native apps are not subject to CORS.

Developers run Expo locally; the API is production. See [docs/PRODUCTION.md](../docs/PRODUCTION.md#mobile-app-production).

## OAuth redirect URIs

- `https://api.tinkolektif.org/auth/social/google/login/callback/`
- `https://api.tinkolektif.org/auth/social/github/login/callback/`

## Troubleshooting

### Local Docker OK but api/admin show `000` (connection failed)

Docker and the main site work, but `https://api.tinkolektif.org` or `https://admin.tinkolektif.org` fail. This is almost always **host nginx or TLS**, not Django.

Run diagnostics on the server:

```bash
bash deploy/diagnose-public.sh
```

One-command fix:

```bash
bash deploy/fix-subdomains.sh
bash deploy/check-site.sh
```

That script installs api/admin nginx configs, expands the Let's Encrypt cert if needed, reloads nginx, and verifies HTTPS.

Ensure DNS **A records** exist for `api.tinkolektif.org` and `admin.tinkolektif.org` pointing to this server (same IP as `tinkolektif.org`).

### Checks fail with `000` right after deploy

The backend may still be starting. Wait and re-check:

```bash
bash deploy/wait-for-backend.sh
bash deploy/check-site.sh
```

Or run the full deploy again:

```bash
bash deploy/production.sh
```

### Admin page has no CSS

```bash
bash deploy/diagnose-admin.sh
bash deploy/install-nginx.sh
curl -I http://127.0.0.1:8000/static/admin/css/base.css
curl -I https://admin.tinkolektif.org/static/admin/css/base.css
```

Both should return `200`.

### Frontend loads but lists are empty

```bash
grep VITE_API_URL .env
docker compose -f docker-compose.prod.yml up --build -d frontend
bash deploy/check-site.sh
```

`VITE_API_URL` must be `https://api.tinkolektif.org`.

### 502 Bad Gateway

```bash
docker compose -f docker-compose.prod.yml ps
curl http://127.0.0.1:8000/
curl http://127.0.0.1:8080/
docker compose -f docker-compose.prod.yml logs backend --tail 50
```

See also [deploy/nginx/README.md](nginx/README.md).
