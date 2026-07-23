# Production deployment — tinkolektif.org

Host **nginx** (TLS + routing) runs on the VM. **Docker Compose** runs the app.

## Domains

| URL | Service | Docker port |
|-----|---------|-------------|
| https://tinkolektif.org | React frontend | `127.0.0.1:8080` |
| https://api.tinkolektif.org | Django API (no `/api` prefix) | `127.0.0.1:8000` |
| https://admin.tinkolektif.org/admin/ | Django admin | `127.0.0.1:8000` |

## One command — fix everything

Run on the server after `git pull`:

```bash
cd ~/tin-collective && git pull && bash deploy/fix-production.sh
```

This updates `.env`, installs host nginx configs, rebuilds Docker, runs `collectstatic`, and health-checks the site.

## Step by step

### 1. Environment

```bash
cp .env.production.example .env
# edit secrets: DJANGO_SECRET_KEY, POSTGRES_PASSWORD, OAuth keys
```

### 2. Docker (production compose)

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### 3. Host nginx (outside Docker)

```bash
bash deploy/install-nginx.sh
```

Configs live in `deploy/nginx/`. See [deploy/nginx/README.md](nginx/README.md) for the admin static CSS fix.

### 4. Verify

```bash
bash deploy/check-site.sh
bash deploy/diagnose-admin.sh
```

## Scripts

| Script | Purpose |
|--------|---------|
| `deploy/fix-production.sh` | Full fix: env + nginx + docker + checks |
| `deploy/install-nginx.sh` | Install host nginx configs only |
| `deploy/check-site.sh` | Full health check |
| `deploy/diagnose-admin.sh` | Admin static file routing debug |

## OAuth redirect URIs

- `https://api.tinkolektif.org/auth/social/google/login/callback/`
- `https://api.tinkolektif.org/auth/social/github/login/callback/`

## Troubleshooting

### Admin page has no CSS (static returns 302)

```bash
bash deploy/diagnose-admin.sh
bash deploy/install-nginx.sh
```

Direct backend should return 200:

```bash
curl -I http://127.0.0.1:8000/static/admin/css/base.css
```

### 502 Bad Gateway

```bash
docker compose -f docker-compose.prod.yml ps
curl http://127.0.0.1:8000/
curl http://127.0.0.1:8080/
```

### Frontend empty / loading forever

Rebuild frontend with correct API URL:

```bash
grep VITE_API_URL .env   # must be https://api.tinkolektif.org
docker compose -f docker-compose.prod.yml up --build -d frontend
```
