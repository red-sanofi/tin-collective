#!/usr/bin/env sh
# Tin Kolektif production health check — run on the server.
set -u

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"
. "$ROOT_DIR/deploy/lib/curl-http.sh"

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
FRONTEND_URL="${FRONTEND_URL:-https://tinkolektif.org}"
API_URL="${API_URL:-https://api.tinkolektif.org}"
ADMIN_URL="${ADMIN_URL:-https://admin.tinkolektif.org}"
LOCAL_API="${LOCAL_API:-http://127.0.0.1:8000}"
LOCAL_FRONTEND="${LOCAL_FRONTEND:-http://127.0.0.1:8080}"
API_HOST="${API_HOST:-api.tinkolektif.org}"
ADMIN_HOST="${ADMIN_HOST:-admin.tinkolektif.org}"

PASS=0
WARN=0
FAIL=0

green() { printf '\033[32m%s\033[0m\n' "$1"; }
yellow() { printf '\033[33m%s\033[0m\n' "$1"; }
red() { printf '\033[31m%s\033[0m\n' "$1"; }
section() { printf '\n=== %s ===\n' "$1"; }

pass() { PASS=$((PASS + 1)); green "PASS  $1"; }
warn() { WARN=$((WARN + 1)); yellow "WARN  $1"; }
fail() { FAIL=$((FAIL + 1)); red "FAIL  $1"; }

explain_code() {
  code="$1"
  case "$code" in
    000) printf ' (connection failed — DNS, SSL cert, or nginx site missing)' ;;
    502) printf ' (nginx cannot reach backend on 127.0.0.1:8000)' ;;
    503) printf ' (service unavailable)' ;;
  esac
}

check_cmd() {
  if command -v "$1" >/dev/null 2>&1; then
    pass "$1 is installed"
  else
    fail "$1 is missing"
  fi
}

section "Environment"
check_cmd docker
check_cmd curl
if [ -f .env ]; then
  pass ".env exists"
  for key in DJANGO_SECRET_KEY POSTGRES_PASSWORD VITE_API_URL BACKEND_PUBLIC_URL FRONTEND_URL; do
    if grep -q "^${key}=" .env 2>/dev/null; then
      pass ".env has ${key}"
    else
      warn ".env missing ${key}"
    fi
  done
  if grep -q "^DJANGO_DEBUG=true" .env 2>/dev/null; then
    warn "DJANGO_DEBUG=true (should be false in production)"
  else
    pass "DJANGO_DEBUG is not true"
  fi
  if grep -q "^VITE_API_URL=https://api.tinkolektif.org" .env 2>/dev/null; then
    pass "VITE_API_URL points to api.tinkolektif.org"
  else
    warn "VITE_API_URL is not https://api.tinkolektif.org — frontend may call the wrong API"
  fi
else
  fail ".env missing — copy .env.production.example to .env"
fi

section "Docker ($COMPOSE_FILE)"
if docker compose -f "$COMPOSE_FILE" ps >/dev/null 2>&1; then
  docker compose -f "$COMPOSE_FILE" ps
  for service in db backend frontend; do
    if docker compose -f "$COMPOSE_FILE" ps --status running --services 2>/dev/null | grep -qx "$service"; then
      pass "container running: $service"
    else
      fail "container not running: $service"
    fi
  done
else
  fail "docker compose -f $COMPOSE_FILE ps failed"
fi

if [ "${SKIP_BACKEND_WAIT:-}" != "1" ]; then
  section "Backend readiness"
  if bash deploy/wait-for-backend.sh; then
    pass "backend responded on $LOCAL_API"
  else
    fail "backend not ready — see logs above; checks below may fail"
  fi
fi

section "Local Docker ports"
check_local() {
  name="$1"
  url="$2"
  expect="$3"
  code="$(http_code "$url")"
  if [ "$code" = "$expect" ]; then
    pass "local $name -> $url ($code)"
  else
    fail "local $name -> $url (expected $expect, got $code)$(explain_code "$code")"
  fi
}

check_local backend "$LOCAL_API/" 200
check_local "backend educations" "$LOCAL_API/educations/" 200
check_local frontend "$LOCAL_FRONTEND/" 200

section "DNS + nginx"
for host in tinkolektif.org "$API_HOST" "$ADMIN_HOST"; do
  ip="$(resolve_host "$host")"
  if [ -n "$ip" ] && [ "$ip" != "unknown" ]; then
    pass "DNS $host -> $ip"
  else
    fail "DNS lookup failed for $host"
  fi
done

if [ -L "/etc/nginx/sites-enabled/api.tinkolektif.org.conf" ] || [ -f "/etc/nginx/sites-enabled/api.tinkolektif.org.conf" ]; then
  pass "nginx api site enabled"
else
  fail "nginx api site missing — run: bash deploy/install-nginx.sh"
fi

if [ -L "/etc/nginx/sites-enabled/admin.tinkolektif.org.conf" ] || [ -f "/etc/nginx/sites-enabled/admin.tinkolektif.org.conf" ]; then
  pass "nginx admin site enabled"
else
  fail "nginx admin site missing — run: bash deploy/install-nginx.sh"
fi

api_local_code="$(http_code_with_headers "https://${API_HOST}/" 12 --resolve "${API_HOST}:443:127.0.0.1" -k)"
if [ "$api_local_code" = "200" ]; then
  pass "nginx routes api locally ($api_local_code)"
else
  fail "nginx api local route (expected 200, got $api_local_code) — run: bash deploy/install-nginx.sh"
fi

admin_local_code="$(http_code_with_headers "https://${ADMIN_HOST}/admin/" 12 --resolve "${ADMIN_HOST}:443:127.0.0.1" -k)"
if [ "$admin_local_code" = "200" ] || [ "$admin_local_code" = "302" ]; then
  pass "nginx routes admin locally ($admin_local_code)"
