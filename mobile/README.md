# Tin Kolektif Mobile

React Native app for [Tin Kolektif](https://tinkolektif.org) — **Expo SDK 54**, **Expo Router**, same Django API as the web app.

| Doc | Contents |
|-----|----------|
| [docs/PRODUCTION.md](../docs/PRODUCTION.md) | **Run against production**, server context |
| [docs/URLS-AND-CONFIG.md](../docs/URLS-AND-CONFIG.md) | All URLs and env vars |

## Run against production (recommended for testing live data)

No local Docker required. Uses **Expo Go** from the App Store (SDK 54).

```bash
cd mobile
git pull

echo 'EXPO_PUBLIC_API_URL=https://api.tinkolektif.org' > .env

rm -rf node_modules package-lock.json
npm install

npx expo start -c
```

Scan the QR code with Expo Go on your phone.

Verify the API is up first:

```bash
curl -sS https://api.tinkolektif.org/ | head
```

Register or log in with a **production account** (demo users exist only if seeded on the server).

## Run against local Docker

```bash
# Terminal 1 — repo root
make build

# Terminal 2
cd mobile
cp .env.example .env
# Edit .env:
#   Simulator:  EXPO_PUBLIC_API_URL=http://127.0.0.1:8000
#   Phone:      EXPO_PUBLIC_API_URL=http://YOUR_MAC_LAN_IP:8000

npm install
npx expo start -c
```

## Features

- Home feed with upcoming workshops and announcements
- Browse and filter educations
- Read announcements
- Register / log in with JWT (SecureStore)
- Register for workshops, edit profile, view registrations
- Submit a “Join us” application
- Turkish / English (TR default)

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | **20.19+** |
| Expo Go | App Store (SDK 54) |
| npm | 10+ (uses `mobile/.npmrc` for peer deps) |

## Setup (clean install)

```bash
cd mobile
cp .env.example .env
rm -rf node_modules package-lock.json
npm install
```

Do **not** use `npm install --omit=dev` — `babel-preset-expo` is required.

### API URL (`EXPO_PUBLIC_API_URL`)

| Target | Value |
|--------|-------|
| **Production** | `https://api.tinkolektif.org` |
| iOS Simulator + local API | `http://127.0.0.1:8000` |
| Android Emulator + local API | `http://10.0.2.2:8000` |
| Physical phone + local API | `http://YOUR_PC_LAN_IP:8000` |

Restart Metro after changing `.env`: `npx expo start -c`

## Run

```bash
npm start
# or
npx expo start -c
```

- Scan QR — **Expo Go** on phone (production or local API)
- Press `i` — iOS Simulator (requires Xcode)
- Press `a` — Android Emulator

From repo root: `make mobile`

## Store builds (production API baked in)

```bash
npm install -g eas-cli
eas login
eas build:configure

EXPO_PUBLIC_API_URL=https://api.tinkolektif.org eas build --platform all
```

## Troubleshooting

### `npm error ERESOLVE` (react vs react-dom)

```bash
git pull   # includes mobile/.npmrc
rm -rf node_modules package-lock.json
npm install
```

### Expo Go SDK mismatch

Project uses **SDK 54**. Pull latest, clean install, restart:

```bash
git pull && rm -rf node_modules package-lock.json && npm install
npx expo start -c
```

### `TypeError: fetch failed`

- **Production:** check `curl https://api.tinkolektif.org/`
- **Local phone:** do not use `127.0.0.1` — use your Mac's LAN IP
- Restart after `.env` change: `npx expo start -c`

### `Cannot find module 'expo/config-plugins'`

```bash
rm -rf node_modules package-lock.json && npm install
```

### `xcrun simctl` exit code 72

Use **Expo Go on your phone** (QR scan) instead of the simulator. To fix simulator: install Xcode, run `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`.

## Staff admin

Mobile app is for members. Staff content management stays on the web:

- https://tinkolektif.org/admin
- https://admin.tinkolektif.org/admin/

## Project layout

```text
mobile/
  app/                 Expo Router screens
  src/api/client.js    API client (no /api prefix)
  src/context/         Auth (SecureStore)
  src/i18n/            TR / EN
  assets/              App icon / splash
  .npmrc               npm peer dependency config
```
