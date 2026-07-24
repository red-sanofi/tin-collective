# Adresler ve ayar dosyaları — Türkçe

**Ne nerede açılır** ve **hangi ayar dosyası ne işe yarar** — teknik olmayan özet.

İngilizce: [URLS-AND-CONFIG.md](URLS-AND-CONFIG.md) · Canlı kurulum: [PRODUCTION.tr.md](PRODUCTION.tr.md)

## Canlı (production) adresler

| Ne | Adres | Açıklama |
|----|--------|----------|
| Web sitesi | https://tinkolektif.org | Ziyaretçilerin gördüğü site |
| Veri servisi | https://api.tinkolektif.org/ | Site ve mobil uygulamanın veri kaynağı |
| Teknik yönetim | https://admin.tinkolektif.org/admin/ | Django yönetim paneli |
| Site içi yönetim | https://tinkolektif.org/admin | Aynı ekip için site üzerinden panel |

**DNS:** Yukarıdaki dört alan adı da sunucunun IP’sine yönlenmeli.  
**HTTPS:** Tek sertifika tüm alt alan adlarını kapsamalı; sorun varsa `bash deploy/fix-subdomains.sh`.

## Bilgisayarınızda test (Docker)

Geliştiriciler `make build` ile yerelde çalıştırır:

| Ne | Tarayıcıda açın |
|----|------------------|
| Site | http://localhost:8080 |
| Site içi admin | http://localhost:8080/admin |
| Veri servisi | http://localhost:8000/ |
| Django admin | http://localhost:8000/admin/ |

Demo: `admin` / `admin12345`, `demo` / `demo12345`

Ayarlama dosyası: proje kökündeki `.env` (ilk seferde `.env.example` kopyalanır).

## Mobil uygulama — hangi adrese bağlansın?

`mobile/.env` içinde tek satır önemli:

```bash
EXPO_PUBLIC_API_URL=...
```

| Durum | Değer |
|-------|--------|
| **Canlı site verisi (telefon + Expo Go)** | `https://api.tinkolektif.org` |
| Bilgisayarda Docker + iOS simülatör | `http://127.0.0.1:8000` |
| Bilgisayarda Docker + Android emülatör | `http://10.0.2.2:8000` |
| Telefon + bilgisayarda Docker (aynı Wi‑Fi) | `http://BILGISAYAR_IP:8000` |

`.env` değiştirdikten sonra: `npx expo start -c`

## Sunucudaki gizli ayar dosyası (`.env`)

Canlı sunucuda `.env.production.example` → `.env` kopyalanır. Önemli satırlar:

| Ayar | Canlı değer | Ne işe yarar |
|------|-------------|--------------|
| `FRONTEND_URL` | `https://tinkolektif.org` | OAuth sonrası kullanıcı nereye döner |
| `VITE_API_URL` | `https://api.tinkolektif.org` | Web sitesi veriyi nereden çeker |
| `BACKEND_PUBLIC_URL` | `https://api.tinkolektif.org` | API’nin kendi adresi |
| `DJANGO_DEBUG` | `false` | Canlıda hata detayı gizlenir |

`bash deploy/production.sh` bu değerlerin çoğunu otomatik yazar.

## Google / GitHub ile giriş (canlı)

OAuth uygulama ayarlarında **geri dönüş adresi** olarak:

- Google: `https://api.tinkolektif.org/auth/social/google/login/callback/`
- GitHub: `https://api.tinkolektif.org/auth/social/github/login/callback/`

## Hangi dosyayı kim düzenler?

| Amaç | Dosya / komut |
|------|----------------|
| Yerel test ayarları | `.env` |
| Canlı sunucu ayarları | sunucudaki `.env` |
| Mobil hangi API’ye baksın | `mobile/.env` |
| Sunucu nginx | `deploy/nginx/` + `bash deploy/install-nginx.sh` |
| Canlıya alma | `bash deploy/production.sh` |
| Kontrol listesi | `bash deploy/check-site.sh` |

## Veri servisi yolları (özet)

Site ve uygulama şu tür istekler yapar (hepsi `api.tinkolektif.org` üzerinde, **`/api` öneki yok**):

- Giriş / kayıt: `/auth/...`
- Eğitim listesi: `/educations/`
- Duyurular: `/announcements/`
- Bize katıl formu: `/join/`
- Site ayarları (tema vb.): `/site/settings/`
