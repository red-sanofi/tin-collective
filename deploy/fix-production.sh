#!/usr/bin/env sh
# Apply recommended production fixes on the server, then re-run health checks.
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"
ENV_FILE="${ENV_FILE:-.env}"

touch "$ENV_FILE"

set_env() {
  key="$1"
  value="$2"
  if grep -q "^${key}=" "$ENV_FILE" 2>/dev/null; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
  else
    printf '%s=%s\n' "$key" "$value" >> "$ENV_FILE"
  fi
}

echo "Updating $ENV_FILE..."
set_env DJANGO_DEBUG false
set_env VITE_API_URL https://api.tinkolektif.org
set_env BACKEND_PUBLIC_URL https://api.tinkolektif.org
set_env FRONTEND_URL https://tinkolektif.org
set_env SITE_DOMAIN tinkolektif.org
set_env API_SITE_DOMAIN api.tinkolektif.org
set_env CORS_ALLOWED_ORIGINS https://tinkolektif.org,https://www.tinkolektif.org
set_env CSRF_TRUSTED_ORIGINS https://admin.tinkolektif.org
set_env DJANGO_ALLOWED_HOSTS localhost,127.0.0.1,backend,tinkolektif.org,www.tinkolektif.org,api.tinkolektif.org,admin.tinkolektif.org

echo "Installing host nginx configs..."
bash deploy/install-nginx.sh

echo "Recreating production containers..."
docker compose -f docker-compose.prod.yml up --build -d

echo "Waiting for backend to finish startup..."
bash deploy/wait-for-backend.sh

echo "Ensuring Django static files are collected..."
docker compose -f docker-compose.prod.yml exec -T backend python manage.py collectstatic --noinput

echo "Running admin diagnostics..."
bash deploy/diagnose-admin.sh

echo "Running full health check..."
bash deploy/check-site.sh
