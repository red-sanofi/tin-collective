# Tin Kolektif Platform

Interactive web platform for Tin Kolektif: educations, announcements, user accounts, and join-us applications.

## One-command start

You only need **Git** and **Docker Desktop**.

### macOS / Linux / Git Bash on Windows

```bash
git clone https://github.com/red-sanofi/tin-collective.git
cd tin-collective
make build
```

### Windows PowerShell (if `make` is not installed)

```powershell
git clone https://github.com/red-sanofi/tin-collective.git
cd tin-collective
.\scripts\setup.ps1 build
```

That single command will:

1. Check that Docker is installed and running
2. Create `.env` from `.env.example` if needed
3. Build and start PostgreSQL, Django API, and React frontend

When containers are ready, open:

| Service | URL |
|---------|-----|
| App | http://localhost:8080 |
| API | http://localhost:8000/ |
| Django admin | http://localhost:8000/admin/ |
| Production site | https://tinkolektif.org |
| Production API | https://api.tinkolektif.org/ |
| Production admin | https://admin.tinkolektif.org/admin/ |

Stop the stack with:

```bash
make down
```

## Prerequisites

| Tool | Why you need it | Install |
|------|-----------------|---------|
| Docker Desktop | Runs the full stack in containers | https://docs.docker.com/get-docker/ |
| Git | Clone the repository | https://git-scm.com/downloads |
| Make (optional) | Short commands like `make build` | Included on macOS/Linux; on Windows use Git Bash or run `.\scripts\setup.ps1` |

No local Python or Node install is required when using Docker.

## Demo accounts

Seeded automatically on first backend startup:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin12345` |
| User | `demo` | `demo12345` |

Use the admin account to access:

- In-app **Admin** page at http://localhost:5173/admin
- Django admin at http://localhost:8000/admin/

## Common commands

| Command | What it does |
|---------|--------------|
| `make build` | First-time setup + build + run (recommended) |
| `make start` | Same as `make build` |
| `make up` | Start containers without rebuilding |
| `make down` | Stop containers |
| `make logs` | Follow logs from all services |
| `make ps` | Show container status |
| `make clean` | Stop containers and delete database volume |
| `make prod` | Run production-like stack on http://localhost:8080 |
| `make check` | Verify Docker is ready |
| `make help` | Show all commands |

Windows PowerShell equivalents:

```powershell
.\scripts\setup.ps1 build
.\scripts\setup.ps1 down
.\scripts\setup.ps1 logs
.\scripts\setup.ps1 prod
```

## What gets started

```text
docker compose up --build
```

| Service | Port | Description |
|---------|------|-------------|
| `frontend` | 8080 → 5173 | React SPA (Vite dev server) |
| `backend` | 8000 | Django REST API |
| `db` | internal | PostgreSQL database |

On first startup the backend will:

- Run database migrations
- Collect static files
- Seed demo users, educations, and announcements

## Features (v1)

- User registration, login, and profile management
- **Google & GitHub OAuth login** (optional, via env credentials)
- Public education listings with registration and cancellation
- Admin/staff creation of educations and announcements
- Announcements page
- Join Us application form
- Django admin at `/admin`
- Turkish by default with English available via the header language switcher

## Languages

- Default language: **Turkish (`tr`)** on every first visit
- Also available: **English (`en`)** via the header **TR / EN** toggle
- Your language choice is saved in the browser; until you switch, the site stays Turkish
- API error messages follow the selected language via the `Accept-Language` header

To add another language later:

1. Add a new JSON file under `frontend/src/i18n/locales/`
2. Register it in `frontend/src/i18n/index.js`
3. Add Django translations under `backend/locale/<lang>/LC_MESSAGES/django.po`
4. Run `python manage.py compilemessages`

## OAuth login (Google & GitHub)

Social login is optional. Without credentials, the app falls back to username/password only.

### 1. Copy env vars into `.env`

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
FRONTEND_URL=http://localhost:5173
BACKEND_PUBLIC_URL=http://localhost:8000
```

### 2. Google Cloud Console

1. Create an OAuth client (Web application)
2. **Authorized redirect URI:**
   `http://localhost:8000/auth/social/google/login/callback/`
   Production: `https://api.tinkolektif.org/auth/social/google/login/callback/`
3. Paste client ID/secret into `.env`

### 3. GitHub Developer Settings

