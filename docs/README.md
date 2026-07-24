# Documentation index

**Türkçe:** [README.tr.md](README.tr.md)

| Doc | Audience | Contents |
|-----|----------|----------|
| **[PRODUCTION.md](PRODUCTION.md)** · [TR](PRODUCTION.tr.md) | Server ops, mobile prod | Full production guide |
| **[URLS-AND-CONFIG.md](URLS-AND-CONFIG.md)** · [TR](URLS-AND-CONFIG.tr.md) | Everyone | URLs and env vars |
| [../deploy/README.md](../deploy/README.md) · [TR](../deploy/README.tr.md) | Server | Deploy scripts |
| [../deploy/nginx/README.md](../deploy/nginx/README.md) · [TR](../deploy/nginx/README.tr.md) | Server | Host nginx |
| [../mobile/README.md](../mobile/README.md) · [TR](../mobile/README.tr.md) | Mobile devs | Expo app |
| [../README.md](../README.md) · [TR](../README.tr.md) | Everyone | Project overview |
| [../backend/README.md](../backend/README.md) · [TR](../backend/README.tr.md) | Backend devs | Django API |
| [../frontend/README.md](../frontend/README.md) · [TR](../frontend/README.tr.md) | Frontend devs | React SPA |

## Production at a glance

| | URL |
|---|-----|
| Site | https://tinkolektif.org |
| API | https://api.tinkolektif.org/ |
| Django admin | https://admin.tinkolektif.org/admin/ |
| Mobile API env | `EXPO_PUBLIC_API_URL=https://api.tinkolektif.org` |

**Deploy:** `bash deploy/production.sh` on the server after `git pull`.

**Health check:** `bash deploy/check-site.sh`
