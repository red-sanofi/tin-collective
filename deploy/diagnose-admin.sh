#!/usr/bin/env sh
# Diagnose admin.tinkolektif.org static file routing.
set -u

ADMIN_URL="${ADMIN_URL:-https://admin.tinkolektif.org}"
API_URL="${API_URL:-https://api.tinkolektif.org}"
LOCAL_API="${LOCAL_API:-http://127.0.0.1:8000}"
STATIC_PATH="/static/admin/css/base.css"

show() {
  url="$1"
  echo ""
  echo ">>> $url"
  curl -sSI --max-time 12 "$url" 2>/dev/null | tr -d '\r' | awk 'NR<=12'
}

echo "Admin static diagnostics"
echo "========================"

show "$LOCAL_API$STATIC_PATH"
show "$API_URL$STATIC_PATH"
show "$ADMIN_URL$STATIC_PATH"
show "$ADMIN_URL/admin/"

echo ""
echo "Active nginx admin config:"
grep -R "server_name admin.tinkolektif.org" -A 35 /etc/nginx/sites-enabled/ 2>/dev/null || true

echo ""
echo "Expected:"
echo "  - direct backend static -> HTTP/1.1 200"
echo "  - admin static -> HTTP/1.1 200 (NOT 302 to /admin/)"
echo ""
echo "If admin static is 302 but direct backend is 200, run:"
echo "  bash deploy/install-nginx.sh"