1. New OAuth App
2. **Authorization callback URL:**
   `http://localhost:8000/auth/social/github/login/callback/`
   Production: `https://api.tinkolektif.org/auth/social/github/login/callback/`
3. Paste client ID/secret into `.env`

### 4. Restart backend

```bash
docker compose up --build -d backend
```

OAuth buttons appear on **Login** and **Register** when providers are configured.

Flow: provider → Django session → JWT issued → redirect to `/auth/callback` → profile.

## Stack

- **Backend:** Django + Django REST Framework + JWT auth
- **Frontend:** React SPA (Vite)
- **Database:** PostgreSQL
- **Runtime:** Docker Compose

## Project structure

```text
backend/                  Django API
frontend/                 React SPA
scripts/setup.sh          Automation for macOS/Linux/Git Bash
scripts/setup.ps1         Automation for Windows PowerShell
docker-compose.yml        Local development stack
docker-compose.prod.yml   Production stack for tinkolektif.org
deploy/                   Host nginx configs + production guide
.env.production.example   Production env template
Makefile                  Short commands for daily use
.env.example              Environment template copied to .env on first run
```

More details:

- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)

## Production-like local run

```bash
make prod
```

Then open http://localhost:8080

This uses nginx for the frontend and the same Django/PostgreSQL services.

## Troubleshooting

### `Docker is not running`

Start Docker Desktop and wait until it shows "Running", then run `make build` again.

### Port already in use

Another app is using port `5173`, `8000`, or `5432`. Stop that app or edit port mappings in `docker-compose.yml`.

### `make: command not found` on Windows

Use PowerShell instead:

```powershell
.\scripts\setup.ps1 build
```

Or run commands from **Git Bash**, which includes `make` in many installations.

### `DisallowedHost` on server IP or domain

Django blocks requests when the host is not listed in `DJANGO_ALLOWED_HOSTS`. On your server `.env`:

```bash
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend,tinkolektif.org,www.tinkolektif.org,api.tinkolektif.org,admin.tinkolektif.org
CORS_ALLOWED_ORIGINS=https://tinkolektif.org,https://www.tinkolektif.org
CSRF_TRUSTED_ORIGINS=https://admin.tinkolektif.org
FRONTEND_URL=https://tinkolektif.org
BACKEND_PUBLIC_URL=https://api.tinkolektif.org
SITE_DOMAIN=tinkolektif.org
API_SITE_DOMAIN=api.tinkolektif.org
VITE_API_URL=https://api.tinkolektif.org
```

See [deploy/README.md](deploy/README.md) for full production setup.

### Reset everything

```bash
make clean
make build
```

This removes containers and the PostgreSQL volume, then starts fresh with seeded demo data.

### `permission denied` on `./entrypoint.sh`

This can happen on Windows bind mounts. The backend container runs `entrypoint.sh` via `sh`, so pull the latest code and rebuild:

```bash
make down
make build
```

### Missing frontend packages (for example `react-i18next`)

This usually means the frontend `node_modules` volume is stale after a `git pull`. Pull latest code, recreate the frontend container, and start again:

```bash
git pull
docker compose up --build -d --force-recreate frontend
```

Or restart the whole stack:

```bash
make down
make build
```

## API overview

| Endpoint | Description |
|----------|-------------|
| `POST /auth/register/` | Create account |
| `POST /auth/login/` | JWT login |
| `GET /auth/me/` | Current user |
| `GET /educations/` | List educations |
| `POST /educations/{slug}/register/` | Register for education |
| `GET /announcements/` | List announcements |
| `POST /join/` | Submit join application |

Base URL locally: `http://localhost:8000/`  
Production: `https://api.tinkolektif.org/`

## Cloud deployment notes

- Use `docker-compose.prod.yml` on the production VM
- Copy `.env.production.example` to `.env` and set secrets
- Install host nginx configs from `deploy/nginx/` (see [deploy/README.md](deploy/README.md))
- Domains: `tinkolektif.org`, `api.tinkolektif.org`, `admin.tinkolektif.org`
- Set strong values for `DJANGO_SECRET_KEY`, database credentials, and `DJANGO_DEBUG=false`
- Rebuild frontend after changing `VITE_API_URL`

## Contributing

1. Clone the repo
2. Run `make build`
3. Make changes
4. Verify with `make logs` if something fails
5. Open a pull request
