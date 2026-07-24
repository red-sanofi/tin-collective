# Dokümantasyon — Türkçe

Bu klasördeki Türkçe rehberler, teknik bilgisi olmayan ekip üyeleri (ürün, operasyon, içerik) için yazılmıştır. **Ne işe yarar, kim kullanır, nasıl yapılır** sorularına odaklanır.

İngilizce sürümler için: [README.md](README.md)

## Hangi rehberi okumalıyım?

| Siz kimsiniz? | Okuyun |
|---------------|--------|
| Siteyi veya uygulamayı **canlıda** kullanmak / kontrol etmek istiyorum | [PRODUCTION.tr.md](PRODUCTION.tr.md) |
| **Adresler** ve ortam ayarları (local vs canlı) | [URLS-AND-CONFIG.tr.md](URLS-AND-CONFIG.tr.md) |
| Projeye **ilk kez** giriyorum (geliştirici) | [../README.tr.md](../README.tr.md) |
| **Sunucuya** kurulum / güncelleme yapacağım | [../deploy/README.tr.md](../deploy/README.tr.md) |
| **Mobil uygulama** (telefonda test) | [../mobile/README.tr.md](../mobile/README.tr.md) |
| **İçerik / eğitim** tarafı (API ne sunuyor?) | [../backend/README.tr.md](../backend/README.tr.md) |
| **Web arayüz** tarafı | [../frontend/README.tr.md](../frontend/README.tr.md) |

## Canlı site — tek bakışta

| Ne | Adres |
|----|--------|
| Ana site (ziyaretçiler) | https://tinkolektif.org |
| Veri servisi (API) | https://api.tinkolektif.org |
| Yönetici paneli (teknik) | https://admin.tinkolektif.org/admin/ |
| Yönetici paneli (site içi) | https://tinkolektif.org/admin |

**Sunucuda güncelleme:** `git pull` sonrası `bash deploy/production.sh`  
**Her şey çalışıyor mu?** `bash deploy/check-site.sh`

## Demo hesaplar (sadece test ortamında)

| Rol | Kullanıcı | Şifre |
|-----|-----------|-------|
| Yönetici | `admin` | `admin12345` |
| Üye | `demo` | `demo12345` |

Canlı ortamda bu hesaplar yalnızca sunucuda tanımlıysa geçerlidir.
