#!/usr/bin/env sh
# Diagnose public subdomain routing (api + admin) from the server.
set -u

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"
. "$ROOT_DIR/deploy/lib/curl-http.sh"

API_HOST="${API_HOST:-api.tinkolektif.org}"
ADMIN_HOST="${ADMIN_HOST:-admin.tinkolektif.org}"
MAIN_HOST="${MAIN_HOST:-tinkolektif.org}"

show() {
  label="$1"
  url="$2"
  shift 2
  code="$(http_code_with_headers "$url" 12 "$@")"
  echo ""
  echo ">>> $label"
  echo "    URL:  $url"
  echo "    HTTP: $code"
}

echo "Public subdomain diagnostics"
echo "=========================="

for host in "$MAIN_HOST" "$API_HOST" "$ADMIN_HOST"; do
  ip="$(resolve_host "$host")"
  echo "$host -> ${ip:-lookup failed}"
done

echo ""
echo "Enabled nginx sites:"
if [ -d /etc/nginx/sites-enabled ]; then
  ls -1 /etc/nginx/sites-enabled 2>/dev/null || true
else
  echo "  /etc/nginx/sites-enabled not found"
fi

echo ""
echo "Nginx server_name entries:"
if command -v nginx >/dev/null 2>&1; then
  sudo nginx -T 2>/dev/null | grep -E 'server_name|ssl_certificate ' | grep -E 'tinkolektif|api\.|admin\.' || true
else
  echo "  nginx command not found"
fi

show "Main site (public)" "https://${MAIN_HOST}/"
show "API (public)" "https://${API_HOST}/"
show "Admin (public)" "https://${ADMIN_HOST}/admin/"
show "API via local nginx (--resolve)" "https://${API_HOST}/" \
  --resolve "${API_HOST}:443:127.0.0.1" -k
show "Admin via local nginx (--resolve)" "https://${ADMIN_HOST}/admin/" \
  --resolve "${ADMIN_HOST}:443:127.0.0.1" -k
show "Backend direct" "http://127.0.0.1:8000/"

echo ""
echo "TLS certificate (api host):"
if command -v openssl >/dev/null 2>&1; then
  cert_text="$(echo | openssl s_client -connect "${API_HOST}:443" -servername "$API_HOST" 2>/dev/null \
    | openssl x509 -noout -subject -ext subjectAltName 2>/dev/null || true)"
  if [ -n "$cert_text" ]; then
    printf '%s\n' "$cert_text"
    if printf '%s' "$cert_text" | grep -q "$API_HOST"; then
      echo "  OK: certificate includes $API_HOST"
    else
      echo "  PROBLEM: certificate does NOT include $API_HOST"
      echo "  Expand cert: sudo certbot certonly --nginx -d tinkolektif.org -d www.tinkolektif.org -d api.tinkolektif.org -d admin.tinkolektif.org"
    fi
  else
    echo "  Could not read certificate (connection or openssl failed)"
  fi
else
  echo "  openssl not installed"
fi

echo ""
echo "How to read results:"
echo "  - backend direct = 200 but public API = 000  -> DNS or firewall on subdomains"
echo "  - --resolve = 200 but public = 000           -> DNS records missing/wrong"
echo "  - --resolve = 000                            -> nginx site config not installed"
echo "  - public = 000 and --resolve fails with SSL  -> expand Let's Encrypt cert"
echo ""
echo "Fix commands:"
echo "  bash deploy/install-nginx.sh"
echo "  sudo certbot certonly --nginx -d tinkolektif.org -d www.tinkolektif.org -d api.tinkolektif.org -d admin.tinkolektif.org"
echo "  bash deploy/check-site.sh"
