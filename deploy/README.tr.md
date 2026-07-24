# Canlı sunucu kurulumu — Türkçe

Bu klasördeki scriptler, Tin Kolektif’i **gerçek sunucuda** (tinkolektif.org) çalıştırmak içindir.

İngilizce: [README.md](README.md) · Detaylı rehber: [../docs/PRODUCTION.tr.md](../docs/PRODUCTION.tr.md)

## Kim ne yapar?

| Rol | Görev |
|-----|--------|
| **Operasyon / DevOps** | `production.sh` çalıştırır, DNS ve sertifikayı kontrol eder |
| **Geliştirici** | Kodu GitHub’a push eder; sunucuda `git pull` |
| **Ürün / içerik** | Site açıldıktan sonra https://tinkolektif.org/admin üzerinden içerik girer |

## Canlı adresler

| Adres | Ne |
|--------|-----|
| https://tinkolektif.org | Ana site |
| https://api.tinkolektif.org/ | Veri servisi (site + mobil) |
| https://admin.tinkolektif.org/admin/ | Teknik yönetim paneli |

## Tek komutla güncelleme

Kod çekildikten sonra sunucuda:

```bash
cd ~/tin-collective
git pull
bash deploy/production.sh
```

Bu komut nginx’i günceller, Docker’ı yeniden başlatır, statik dosyaları toplar ve **sağlık kontrolü** yapar.

## Script’ler — ne zaman kullanılır?

| Script | Ne zaman? |
|--------|-----------|
| **`production.sh`** | Her deploy — **bunu kullanın** |
| `check-site.sh` | “Her şey çalışıyor mu?” kontrolü |
| `fix-subdomains.sh` | api veya admin adresi açılmıyorsa |
| `diagnose-public.sh` | DNS / sertifika teşhisi |
| `diagnose-admin.sh` | Yönetim panelinde CSS/stil yoksa |
| `install-nginx.sh` | Sadece nginx ayarlarını yenilemek |
| `wait-for-backend.sh` | Servis henüz ayağa kalkmadıysa bekle |

## İlk kurulum (kısa)

1. DNS: dört alan adı → sunucu IP  
2. `git clone` + `.env.production.example` → `.env` (şifreleri değiştir)  
3. Let’s Encrypt sertifikası (tüm alt alan adları dahil)  
4. `bash deploy/production.sh`  
5. `bash deploy/check-site.sh` — hepsi yeşil olmalı

Adım adım: [../docs/PRODUCTION.tr.md](../docs/PRODUCTION.tr.md)

## Sık sorunlar

**Ana site OK, api/admin açılmıyor** → `bash deploy/fix-subdomains.sh`

**Liste boş ama site açılıyor** → `.env` içinde `VITE_API_URL=https://api.tinkolektif.org` + frontend yeniden build

**Admin paneli düz metin, stil yok** → `bash deploy/diagnose-admin.sh`

Nginx dosyaları: [nginx/README.tr.md](nginx/README.tr.md)
