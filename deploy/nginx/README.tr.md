# Sunucu nginx ayarları — Türkçe

**nginx**, sunucudaki “trafik polisi”dir: ziyaretçiyi doğru uygulamaya yönlendirir ve HTTPS (kilit simgesi) sağlar.

İngilizce: [README.md](README.md)

## Ne nereye gider?

| İnternet adresi | Sunucuda ne çalışır? |
|-----------------|----------------------|
| tinkolektif.org | Web sitesi (Docker, port 8080) |
| api.tinkolektif.org | Veri servisi (Docker, port 8000) |
| admin.tinkolektif.org | Aynı veri servisi — yönetim paneli için |

Dosyalar: `tinkolektif.org.conf`, `api.tinkolektif.org.conf`, `admin.tinkolektif.org.conf`

## HTTPS sertifikası

Tüm adresler **tek sertifikada** olmalı:

```bash
sudo certbot certonly --nginx --expand --cert-name tinkolektif.org \
  -d tinkolektif.org -d www.tinkolektif.org \
  -d api.tinkolektif.org -d admin.tinkolektif.org
```

Eksik alt alan adı → api veya admin “bağlanamıyor” hatası verebilir.

## Yönetim paneli CSS sorunu (bilinen konu)

Yanlış yapılandırmada `/static/` (stil dosyaları) admin girişine yönlendirilir; panel “düz metin” görünür.

Doğru sıra: önce `/static/` dosyalarına izin, sonra diğer sayfalar. Güncel dosyalar repoda; `bash deploy/install-nginx.sh` ile yüklenir.

## Kontrol

```bash
bash deploy/diagnose-public.sh
bash deploy/check-site.sh
```
