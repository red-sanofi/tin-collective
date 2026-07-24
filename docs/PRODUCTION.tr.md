# Canlı ortam rehberi — tinkolektif.org

Bu belge, Tin Kolektif’in **internet üzerinde çalışan** sürümünü anlatır: web sitesi, veri servisi, yönetim panelleri ve mobil uygulama.

İngilizce: [PRODUCTION.md](PRODUCTION.md)

## Bu platform ne yapar?

Tin Kolektif platformu dört parçadan oluşur:

1. **Web sitesi** — Ziyaretçiler eğitimleri görür, duyuruları okur, hesap açar, atölyelere kayıt olur.
2. **Veri servisi (API)** — Sitenin ve mobil uygulamanın konuştuğu “arka plan”; listeler, giriş, kayıt buradan gelir.
3. **Yönetim** — Ekip eğitim ve duyuru ekler; iki giriş noktası vardır (site içi admin ve ayrı teknik panel).
4. **Mobil uygulama** — Aynı veriyi telefondan kullanır; canlı veri için `api.tinkolektif.org` adresine bağlanır.

## Canlı adresler

| Parça | Adres | Kim girer? |
|-------|--------|------------|
| Ana site | https://tinkolektif.org | Herkes |
| Site içi yönetim | https://tinkolektif.org/admin | Yetkili ekip |
| Veri servisi | https://api.tinkolektif.org | Site ve uygulama (doğrudan tarayıcıdan az kullanılır) |
| Teknik yönetim paneli | https://admin.tinkolektif.org/admin/ | Yetkili ekip (Django admin) |

**Önemli:** Veri servisi artık `tinkolektif.org/api/...` altında değil; ayrı adres `api.tinkolektif.org` kullanılıyor.

## Sistem nasıl kurulmuş? (basit şema)

```text
İnternet
   │
   ├─ tinkolektif.org ──────► sunucu nginx ──► web uygulaması (Docker)
   ├─ api.tinkolektif.org ──► sunucu nginx ──► arka plan servisi (Docker)
   └─ admin.tinkolektif.org ► sunucu nginx ──► aynı arka plan servisi

   Veritabanı (PostgreSQL) sunucuda Docker içinde; dışarıdan doğrudan açılmaz.
```

- **nginx:** Sunucudaki “kapı”; HTTPS sertifikası ve hangi adrese neyin gideceğini ayarlar.
- **Docker:** Uygulama kodunun çalıştığı kutular (web, API, veritabanı).

## Sunucuda güncelleme (tek komut)

Kod GitHub’dan çekildikten sonra:

```bash
cd ~/tin-collective
git pull
bash deploy/production.sh
```

Bu komut sırayla: ayar dosyalarını kontrol eder, nginx yapılandırmasını günceller, uygulamayı yeniden derleyip başlatır, statik dosyaları toplar ve **sağlık kontrolü** çalıştırır.

Alternatif: `make production`

## İlk kez sunucuya kurulum

### 1. Alan adları (DNS)

Domain sağlayıcınızda dört adres de **aynı sunucu IP’sine** yönlenmeli:

- `tinkolektif.org`
- `www.tinkolektif.org`
- `api.tinkolektif.org`
- `admin.tinkolektif.org`

DNS yayılımı bazen birkaç saat sürebilir.

### 2. Projeyi indirin ve gizli ayarları yapın

```bash
git clone https://github.com/red-sanofi/tin-collective.git
cd tin-collective
cp .env.production.example .env
```

`.env` dosyasında **mutlaka** değiştirin:

- `DJANGO_SECRET_KEY` — uzun, rastgele bir anahtar (güvenlik)
- `POSTGRES_PASSWORD` — güçlü veritabanı şifresi

Google/GitHub ile giriş isteniyorsa ilgili OAuth anahtarları da buraya eklenir.

### 3. HTTPS sertifikası

Tüm alt alan adları tek sertifikada olmalı (Let’s Encrypt):

```bash
sudo certbot certonly --nginx --expand --cert-name tinkolektif.org \
  -d tinkolektif.org -d www.tinkolektif.org \
  -d api.tinkolektif.org -d admin.tinkolektif.org
```

### 4. Kurulumu çalıştırın ve doğrulayın

```bash
bash deploy/production.sh
bash deploy/check-site.sh
```

Tüm satırlar **PASS** olmalı; özellikle api ve admin HTTPS.

## Sık sorunlar (ürün / operasyon dili)

### Ana site açılıyor, api veya admin açılmıyor

Genelde **sertifika veya nginx ayarı** eksiktir; uygulama kodu bozuk olmayabilir.

```bash
bash deploy/fix-subdomains.sh
bash deploy/check-site.sh
```

### Site açılıyor ama eğitim/duyuru listeleri boş

Web sitesi yanlış API adresine bakıyor olabilir. Sunucuda `.env` içinde `VITE_API_URL=https://api.tinkolektif.org` olmalı; ardından frontend yeniden derlenmeli (`production.sh` bunu yapar).

### Yönetim panelinde stil/CSS yok

Statik dosya yolu hatalıdır:

```bash
bash deploy/diagnose-admin.sh
```

### Güncellemeden hemen sonra hata

İlk açılışta veritabanı güncellemesi 2–3 dakika sürebilir:

```bash
bash deploy/wait-for-backend.sh
bash deploy/check-site.sh
```

## Mobil uygulama — canlı veri

Telefonda **gerçek site verisi** ile test:

```bash
cd mobile
echo 'EXPO_PUBLIC_API_URL=https://api.tinkolektif.org' > .env
npm install
npx expo start -c
```

Telefonda **Expo Go** uygulamasıyla QR kodu tarayın. Bilgisayarda Docker çalışması gerekmez.

Detay: [../mobile/README.tr.md](../mobile/README.tr.md)

## Yararlı komutlar (sunucuda)

| Amaç | Komut |
|------|--------|
| Tam güncelleme | `bash deploy/production.sh` |
| Sadece kontrol | `bash deploy/check-site.sh` |
| api/admin bağlantı sorunu | `bash deploy/fix-subdomains.sh` |
| Detaylı teşhis | `bash deploy/diagnose-public.sh` |

## Eski kurulumdan farklar

| Eskiden | Şimdi |
|---------|--------|
| API: `site.com/api/...` | Ayrı adres: `api.tinkolektif.org` |
| Tek nginx dosyası | Her alt alan adı için ayrı yapılandırma |
| Admin CSS bazen bozuktu | Statik dosyalar önce yönlendirilir |
