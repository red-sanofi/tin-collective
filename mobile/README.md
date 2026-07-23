# Tin Kolektif Mobile

React Native mobile app for [Tin Kolektif](https://tinkolektif.org), built with **Expo** and **Expo Router**. Uses the same Django API as the web app.

**Full URL / env reference:** [docs/URLS-AND-CONFIG.md](../docs/URLS-AND-CONFIG.md)

## Features

- Home feed with upcoming workshops and announcements
- Browse and filter educations
- Read announcements
- Register / log in with JWT (SecureStore)
- Register for workshops, edit profile, view registrations
- Submit a “Join us” application
- Turkish / English (TR default)

## Prerequisites

| Tool | Install |
|------|---------|
| Node.js 20+ | https://nodejs.org |
| Expo Go or simulator | App store / Android Studio / Xcode |
| Running API | `make build` locally or production API |

## Setup

```bash
cd mobile
cp .env.example .env
rm -rf node_modules package-lock.json
npm install
npm start
```

### API URL (`EXPO_PUBLIC_API_URL`)

| Where you run the app | Set in `mobile/.env` |
|-----------------------|----------------------|
| iOS Simulator + local Docker API | `http://127.0.0.1:8000` |
| Android Emulator + local Docker API | `http://10.0.2.2:8000` |
| Physical phone (same Wi‑Fi as PC) | `http://YOUR_PC_LAN_IP:8000` |
| Production / TestFlight / Play Store | `https://api.tinkolektif.org` |

Start the API first when testing locally:

```bash
# repo root
make build
```

## Run

```bash
npm start
```

- Press `i` — iOS Simulator  
- Press `a` — Android Emulator  
- Scan QR — Expo Go on your phone  

From repo root: `make mobile`

### `Cannot find module 'expo/config-plugins'`

Usually a broken or partial install. From `mobile/`:

```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

If it persists, ensure Node.js 20+ and run `npm install` again (do not use `npm install --omit=dev` — `babel-preset-expo` is required).

### Expo warns about `@expo/vector-icons` version

Pull latest code, then reinstall so the lockfile pins `14.0.4`:

```bash
rm -rf node_modules package-lock.json
npm install
```

### `xcrun simctl` / exit code 72 (iOS Simulator)

Metro can still run — use **Expo Go** on your phone (scan the QR code) without a simulator.

To fix the iOS Simulator on macOS:

1. Install **Xcode** from the App Store (not only Command Line Tools).
2. Open Xcode once and finish setup / license.
3. Point the active developer directory:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
xcrun simctl list
```

If `simctl list` works, press `i` in the Expo terminal again.

## Production builds

```bash
npm install -g eas-cli
eas login
eas build:configure

# Required: production API baked into the build
EXPO_PUBLIC_API_URL=https://api.tinkolektif.org eas build --platform all
```

Live API: **https://api.tinkolektif.org/** (no `/api` prefix).

## Demo accounts

| Username | Password |
|----------|----------|
| `demo` | `demo12345` |
| `admin` | `admin12345` |

Staff admin remains on the web: https://tinkolektif.org/admin and https://admin.tinkolektif.org/admin/

## Project layout

```text
mobile/
  app/                 Expo Router screens
  src/api/client.js    API client (same paths as web)
  src/context/         Auth (SecureStore)
  src/i18n/            TR / EN
  assets/              App icon / splash
```
