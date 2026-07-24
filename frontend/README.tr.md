# Web sitesi (ön yüz) — Türkçe

Ziyaretçilerin gördüğü **Tin Kolektif web sitesi**: sayfalar, tema, dil seçimi.

İngilizce: [README.md](README.md)

## Ürün açısından ne var?

| Sayfa | İçerik |
|-------|--------|
| Ana sayfa | Öne çıkan atölyeler ve duyurular |
| Eğitimler | Tüm atölyeler, filtre, kayıt |
| Duyurular | Topluluk yazıları |
| Bize katıl | Başvuru formu |
| Giriş / kayıt | Üyelik |
| Profil | Kullanıcı bilgileri ve kayıtları |
| Admin (yetkili) | Eğitim/duyuru ekleme, site teması |

## Temalar

Site **üç görünüm** sunar (Poster, Zanaat Atölyesi, Sanat Galerisi). Varsayılan: **Sanat Galerisi**. Yetkili admin panelinden site geneli varsayılan değiştirilebilir.

## Adresler

| Ortam | Site |
|-------|------|
| Canlı | https://tinkolektif.org |
| Bilgisayarda Docker | http://localhost:8080 |

Site, veriyi **https://api.tinkolektif.org** adresinden alır (canlıda). Yanlış adres → sayfa açılır ama listeler boş kalır.

## Dil

Varsayılan **Türkçe**; sağ üstten **EN** ile İngilizce.

## Geliştirici notu

Docker: proje kökünde `make build`.  
Teknik detay: İngilizce [README.md](README.md)
