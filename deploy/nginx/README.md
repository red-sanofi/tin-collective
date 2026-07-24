# Host nginx configs (outside Docker)

**Türkçe:** [README.tr.md](README.tr.md)

**Production URLs:** [docs/URLS-AND-CONFIG.md](../docs/URLS-AND-CONFIG.md) · [docs/PRODUCTION.md](../docs/PRODUCTION.md)

Nginx on the VM terminates TLS and proxies to Docker:

| File | Domain | Proxies to |
|------|--------|------------|
| `tinkolektif.org.conf` | tinkolektif.org | `127.0.0.1:8080` (frontend container) |
| `api.tinkolektif.org.conf` | api.tinkolektif.org | `127.0.0.1:8000` (backend container) |
| `admin.tinkolektif.org.conf` | admin.tinkolektif.org | `127.0.0.1:8000` (backend container) |
| `upstream.conf` | shared upstream | `/etc/nginx/conf.d/tin-collective-upstream.conf` |

## Install

```bash
cd ~/tin-collective
git pull
bash deploy/install-nginx.sh
```

## Common admin CSS bug

**Wrong** — redirects `/static/` to admin login:

```nginx
location / {
    return 302 /admin/;
}
# or
location / {
    proxy_pass http://127.0.0.1:8000/admin/;
}
```

**Correct** — from `admin.tinkolektif.org.conf`:

```nginx
location = / {
    return 302 /admin/;
}

location ^~ /static/ {
    proxy_pass http://tin_backend/static/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location / {
    proxy_pass http://tin_backend;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## TLS certificate

All vhosts share `/etc/letsencrypt/live/tinkolektif.org/`. The certificate must include **SANs** for:

- `tinkolektif.org`, `www.tinkolektif.org`
- `api.tinkolektif.org`, `admin.tinkolektif.org`

If the cert was issued before the subdomains existed, HTTPS to api/admin fails (curl shows `000`).

```bash
sudo certbot certonly --nginx \
  -d tinkolektif.org -d www.tinkolektif.org \
  -d api.tinkolektif.org -d admin.tinkolektif.org
sudo systemctl reload nginx
```

## Verify

```bash
bash deploy/diagnose-public.sh
bash deploy/diagnose-admin.sh
bash deploy/check-site.sh
```

Both static checks should return `HTTP/1.1 200`.
