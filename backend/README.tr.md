# Arka plan servisi (API) — Türkçe

Site ve mobil uygulamanın **veri kaynağı**: kullanıcılar, eğitimler, duyurular, kayıtlar.

İngilizce: [README.md](README.md)

## Ürün açısından ne sunar?

| Özellik | Kullanıcı / ekip ne yapar? |
|---------|----------------------------|
| Giriş / kayıt | Üye hesabı açar, oturum açar |
| Eğitimler | Listeler, detay, atölyeye kayıt |
| Duyurular | Haberleri okur |
| Bize katıl | Başvuru formu gönderir (giriş gerekmez) |
| Site ayarları | Yetkili varsayılan site temasını seçer |
| Sosyal akış | Üyeler paylaşım ekleyebilir |

## Adresler

| Ortam | Adres |
|-------|--------|
| Canlı | https://api.tinkolektif.org/ |
| Bilgisayarda test | http://localhost:8000/ |

**Not:** Adresin sonunda `/api` yok; doğrudan `api.tinkolektif.org/educations/` gibi yollar kullanılır.

## Yönetim panelleri

| Panel | Canlı | Yerel |
|-------|--------|-------|
| Django admin (teknik) | https://admin.tinkolektif.org/admin/ | http://localhost:8000/admin/ |
| Site içi admin | https://tinkolektif.org/admin | http://localhost:8080/admin |

Demo yönetici: `admin` / `admin12345`

## Geliştirici notu

Docker ile çalıştırma: proje kökünde `make build`.  
Detaylı teknik liste: İngilizce [README.md](README.md)

Canlı kurulum: [../docs/PRODUCTION.tr.md](../docs/PRODUCTION.tr.md)
