#!/usr/bin/env sh
# Fix public api.tinkolektif.org and admin.tinkolektif.org (nginx + TLS).
#
# Run on the server when Docker is healthy but api/admin return curl code 000.
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"
. "$ROOT_DIR/deploy/lib/curl-http.sh"

API_HOST="${API_HOST:-api.tinkolektif.org}"
ADMIN_HOST="${ADMIN_HOST:-admin.tinkolektif.org}"
CERT_NAME="${CERT_NAME:-tinkolektif.org}"
CERT_FILE="/etc/letsencrypt/live/${CERT_NAME}/fullchain.pem"

info() { printf '\033[1;34m[INFO]\033[0m %s\n' "$1"; }
ok() { printf '\033[1;32m[OK]\033[0m %s\n' "$1"; }
warn() { printf '\033[1;33m[WARN]\033[0m %s\n' "$1"; }
fail() { printf '\033[1;31m[ERROR]\033[0m %s\n' "$1" >&2; exit 1; }

info "Step 1/4 — install api + admin nginx site configs"
bash deploy/install-nginx.sh

info "Step 2/4 — check Let's Encrypt certificate SANs"
if [ ! -r "$CERT_FILE" ]; then
  fail "Certificate not found at $CERT_FILE — run certbot for tinkolektif.org first"
fi

missing=""
for host in "$API_HOST" "$ADMIN_HOST"; do
  if sudo openssl x509 -in "$CERT_FILE" -noout -text 2>/dev/null | grep -q "DNS:${host}"; then
    ok "certificate includes $host"
  else
    missing="${missing} ${host}"
    warn "certificate missing SAN: $host"
  fi
done

if [ -n "$missing" ]; then
  info "Step 3/4 — expand certificate to include subdomains"
  if ! command -v certbot >/dev/null 2>&1; then
    fail "certbot not installed — install certbot, then run:
  sudo certbot certonly --nginx --expand --cert-name ${CERT_NAME} \\
    -d tinkolektif.org -d www.tinkolektif.org \\
    -d ${API_HOST} -d ${ADMIN_HOST}"
  fi

  if sudo certbot certonly --nginx --expand --cert-name "$CERT_NAME" \
    --non-interactive \
    -d tinkolektif.org -d www.tinkolektif.org \
    -d "$API_HOST" -d "$ADMIN_HOST"; then
    ok "certificate expanded"
  else
    fail "certbot failed — run interactively:
  sudo certbot certonly --nginx --expand --cert-name ${CERT_NAME} \\
    -d tinkolektif.org -d www.tinkolektif.org \\
    -d ${API_HOST} -d ${ADMIN_HOST}"
  fi
else
  info "Step 3/4 — certificate already includes api + admin (skip certbot)"
fi

info "Step 4/4 — reload nginx and verify HTTPS"
sudo nginx -t
sudo systemctl reload nginx

api_code="$(http_code "https://${API_HOST}/")"
admin_code="$(http_code "https://${ADMIN_HOST}/admin/")"

if [ "$api_code" = "200" ]; then
  ok "https://${API_HOST}/ -> $api_code"
else
  warn "https://${API_HOST}/ -> $api_code (expected 200)"
  bash deploy/diagnose-public.sh
  exit 1
fi

if [ "$admin_code" = "200" ] || [ "$admin_code" = "302" ]; then
  ok "https://${ADMIN_HOST}/admin/ -> $admin_code"
else
  warn "https://${ADMIN_HOST}/admin/ -> $admin_code (expected 200/302)"
  bash deploy/diagnose-public.sh
  exit 1
fi

ok "Subdomains fixed. Run: bash deploy/check-site.sh"
