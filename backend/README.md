# Backend (Django API)

REST API for Tin Kolektif: authentication, educations, announcements, and join applications.

## Run with Docker (recommended)

From the repository root:

```bash
make build
```

The backend starts automatically as part of the Docker stack on http://localhost:8000.

## Run locally without Docker (advanced)

Requirements:

- Python 3.12+
- PostgreSQL 16+

Steps:

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

python manage.py migrate
python manage.py seed_demo
python manage.py runserver 0.0.0.0:8000
```

API base URL: http://localhost:8000/  
Production: https://api.tinkolektif.org/

## Useful commands

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py seed_demo
python manage.py createsuperuser
```

## Apps

| App | Purpose |
|-----|---------|
| `users` | Custom user model, JWT auth, profile |
| `educations` | Workshops/courses and registrations |
| `announcements` | Community news and open calls |
| `joinus` | Join-us application submissions |

## Admin

Django admin is available at `/admin` (production: https://admin.tinkolektif.org/admin/).

Default seeded admin:

- Username: `admin`
- Password: `admin12345`

## API routes

| Method | Path | Access |
|--------|------|--------|
| POST | `/auth/register/` | Public |
| POST | `/auth/login/` | Public |
| GET | `/auth/oauth/providers/` | Public |
| GET | `/auth/social/{provider}/login/` | Public (starts OAuth) |
| GET | `/auth/oauth/callback/` | OAuth JWT handoff |
| GET | `/auth/me/` | Authenticated |
| GET/POST | `/educations/` | Read public, write staff |
| POST/DELETE | `/educations/{slug}/register/` | Authenticated |
| GET/POST | `/announcements/` | Read public, write staff |
| POST | `/join/` | Public |
