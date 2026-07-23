# Tin Kolektif Mobile

React Native mobile app for [Tin Kolektif](https://tinkolektif.org), built with **Expo** and **Expo Router**. It uses the same Django API as the web app.

## Features

- Home feed with upcoming workshops and announcements
- Browse and filter educations
- Read announcements
- Register / log in with JWT (stored in SecureStore)
- Register for workshops
- Edit profile and view your registrations
- Submit a “Join us” application
- Turkish / English (TR default)

## Prerequisites

| Tool | Install |
|------|---------|
| Node.js 20+ | https://nodejs.org |
| Expo Go (phone) or Android/iOS simulator | App store / Android Studio / Xcode |

The Django API must be running (local Docker stack or production).

## Setup

```bash
cd mobile
cp .env.example .env
npm install
```

Set the API URL in `.env`:

```env
# Local Docker backend
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000

# Production
# EXPO_PUBLIC_API_URL=https://api.tinkolektif.org
```

### API URL notes

| Where you run the app | API URL |
|-----------------------|---------|
| iOS Simulator | `http://127.0.0.1:8000` |
| Android Emulator | `http://10.0.2.2:8000` |
| Physical phone (same Wi‑Fi) | `http://YOUR_PC_IP:8000` |
| Production build | `https://api.tinkolektif.org` |

## Run

```bash
npm start
```

Then:

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan the QR code with **Expo Go** on your phone

From the repo root:

```bash
make mobile
```

## Project layout

```
mobile/
  app/                 Expo Router screens
  src/
    api/client.js      API client (mirrors web frontend)
    context/           Auth state
    i18n/              TR / EN strings
    components/        Shared UI
  assets/              App icon / splash (from brand logo)
```

## Building for stores (optional)

For App Store / Play Store builds, use [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npm install -g eas-cli
eas login
eas build:configure
EXPO_PUBLIC_API_URL=https://api.tinkolektif.org eas build --platform all
```

Set `EXPO_PUBLIC_API_URL` to the production API before building.

## Demo accounts

Same as the web app (seeded in Docker):

| Username | Password |
|----------|----------|
| `demo` | `demo12345` |
| `admin` | `admin12345` |

Admin management stays on the web; the mobile app focuses on member features.
