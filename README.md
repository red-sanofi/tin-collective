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
| App | http://localhost:5173 |
| API | http://localhost:8000/api/ |
| Django admin | http://localhost:8000/admin/ |

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
| `frontend` | 5173 | React SPA (Vite dev server) |
| `backend` | 8000 | Django REST API |
| `db` | 5432 | PostgreSQL database |

On first startup the backend will:

- Run database migrations
- Collect static files
- Seed demo users, educations, and announcements

## Features (v1)

- User registration, login, and profile management
- Public education listings with registration and cancellation
- Admin/staff creation of educations and announcements
- Announcements page
- Join Us application form
- Django admin at `/admin`

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
docker-compose.prod.yml   Production-like stack
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

### Reset everything

```bash
make clean
make build
```

This removes containers and the PostgreSQL volume, then starts fresh with seeded demo data.

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

## Contributing

1. Clone the repo
2. Run `make build`
3. Make changes
4. Verify with `make logs` if something fails
5. Open a pull request
