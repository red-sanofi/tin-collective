# Backend (Django API)

REST API for Tin Kolektif: authentication, educations, announcements, join applications, social feed, and site settings.

**URLs and env vars:** [docs/URLS-AND-CONFIG.md](../docs/URLS-AND-CONFIG.md)

## Run with Docker (recommended)

From the repository root:

```bash
make build
```

| URL | Purpose |
|-----|---------|
| http://localhost:8000/ | API root (JSON) |
| http://localhost:8000/admin/ | Django admin |

Production API: **https://api.tinkolektif.org/**  
Production Django admin: **https://admin.tinkolektif.org/admin/**

## Run locally without Docker (advanced)

Requirements: Python 3.12+, PostgreSQL 16+

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

export POSTGRES_HOST=localhost
export POSTGRES_DB=tin_collective
export POSTGRES_USER=tin_collective
export POSTGRES_PASSWORD=tin_collective
export DJANGO_SECRET_KEY=dev-secret-key
export DJANGO_DEBUG=true
export FRONTEND_URL=http://localhost:8080
export BACKEND_PUBLIC_URL=http://localhost:8000

python manage.py migrate
python manage.py seed_demo
python manage.py runserver 0.0.0.0:8000
```

## Useful commands

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py seed_demo
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

## Apps

| App | Purpose |
|-----|---------|
| `users` | Custom user model, JWT auth, OAuth, profile |
| `educations` | Workshops/courses and registrations |
| `announcements` | Community news and open calls |
| `joinus` | Join-us application submissions |
| `social` | Member social post feed |
| `siteconfig` | Site-wide settings (default theme) |

## Admin

| Interface | Local | Production |
|-----------|-------|------------|
| Django admin | http://localhost:8000/admin/ | https://admin.tinkolektif.org/admin/ |
| In-app admin (SPA) | http://localhost:8080/admin | https://tinkolektif.org/admin |

Default seeded admin: `admin` / `admin12345`

## API routes

Base URL: `http://localhost:8000/` locally, `https://api.tinkolektif.org/` in production. **No `/api` prefix.**

| Method | Path | Access |
|--------|------|--------|
| GET | `/` | Public (API info) |
| POST | `/auth/register/` | Public |
| POST | `/auth/login/` | Public |
| POST | `/auth/refresh/` | Public (with refresh token) |
| GET | `/auth/oauth/providers/` | Public |
| GET | `/auth/social/{provider}/login/` | Public (starts OAuth) |
| GET | `/auth/oauth/callback/` | OAuth JWT handoff |
| GET/PATCH | `/auth/me/` | Authenticated |
| GET/POST | `/educations/` | Read public, write staff |
| GET | `/educations/{slug}/` | Public |
| POST/DELETE | `/educations/{slug}/register/` | Authenticated |
| GET | `/educations/mine/` | Authenticated |
| GET/POST | `/announcements/` | Read public, write staff |
| GET | `/announcements/{slug}/` | Public |
| POST | `/join/` | Public |
| GET/PATCH | `/site/settings/` | Read public, write staff |
| GET | `/social/feed/` | Public |
| GET/POST/DELETE | `/social/...` | Authenticated (member posts) |

## Production OAuth callbacks

- Google: `https://api.tinkolektif.org/auth/social/google/login/callback/`
- GitHub: `https://api.tinkolektif.org/auth/social/github/login/callback/`

Set `FRONTEND_URL=https://tinkolektif.org` and OAuth client credentials in server `.env`.
