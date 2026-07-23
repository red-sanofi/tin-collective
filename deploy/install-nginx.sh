#!/usr/bin/env sh
# Install host nginx configs for tinkolektif.org (nginx runs outside Docker).
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

NGINX_AVAILABLE="${NGINX_AVAILABLE:-/etc/nginx/sites-available}"
NGINX_ENABLED="${NGINX_ENABLED:-/etc/nginx/sites-enabled}"
NGINX_CONFD="${NGINX_CONFD:-/etc/nginx/conf.d}"
BACKUP_DIR="${BACKUP_DIR:-/etc/nginx/tin-collective-backup-$(date +%Y%m%d-%H%M%S)}"

echo "Installing Tin Kolektif host nginx configs..."
echo "Backup directory: $BACKUP_DIR"
sudo mkdir -p "$BACKUP_DIR" "$NGINX_AVAILABLE" "$NGINX_ENABLED" "$NGINX_CONFD"

for file in \
  "$NGINX_AVAILABLE/tinkolektif.org.conf" \
  "$NGINX_AVAILABLE/api.tinkolektif.org.conf" \
  "$NGINX_AVAILABLE/admin.tinkolektif.org.conf" \
  "$NGINX_CONFD/tin-collective-upstream.conf"
do
  if [ -f "$file" ]; then
    sudo cp "$file" "$BACKUP_DIR/"
  fi
done

sudo cp deploy/nginx/upstream.conf "$NGINX_CONFD/tin-collective-upstream.conf"
sudo cp deploy/nginx/tinkolektif.org.conf "$NGINX_AVAILABLE/"
sudo cp deploy/nginx/api.tinkolektif.org.conf "$NGINX_AVAILABLE/"
sudo cp deploy/nginx/admin.tinkolektif.org.conf "$NGINX_AVAILABLE/"

sudo ln -sf "$NGINX_AVAILABLE/tinkolektif.org.conf" "$NGINX_ENABLED/tinkolektif.org.conf"
sudo ln -sf "$NGINX_AVAILABLE/api.tinkolektif.org.conf" "$NGINX_ENABLED/api.tinkolektif.org.conf"
sudo ln -sf "$NGINX_AVAILABLE/admin.tinkolektif.org.conf" "$NGINX_ENABLED/admin.tinkolektif.org.conf"

echo "Testing nginx configuration..."
sudo nginx -t

echo "Reloading nginx..."
sudo systemctl reload nginx

echo "Done. Verify with:"
echo "  bash deploy/diagnose-admin.sh"
echo "  bash deploy/check-site.sh"
