# Host nginx configs (outside Docker)

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

## Verify

```bash
bash deploy/diagnose-admin.sh
bash deploy/check-site.sh
```

Both static checks should return `HTTP/1.1 200`.
