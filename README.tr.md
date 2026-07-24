# Tin Kolektif Platform — Türkçe rehber

Tin Kolektif için **web sitesi** ve **mobil uygulama**: eğitimler, duyurular, üyelik, atölye kayıtları ve “bize katıl” başvuruları.

**Canlı site:** https://tinkolektif.org · **Veri servisi:** https://api.tinkolektif.org/

**Türkçe dokümantasyon:** [docs/README.tr.md](docs/README.tr.md)  
**İngilizce:** [README.md](README.md)

## Bu proje ne sunar?

| Özellik | Kullanıcı ne yapar? |
|---------|---------------------|
| Eğitimler / atölyeler | Listeler, detay okur, kayıt olur |
| Duyurular | Topluluk haberlerini okur |
| Hesap | Kayıt olur, giriş yapar, profil düzenler |
| Bize katıl | Topluluğa başvuru formu gönderir |
| Yönetim (yetkili) | Eğitim ve duyuru ekler, site temasını ayarlar |
| Mobil uygulama | Aynı içerik telefonda (Expo Go veya mağaza sürümü) |

Varsayılan dil **Türkçe**; sitede İngilizce de seçilebilir.

## Bilgisayarda ilk çalıştırma (geliştiriciler)

Gerekli: **Git** ve **Docker Desktop**.

```bash
git clone https://github.com/red-sanofi/tin-collective.git
cd tin-collective
make build
```

Windows’ta `make` yoksa: `.\scripts\setup.ps1 build`

Hazır olunca tarayıcıda:

| Ne | Yerel adres | Canlı adres |
|----|-------------|-------------|
| Site | http://localhost:8080 | https://tinkolektif.org |
| Veri servisi | http://localhost:8000/ | https://api.tinkolektif.org/ |
| Yönetim (site içi) | http://localhost:8080/admin | https://tinkolektif.org/admin |

Durdurmak: `make down`

## Demo hesaplar (yerel test)

| Rol | Kullanıcı | Şifre |
|-----|-----------|-------|
| Yönetici | admin | admin12345 |
| Üye | demo | demo12345 |

## Sık kullanılan komutlar

| Komut | Ne yapar? |
|-------|-----------|
| `make build` | İlk kurulum + çalıştır |
| `make down` | Durdur |
| `make logs` | Logları izle |
| `make production` | **Sunucuda** canlıya alma |
| `make mobile` | Mobil uygulamayı başlat |

## Mobil uygulama — canlı veri

Docker gerekmez; telefonda gerçek site verisi:

```bash
cd mobile
echo 'EXPO_PUBLIC_API_URL=https://api.tinkolektif.org' > .env
npm install
npx expo start -c
```

Expo Go ile QR kodu tarayın. Detay: [mobile/README.tr.md](mobile/README.tr.md)

## Canlı sunucu (operasyon)

Sunucuda her güncellemeden sonra:

```bash
cd ~/tin-collective && git pull && bash deploy/production.sh
```

Sorun giderme ve DNS/sertifika: [docs/PRODUCTION.tr.md](docs/PRODUCTION.tr.md)

## Diğer Türkçe rehberler

| Konu | Dosya |
|------|--------|
| Canlı ortam (tam) | [docs/PRODUCTION.tr.md](docs/PRODUCTION.tr.md) |
| Adresler ve ayarlar | [docs/URLS-AND-CONFIG.tr.md](docs/URLS-AND-CONFIG.tr.md) |
| Sunucu kurulum | [deploy/README.tr.md](deploy/README.tr.md) |
| Mobil | [mobile/README.tr.md](mobile/README.tr.md) |
| Arka plan servisi | [backend/README.tr.md](backend/README.tr.md) |
| Web arayüz | [frontend/README.tr.md](frontend/README.tr.md) |

## Proje yapısı (basit)

```text
backend/     — Veri, giriş, eğitim, duyuru (Django)
frontend/    — Ziyaretçilerin gördüğü web sitesi (React)
mobile/      — Telefon uygulaması (Expo)
deploy/      — Canlı sunucu scriptleri ve nginx
docs/        — Dokümantasyon (TR + EN)
```
