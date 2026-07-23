#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE="${COMPOSE:-docker compose}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"
PROD_COMPOSE_FILE="${PROD_COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-.env}"
ENV_EXAMPLE="${ENV_EXAMPLE:-.env.example}"

info() {
  printf '\033[1;34m[INFO]\033[0m %s\n' "$1"
}

success() {
  printf '\033[1;32m[OK]\033[0m %s\n' "$1"
}

warn() {
  printf '\033[1;33m[WARN]\033[0m %s\n' "$1"
}

error() {
  printf '\033[1;31m[ERROR]\033[0m %s\n' "$1" >&2
}

require_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    error "Docker is not installed."
    echo "Install Docker Desktop: https://docs.docker.com/get-docker/"
    exit 1
  fi

  if ! docker info >/dev/null 2>&1; then
    error "Docker is installed but not running."
    echo "Start Docker Desktop, then run this command again."
    exit 1
  fi

  if ! docker compose version >/dev/null 2>&1; then
    error "Docker Compose v2 is required (the 'docker compose' plugin)."
    exit 1
  fi
}

ensure_env() {
  if [ ! -f "$ENV_FILE" ]; then
    if [ ! -f "$ENV_EXAMPLE" ]; then
      error "Missing $ENV_EXAMPLE"
      exit 1
    fi
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    success "Created $ENV_FILE from $ENV_EXAMPLE"
  else
    info "Using existing $ENV_FILE"
  fi
}

print_urls() {
  echo ""
  success "Tin Kolektif is starting."
  echo ""
  echo "  App:          http://localhost:8080"
  echo "  API:          http://localhost:8000/"
  echo "  Django admin: http://localhost:8000/admin/"
  echo ""
  echo "Demo accounts:"
  echo "  admin / admin12345"
  echo "  demo  / demo12345"
  echo ""
  echo "Stop with: make down"
  echo "Logs with: make logs"
  echo ""
}

print_prod_urls() {
  echo ""
  success "Production-like stack is starting."
  echo ""
  echo "  App: http://localhost:8080"
  echo "  API: https://api.tinkolektif.org (production) or http://localhost:8000 (local backend)"
  echo ""
}

cmd_setup() {
  require_docker
  ensure_env
  success "Environment is ready."
}

cmd_check() {
  require_docker
  success "Docker is installed and running."
}

cmd_build() {
  require_docker
  ensure_env
  print_urls
  exec $COMPOSE -f "$COMPOSE_FILE" up --build
}

cmd_up() {
  require_docker
  ensure_env
  print_urls
  exec $COMPOSE -f "$COMPOSE_FILE" up
}

cmd_down() {
  require_docker
  $COMPOSE -f "$COMPOSE_FILE" down
  success "Development stack stopped."
}

cmd_logs() {
  require_docker
  exec $COMPOSE -f "$COMPOSE_FILE" logs -f
}

cmd_clean() {
  require_docker
  $COMPOSE -f "$COMPOSE_FILE" down -v --remove-orphans
  success "Development stack stopped and volumes removed."
}

cmd_prod() {
  require_docker
  ensure_env
  print_prod_urls
  exec $COMPOSE -f "$PROD_COMPOSE_FILE" up --build
}

usage() {
  cat <<'EOF'
Usage: ./scripts/setup.sh <command>

Commands:
  setup   Create .env and verify Docker
  check   Verify Docker is available
  build   Setup + docker compose up --build
  up      docker compose up
  down    docker compose down
  logs    docker compose logs -f
  clean   docker compose down -v
  prod    docker compose -f docker-compose.prod.yml up --build
EOF
}

COMMAND="${1:-build}"

case "$COMMAND" in
  setup) cmd_setup ;;
  check) cmd_check ;;
  build) cmd_build ;;
  up) cmd_up ;;
  down) cmd_down ;;
  logs) cmd_logs ;;
  clean) cmd_clean ;;
  prod) cmd_prod ;;
  *)
    usage
    exit 1
    ;;
esac
