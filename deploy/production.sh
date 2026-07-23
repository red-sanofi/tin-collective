#!/usr/bin/env sh
# One-command production deploy for tinkolektif.org (host nginx + Docker).
#
# Usage (on the server):
#   cd ~/tin-collective && git pull && bash deploy/production.sh
#
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ENV_FILE:-.env}"
ENV_PRODUCTION_EXAMPLE="${ENV_PRODUCTION_EXAMPLE:-.env.production.example}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

info() { printf '\033[1;34m[INFO]\033[0m %s\n' "$1"; }
warn() { printf '\033[1;33m[WARN]\033[0m %s\n' "$1"; }
ok() { printf '\033[1;32m[OK]\033[0m %s\n' "$1"; }
fail() { printf '\033[1;31m[ERROR]\033[0m %s\n' "$1" >&2; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "$1 is required but not installed."
}

set_env() {
  key="$1"
  value="$2"
  if grep -q "^${key}=" "$ENV_FILE" 2>/dev/null; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
  else
    printf '%s=%s\n' "$key" "$value" >> "$ENV_FILE"
  fi
}

info "Tin Kolektif production deploy"
info "Repository: $ROOT_DIR"

require_cmd docker
require_cmd curl
require_cmd bash
docker compose version >/dev/null 2>&1 || fail "Docker Compose v2 is required."

if [ ! -f "$ENV_FILE" ]; then
  if [ ! -f "$ENV_PRODUCTION_EXAMPLE" ]; then
    fail "Missing $ENV_FILE and $ENV_PRODUCTION_EXAMPLE"
  fi
  cp "$ENV_PRODUCTION_EXAMPLE" "$ENV_FILE"
  ok "Created $ENV_FILE from $ENV_PRODUCTION_EXAMPLE"
  warn "Edit $ENV_FILE and set DJANGO_SECRET_KEY and POSTGRES_PASSWORD before going live."
else
  ok "Using existing $ENV_FILE"
fi

info "Applying production domain settings..."
set_env DJANGO_DEBUG false
set_env VITE_API_URL https://api.tinkolektif.org
set_env BACKEND_PUBLIC_URL https://api.tinkolektif.org
set_env FRONTEND_URL https://tinkolektif.org
set_env SITE_DOMAIN tinkolektif.org
set_env API_SITE_DOMAIN api.tinkolektif.org
set_env CORS_ALLOWED_ORIGINS https://tinkolektif.org,https://www.tinkolektif.org
set_env CSRF_TRUSTED_ORIGINS https://admin.tinkolektif.org
set_env DJANGO_ALLOWED_HOSTS localhost,127.0.0.1,backend,tinkolektif.org,www.tinkolektif.org,api.tinkolektif.org,admin.tinkolektif.org

if grep -q '^DJANGO_SECRET_KEY=change-me-long-random-secret' "$ENV_FILE" 2>/dev/null \
  || grep -q '^DJANGO_SECRET_KEY=dev-secret-key-change-me' "$ENV_FILE" 2>/dev/null; then
  warn "DJANGO_SECRET_KEY is still a placeholder — change it in $ENV_FILE"
fi
if grep -q '^POSTGRES_PASSWORD=change-me-strong-password' "$ENV_FILE" 2>/dev/null \
  || grep -q '^POSTGRES_PASSWORD=tin_collective' "$ENV_FILE" 2>/dev/null; then
  warn "POSTGRES_PASSWORD is weak or still default — change it in $ENV_FILE"
fi

info "Installing host nginx configs..."
bash deploy/install-nginx.sh

info "Building and starting Docker stack ($COMPOSE_FILE)..."
docker compose -f "$COMPOSE_FILE" up --build -d

info "Waiting for Django backend (migrations + gunicorn)..."
bash deploy/wait-for-backend.sh

info "Collecting Django static files..."
docker compose -f "$COMPOSE_FILE" exec -T backend python manage.py collectstatic --noinput

info "Running health checks..."
SKIP_BACKEND_WAIT=1 bash deploy/check-site.sh

ok "Production deploy finished."
echo ""
echo "  Site:   https://tinkolektif.org"
echo "  API:    https://api.tinkolektif.org/"
echo "  Admin:  https://admin.tinkolektif.org/admin/"
echo ""
echo "Re-run checks anytime:"
echo "  bash deploy/check-site.sh"
