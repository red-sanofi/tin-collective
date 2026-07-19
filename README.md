# Tin Kolektif Platform

Interactive web platform for Tin Kolektif: educations, announcements, user accounts, and join-us applications.

## Stack

- **Backend:** Django + Django REST Framework + JWT auth
- **Frontend:** React SPA (Vite)
- **Database:** PostgreSQL
- **Runtime:** Docker Compose (local dev and production profile)

## Features (v1)

- User registration, login, and profile management
- Public education listings with registration and cancellation
- Admin/staff creation of educations and announcements
- Announcements page
- Join Us application form
- Django admin at `/admin`

## Quick start (local development)

1. Copy environment file:

```bash
cp .env.example .env
```

2. Start the stack:

```bash
docker compose up --build
```

3. Open the app:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Django admin: http://localhost:8000/admin/

## Demo accounts

Seeded on first backend startup:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin12345` |
| User | `demo` | `demo12345` |

Staff users can access the in-app **Admin** page to create educations and announcements.

## Production-like Docker run

```bash
docker compose -f docker-compose.prod.yml up --build
```

Then open http://localhost:8080

## API overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register/` | Create account |
| `POST /api/auth/login/` | JWT login |
| `GET /api/auth/me/` | Current user |
| `GET /api/educations/` | List educations |
| `POST /api/educations/{slug}/register/` | Register for education |
| `GET /api/announcements/` | List announcements |
| `POST /api/join/` | Submit join application |

## Cloud deployment notes

- Use `docker-compose.prod.yml` as a base for cloud VMs or container services
- Set strong values for `DJANGO_SECRET_KEY`, database credentials, and `DJANGO_DEBUG=false`
- Put TLS termination in front of the frontend/nginx service
- Point `CORS_ALLOWED_ORIGINS` and `DJANGO_ALLOWED_HOSTS` to your domain

## Project structure

```
backend/     Django API
frontend/    React SPA
docker-compose.yml          Local development
docker-compose.prod.yml     Production-style stack
```