else
  fail "nginx admin local route (expected 200/302, got $admin_local_code)"
fi

public_https_hint() {
  url="$1"
  local_route_code="$2"
  code="$(http_code "$url")"
  if [ "$code" != "000" ]; then
    return
  fi
  insecure="$(http_code_with_headers "$url" 12 -k)"
  if [ "$insecure" = "200" ] || [ "$insecure" = "302" ]; then
    printf ' — TLS cert likely missing subdomain SAN; run: bash deploy/fix-subdomains.sh'
    return
  fi
  if [ "$local_route_code" = "200" ] || [ "$local_route_code" = "302" ]; then
    printf ' — local nginx OK but public HTTPS fails; run: bash deploy/fix-subdomains.sh'
    return
  fi
  printf ' — run: bash deploy/fix-subdomains.sh'
}

section "Public API ($API_URL)"
code="$(http_code "${API_URL}/")"
if [ "$code" = "200" ]; then
  pass "API root $API_URL/ ($code)"
else
  fail "API root $API_URL/ (expected 200, got $code)$(explain_code "$code")$(public_https_hint "${API_URL}/" "$api_local_code")"
fi

if body_contains "${API_URL}/" "Tin Kolektif API"; then
  pass "API root JSON looks correct"
else
  fail "API root JSON missing expected content"
fi

code="$(http_code "${API_URL}/educations/")"
if [ "$code" = "200" ]; then
  pass "API educations ($code)"
else
  fail "API educations (expected 200, got $code)"
fi

code="$(http_code "${API_URL}/announcements/")"
if [ "$code" = "200" ]; then
  pass "API announcements ($code)"
else
  fail "API announcements (expected 200, got $code)"
fi

code="$(http_code_with_headers "${API_URL}/educations/" 12 -H "Origin: ${FRONTEND_URL}")"
cors="$(header_value "${API_URL}/educations/" "access-control-allow-origin" 12 -H "Origin: ${FRONTEND_URL}")"
if [ "$code" = "200" ]; then
  pass "API educations with browser Origin ($code)"
else
  fail "API educations with Origin (expected 200, got $code)"
fi
if [ -n "$cors" ]; then
  pass "CORS header present: $cors"
else
  warn "CORS header missing — frontend may fail to load data"
fi

code="$(http_code "${FRONTEND_URL}/api/educations/")"
if [ "$code" = "404" ]; then
  pass "old path $FRONTEND_URL/api/... is not used ($code)"
elif [ "$code" = "502" ]; then
  warn "old /api path returns 502 — remove any /api proxy from tinkolektif.org nginx"
else
  warn "old /api path still responds ($code) — frontend should use $API_URL"
fi

section "Public frontend ($FRONTEND_URL)"
code="$(http_code "${FRONTEND_URL}/")"
if [ "$code" = "200" ]; then
  pass "frontend home ($code)"
else
  fail "frontend home (expected 200, got $code)"
fi

html="$(curl -sS --max-time 12 "${FRONTEND_URL}/" 2>/dev/null || true)"
if printf '%s' "$html" | grep -q 'assets/index-'; then
  pass "frontend serves built JS bundle"
  asset="$(printf '%s' "$html" | sed -n 's|.*src="\(/assets/index-[^"]*\.js\)".*|\1|p' | head -n 1)"
  if [ -n "$asset" ]; then
    js="$(curl -sS --max-time 12 "${FRONTEND_URL}${asset}" 2>/dev/null || true)"
    if printf '%s' "$js" | grep -q 'api.tinkolektif.org'; then
      pass "frontend bundle calls api.tinkolektif.org"
    elif printf '%s' "$js" | grep -q 'localhost:8000'; then
      fail "frontend bundle still calls localhost:8000 — rebuild with docker-compose.prod.yml"
    elif printf '%s' "$js" | grep -q '"/api"'; then
      fail "frontend bundle still uses /api prefix — rebuild frontend"
    else
      warn "could not detect API URL in frontend bundle"
    fi
  fi
else
  warn "frontend may still be dev mode (no assets/index-*.js)"
fi

section "Admin + static ($ADMIN_URL)"
code="$(http_code "${ADMIN_URL}/admin/")"
if [ "$code" = "200" ] || [ "$code" = "302" ]; then
  pass "admin login page ($code)"
else
  fail "admin login page (expected 200/302, got $code)$(public_https_hint "${ADMIN_URL}/admin/" "$admin_local_code")"
fi

code="$(http_code "${ADMIN_URL}/static/admin/css/base.css")"
static_location="$(header_value "${ADMIN_URL}/static/admin/css/base.css" "location")"
api_static_code="$(http_code "${API_URL}/static/admin/css/base.css")"
if [ "$code" = "200" ]; then
  pass "admin static CSS ($code)"
elif [ "$api_static_code" = "200" ]; then
  warn "admin subdomain static returned $code (Location: ${static_location:-none}) but api static works — update admin nginx config"
else
  fail "admin static CSS (expected 200, got $code, Location: ${static_location:-none}) — check nginx /static/ proxy and collectstatic"
fi

section "Summary"
echo "Passed: $PASS  Warnings: $WARN  Failed: $FAIL"
if [ "$FAIL" -gt 0 ]; then
  red "Some checks failed."
  echo "  bash deploy/fix-subdomains.sh    # nginx + TLS for api/admin"
  echo "  bash deploy/diagnose-public.sh   # DNS / nginx / SSL details"
  echo "  bash deploy/production.sh"
  exit 1
fi
if [ "$WARN" -gt 0 ]; then
  yellow "Checks passed with warnings."
  exit 0
fi
green "All checks passed."
