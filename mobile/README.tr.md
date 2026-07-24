# Mobil uygulama — Türkçe

Tin Kolektif’in **telefon uygulaması**. Web sitesiyle **aynı hesap** ve **aynı veri**; Expo Go ile test edilir.

İngilizce: [README.md](README.md) · Canlı ortam: [../docs/PRODUCTION.tr.md](../docs/PRODUCTION.tr.md)

## Kullanıcı ne yapar?

- Atölye ve duyuruları görür  
- Hesap açar / giriş yapar  
- Atölyeye kayıt olur  
- Profilini düzenler  
- “Bize katıl” formu gönderir  
- Türkçe veya İngilizce kullanır  

Yönetim (içerik ekleme) **web** üzerinden: https://tinkolektif.org/admin

## Canlı site verisiyle test (en kolay yol)

Bilgisayarda Docker **gerekmez**. Telefonda App Store’daki **Expo Go** (SDK 54) yeterli.

```bash
cd mobile
git pull

echo 'EXPO_PUBLIC_API_URL=https://api.tinkolektif.org' > .env

rm -rf node_modules package-lock.json
npm install

npx expo start -c
```

Terminaldeki **QR kodu** Expo Go ile tarayın.

Önce API’nin ayakta olduğunu kontrol edin: tarayıcıda https://api.tinkolektif.org/ açılmalı.

**Canlı hesap** gerekir (yerel `demo` hesabı sadece test sunucusunda varsa çalışır).

## Bilgisayarda yerel test

1. Bir terminal: proje kökünde `make build` (API çalışsın)  
2. `mobile/.env` içinde bilgisayar IP’niz veya `http://127.0.0.1:8000`  
3. `npm install` → `npx expo start -c`  

Telefondan yerel API’ye bağlanırken **127.0.0.1 kullanmayın** — telefon kendini işaret eder; bilgisayarın Wi‑Fi IP’sini yazın.

## Gereksinimler

| Araç | Sürüm |
|------|--------|
| Node.js | 20.19 veya üzeri |
| Expo Go | App Store / Play Store (SDK 54) |

## Sık sorunlar

| Mesaj | Ne yapmalı? |
|-------|-------------|
| SDK 52 / 54 uyuşmuyor | `git pull`, `npm install`, `npx expo start -c` |
| `npm ERESOLVE` | `rm -rf node_modules package-lock.json` → `npm install` |
| `fetch failed` | Canlı: API erişilebilir mi? Yerel: `.env` IP doğru mu? |
| Simülatör hatası | Expo Go ile QR kullanın; Xcode şart değil |

## Mağaza sürümü (ileride)

App Store / Play Store için build alırken API adresi build’e gömülür:

```bash
EXPO_PUBLIC_API_URL=https://api.tinkolektif.org eas build --platform all
```

Teknik adımlar: İngilizce [README.md](README.md)
