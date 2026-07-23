# Tin Kolektif Platform

Interactive web and mobile platform for Tin Kolektif: educations, announcements, user accounts, and join-us applications.

**Production:** https://tinkolektif.org · **API:** https://api.tinkolektif.org/ · **Config reference:** [docs/URLS-AND-CONFIG.md](docs/URLS-AND-CONFIG.md)

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

| Service | Local (Docker) | Production |
|---------|----------------|------------|
| App | http://localhost:8080 | https://tinkolektif.org |
| API | http://localhost:8000/ | https://api.tinkolektif.org/ |
| Django admin | http://localhost:8000/admin/ | https://admin.tinkolektif.org/admin/ |
| In-app admin | http://localhost:8080/admin | https://tinkolektif.org/admin |
| Mobile app | see [mobile/README.md](mobile/README.md) | API: https://api.tinkolektif.org |

Full URL and environment variable reference: **[docs/URLS-AND-CONFIG.md](docs/URLS-AND-CONFIG.md)**

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

- In-app **Admin** at http://localhost:8080/admin (production: https://tinkolektif.org/admin)
- Django admin at http://localhost:8000/admin/ (production: https://admin.tinkolektif.org/admin/)

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
| `make production` | **Server:** deploy tinkolektif.org (one command) |
| `make deploy-check` | **Server:** run health checks only |
| `make mobile` | Start the Expo mobile app (requires Node.js) |
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

## Mobile app

A React Native app lives in [`mobile/`](mobile/). It connects to the same API as the web frontend.

```bash
# Start the API first (Docker)
make build

# In another terminal
cd mobile
cp .env.example .env
npm install
npm start
```

See [mobile/README.md](mobile/README.md) for API URL setup (simulator vs physical device vs production) and store build notes.

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

Local Docker (`make build`):

```bash
FRONTEND_URL=http://localhost:8080
BACKEND_PUBLIC_URL=http://localhost:8000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

Production server (`.env` from `.env.production.example`):

```bash
FRONTEND_URL=https://tinkolektif.org
BACKEND_PUBLIC_URL=https://api.tinkolektif.org
```

See [docs/URLS-AND-CONFIG.md](docs/URLS-AND-CONFIG.md) for the full list.

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
- **Mobile:** Expo React Native ([mobile/](mobile/))
- **Database:** PostgreSQL
- **Runtime:** Docker Compose (local + production containers)
- **Production TLS/routing:** Host nginx ([deploy/nginx/](deploy/nginx/))

## Project structure

```text
backend/                  Django API
frontend/                 React SPA
mobile/                   Expo React Native app
docs/URLS-AND-CONFIG.md   URLs and env vars (local + production)
scripts/setup.sh          Automation for macOS/Linux/Git Bash
scripts/setup.ps1         Automation for Windows PowerShell
docker-compose.yml        Local development stack
docker-compose.prod.yml   Production containers (with host nginx)
deploy/                   Host nginx configs + production scripts
.env.example              Local env template
.env.production.example   Production env template
Makefile                  Short commands for daily use
```

More details:

- [docs/URLS-AND-CONFIG.md](docs/URLS-AND-CONFIG.md) — **URLs and environment variables**
- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)
- [mobile/README.md](mobile/README.md)
- [deploy/README.md](deploy/README.md)

## Production-like local run

```bash
make prod
```

Then open http://localhost:8080

This uses nginx for the frontend and the same Django/PostgreSQL services.

## Production server (tinkolektif.org)

Host nginx runs **outside Docker**. Containers use `docker-compose.prod.yml`.

| URL | Purpose |
|-----|---------|
| https://tinkolektif.org | Public site |
| https://api.tinkolektif.org/ | REST API (no `/api` prefix) |
| https://admin.tinkolektif.org/admin/ | Django admin |
| https://tinkolektif.org/admin | In-app staff admin |

**One command** on the server after each `git pull`:

```bash
cd ~/tin-collective && git pull && bash deploy/production.sh
```

First-time setup:

```bash
git clone https://github.com/red-sanofi/tin-collective.git
cd tin-collective
cp .env.production.example .env
# Edit .env — DJANGO_SECRET_KEY, POSTGRES_PASSWORD, OAuth keys
bash deploy/production.sh
```

If api or admin subdomains fail health checks:

```bash
bash deploy/fix-subdomains.sh
bash deploy/check-site.sh
```

Guides: [deploy/README.md](deploy/README.md) · [docs/URLS-AND-CONFIG.md](docs/URLS-AND-CONFIG.md)

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

### Production checks fail with `000` or api/admin unreachable

Docker and the main site may work while `https://api.tinkolektif.org` or `https://admin.tinkolektif.org` fail — usually nginx or TLS, not Django:

```bash
bash deploy/fix-subdomains.sh
bash deploy/check-site.sh
```

Backend still starting on first boot:

```bash
bash deploy/wait-for-backend.sh
bash deploy/check-site.sh
```

Or redeploy: `bash deploy/production.sh`

### `DisallowedHost` on server IP or domain

Use production values from `.env.production.example` or run `bash deploy/production.sh`. See [docs/URLS-AND-CONFIG.md](docs/URLS-AND-CONFIG.md).

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

## Cloud deployment

See [deploy/README.md](deploy/README.md). Summary:

```bash
git clone https://github.com/red-sanofi/tin-collective.git
cd tin-collective
cp .env.production.example .env   # edit secrets
bash deploy/production.sh
```

## Contributing

1. Clone the repo
2. Run `make build`
3. Make changes
4. Verify with `make logs` if something fails
5. Open a pull request
