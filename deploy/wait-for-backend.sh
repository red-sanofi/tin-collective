#!/usr/bin/env sh
# Wait until the Django backend accepts HTTP on port 8000.
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
LOCAL_API="${LOCAL_API:-http://127.0.0.1:8000}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-90}"
SLEEP_SECONDS="${SLEEP_SECONDS:-2}"

attempt=0
printf 'Waiting for backend at %s' "$LOCAL_API"

while [ "$attempt" -lt "$MAX_ATTEMPTS" ]; do
  code="$(curl -sS -o /dev/null -w "%{http_code}" --max-time 5 "$LOCAL_API/" 2>/dev/null || echo "000")"
  if [ "$code" = "200" ]; then
    printf '\nBackend is ready (%s) after %s seconds.\n' "$code" "$((attempt * SLEEP_SECONDS))")
    exit 0
  fi
  attempt=$((attempt + 1))
  printf '.'
  sleep "$SLEEP_SECONDS"
done

printf '\nBackend did not become ready after %s seconds (last code: %s).\n' \
  "$((MAX_ATTEMPTS * SLEEP_SECONDS))" "$code"
echo "Recent backend logs:"
docker compose -f "$COMPOSE_FILE" logs backend --tail 40 || true
exit 1
