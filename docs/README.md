# Documentation index

| Doc | Audience | Contents |
|-----|----------|----------|
| **[PRODUCTION.md](PRODUCTION.md)** | Server ops, mobile prod | Full production guide: deploy, DNS, TLS, troubleshooting |
| **[URLS-AND-CONFIG.md](URLS-AND-CONFIG.md)** | Everyone | All URLs and environment variables (local + prod) |
| [../deploy/README.md](../deploy/README.md) | Server | Deploy scripts and nginx install |
| [../deploy/nginx/README.md](../deploy/nginx/README.md) | Server | Host nginx vhost details |
| [../mobile/README.md](../mobile/README.md) | Mobile devs | Expo SDK 54, Expo Go, store builds |
| [../README.md](../README.md) | Everyone | Project overview and local Docker setup |
| [../backend/README.md](../backend/README.md) | Backend devs | Django API routes |
| [../frontend/README.md](../frontend/README.md) | Frontend devs | React SPA and Vite |

## Production at a glance

| | URL |
|---|-----|
| Site | https://tinkolektif.org |
| API | https://api.tinkolektif.org/ |
| Django admin | https://admin.tinkolektif.org/admin/ |
| Mobile API env | `EXPO_PUBLIC_API_URL=https://api.tinkolektif.org` |

**Deploy:** `bash deploy/production.sh` on the server after `git pull`.

**Health check:** `bash deploy/check-site.sh`
