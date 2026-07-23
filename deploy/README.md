# Production deployment — tinkolektif.org

This stack runs behind **host nginx** (TLS termination) and **Docker Compose** on the VM.

## Domains

| URL | Service | Docker port |
|-----|---------|-------------|
| https://tinkolektif.org | React frontend | `127.0.0.1:8080` |
| https://api.tinkolektif.org | Django API (no `/api` prefix) | `127.0.0.1:8000` |
| https://admin.tinkolektif.org/admin/ | Django admin + static files | `127.0.0.1:8000` |

API examples:

- `GET https://api.tinkolektif.org/`
- `POST https://api.tinkolektif.org/auth/login/`
- `GET https://api.tinkolektif.org/educations/`

## Server setup

### 1. Clone and configure env

```bash
git clone https://github.com/red-sanofi/tin-collective.git
cd tin-collective
cp .env.production.example .env
# Edit .env — set DJANGO_SECRET_KEY, POSTGRES_PASSWORD, OAuth keys
```

### 2. Start Docker stack

Use the production compose file so the frontend is built with `VITE_API_URL=https://api.tinkolektif.org`:

```bash
docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml ps
curl -s http://127.0.0.1:8000/
curl -s http://127.0.0.1:8080/ | head
```

Backend must listen on `8000` and frontend on `8080` for host nginx.

### 3. Install host nginx configs

```bash
sudo cp deploy/nginx/*.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/tinkolektif.org.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api.tinkolektif.org.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/admin.tinkolektif.org.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Obtain TLS certificates first (Certbot) if not already present. Paths in the nginx files assume `/etc/letsencrypt/live/tinkolektif.org/`.

### 4. OAuth redirect URIs

Register these in Google/GitHub:

- `https://api.tinkolektif.org/auth/social/google/login/callback/`
- `https://api.tinkolektif.org/auth/social/github/login/callback/`

### 5. Verify

```bash
curl -s https://api.tinkolektif.org/
curl -s https://api.tinkolektif.org/educations/ | head
curl -I https://admin.tinkolektif.org/admin/
curl -I https://admin.tinkolektif.org/static/admin/css/base.css
```

## Updating

```bash
git pull
docker compose -f docker-compose.prod.yml up --build -d
```

Static files are collected automatically on backend startup (`collectstatic` in `entrypoint.sh`) and served by WhiteNoise at `/static/`.

## Troubleshooting

### 502 Bad Gateway

Host nginx cannot reach Docker ports. Check containers:

```bash
docker compose -f docker-compose.prod.yml ps
curl http://127.0.0.1:8000/
```

Ensure `docker-compose.prod.yml` publishes `8000:8000` on the backend service.

### DisallowedHost

Add all domains to `DJANGO_ALLOWED_HOSTS` in `.env` and recreate the backend container.

### Admin without CSS

Ensure `admin.tinkolektif.org` nginx proxies `/static/` to the backend and backend has run `collectstatic`.

### Frontend still calling `/api/...`

Rebuild the frontend after changing `VITE_API_URL`:

```bash
docker compose -f docker-compose.prod.yml up --build -d frontend
```
