from django.core.management.base import BaseCommand
from django.utils import timezone

from announcements.models import Announcement
from educations.models import Education
from social.models import SocialPost
from users.models import User


class Command(BaseCommand):
    help = "Seed demo data for Tin Collective"

    def handle(self, *args, **options):
        admin, created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@tinkolektif.local",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            admin.set_password("admin12345")
            admin.save()
            self.stdout.write(self.style.SUCCESS("Created admin user (admin / admin12345)"))
        else:
            self.stdout.write("Admin user already exists")

        demo_user, created = User.objects.get_or_create(
            username="demo",
            defaults={
                "email": "demo@tinkolektif.local",
                "instagram": "https://www.instagram.com/tinkolektif/",
                "bio": "Tin Kolektif topluluğunda atölye ve sinema etkinliklerini takip ediyorum.",
            },
        )
        if created:
            demo_user.set_password("demo12345")
            demo_user.save()
            self.stdout.write(self.style.SUCCESS("Created demo user (demo / demo12345)"))
        elif not demo_user.instagram:
            demo_user.instagram = "https://www.instagram.com/tinkolektif/"
            demo_user.save(update_fields=["instagram"])

        now = timezone.now()

        educations = [
            {
                "title": "Çikolata Eğitimi",
                "summary": "Temel çikolata temperleme, kalıplama ve sunum teknikleri.",
                "description": (
                    "Bu atölyede çikolata temperleme, kalıplama ve sunum tekniklerini "
                    "uygulamalı olarak öğreneceksiniz. Başlangıç seviyesine uygundur."
                ),
                "category": "Workshop",
                "delivery_mode": Education.DeliveryMode.IN_PERSON,
                "location": "Adana, Tin Kolektif Atölye",
                "start_at": now + timezone.timedelta(days=7),
                "capacity": 18,
            },
            {
                "title": "Seramik Temelleri Atölyesi",
                "summary": "Ellerinizle şekillendireceğiniz seramik formlar ve sırlama girişi.",
                "description": (
                    "Çömlekçi çarkında temel formlar, el ile şekillendirme ve sırlama "
                    "tekniklerini deneyimleyeceğiniz uygulamalı bir atölye."
                ),
                "category": "Workshop",
                "delivery_mode": Education.DeliveryMode.IN_PERSON,
                "location": "Adana, Tin Kolektif Atölye",
                "start_at": now + timezone.timedelta(days=10),
                "capacity": 12,
            },
            {
                "title": "Van Gogh'u Anlamak: Resim Okuma",
                "summary": "Van Gogh'un eserlerini birlikte okuyup tartışacağımız akşam oturumu.",
                "description": (
                    "Toplumun çizdiği sınırların dışına taşan bir ressamın eserlerini "
                    "görsel okuma yöntemleriyle birlikte inceleyeceğiz."
                ),
                "category": "Culture",
                "delivery_mode": Education.DeliveryMode.IN_PERSON,
                "location": "Tin Kolektif Kütüphanesi",
                "start_at": now + timezone.timedelta(days=14),
                "capacity": 20,
            },
            {
                "title": "Beyoğlu Galeri Turu",
                "summary": "İki saatlik rehberli galeri turu ve sergi okuma pratiği.",
                "description": (
                    "Beyoğlu'ndaki seçili galerilerde güncel sergileri birlikte gezecek, "
                    "her durakta eserleri bağlamına oturtarak okuyacağız."
                ),
                "category": "Culture",
                "delivery_mode": Education.DeliveryMode.IN_PERSON,
                "location": "Beyoğlu, İstanbul",
                "start_at": now + timezone.timedelta(days=18),
                "capacity": 15,
            },
            {
                "title": "Yapay Zeka Temelleri",
                "summary": "AI kavramları, pratik kullanım senaryoları ve etik.",
                "description": (
                    "Yapay zekanın temel kavramlarını, günlük hayattaki kullanım alanlarını "
                    "ve sorumlu kullanım ilkelerini ele alan interaktif bir eğitim."
                ),
                "category": "Technology",
                "delivery_mode": Education.DeliveryMode.ONLINE,
                "location": "Zoom",
                "start_at": now + timezone.timedelta(days=21),
                "capacity": 50,
            },
            {
                "title": "Dijital İllüstrasyon Atölyesi",
                "summary": "Procreate ve Figma ile dijital çizim ve kompozisyon.",
                "description": (
                    "Tablet veya bilgisayar kullanarak dijital illüstrasyon temellerini "
                    "öğreneceğimiz uygulamalı bir oturum."
                ),
                "category": "Technology",
                "delivery_mode": Education.DeliveryMode.HYBRID,
                "location": "Tin Kolektif Studio + Zoom",
                "start_at": now + timezone.timedelta(days=24),
                "capacity": 24,
            },
            {
                "title": "Sinema Okumaları",
                "summary": "Seçilmiş filmler üzerinden sinema dili atölyesi.",
                "description": (
                    "Sinema tarihinden örneklerle görsel anlatım, kurgu ve ses tasarımını "
                    "birlikte inceleyeceğimiz kolektif bir okuma grubu."
                ),
                "category": "Culture",
                "delivery_mode": Education.DeliveryMode.HYBRID,
                "location": "Tin Kolektif Studio",
                "start_at": now + timezone.timedelta(days=28),
                "capacity": 15,
            },
            {
                "title": "Fotoğrafçılıkta Işık ve Kompozisyon",
                "summary": "Doğal ışık, çerçeveleme ve hikâye anlatımı.",
                "description": (
                    "Fotoğrafçılığın temel prensiplerini uygulamalı çekimlerle "
                    "deneyimleyeceğimiz bir atölye."
                ),
                "category": "Workshop",
                "delivery_mode": Education.DeliveryMode.IN_PERSON,
                "location": "Adana, Açık Stüdyo",
                "start_at": now + timezone.timedelta(days=32),
                "capacity": 16,
            },
            {
                "title": "Dokuma ve Tekstil Atölyesi",
                "summary": "Geleneksel dokuma teknikleri ve renk teorisi.",
                "description": (
                    "Temel dokuma teknikleri, desen oluşturma ve renk uyumu "
                    "üzerine uygulamalı bir oturum."
                ),
                "category": "Workshop",
                "delivery_mode": Education.DeliveryMode.IN_PERSON,
                "location": "Adana, Tin Kolektif Atölye",
                "start_at": now + timezone.timedelta(days=35),
                "capacity": 10,
            },
            {
                "title": "Kolektif Kitap Kulübü: Modern Sanat",
                "summary": "Ayın kitabını okuyup tartışacağımız topluluk buluşması.",
                "description": (
                    "Modern sanat üzerine seçilen okumaları birlikte tartışacağımız, "
                    "yazıhane ruhunda bir buluşma."
                ),
                "category": "Culture",
                "delivery_mode": Education.DeliveryMode.ONLINE,
                "location": "Google Meet",
                "start_at": now + timezone.timedelta(days=40),
                "capacity": 30,
            },
        ]

        for item in educations:
            education, created = Education.objects.get_or_create(
                title=item["title"],
                defaults={**item, "is_published": True, "created_by": admin},
            )
            if created:
                self.stdout.write(f"Created education: {education.title}")

        announcements = [
            {
                "title": "Açık Çağrı: Yeni Eğitmenler",
                "summary": "Tin Kolektif bünyesinde atölye ve eğitim vermek isteyenleri bekliyoruz.",
                "body": (
                    "Sanat, teknoloji, gastronomi ve kültür alanlarında deneyimli eğitmenler "
                    "için açık çağrımız devam ediyor. Başvuruları Join Us sayfasından iletebilirsiniz."
                ),
                "published_at": now,
            },
            {
                "title": "Kış Atölye Takvimi Yayında",
                "summary": "Yeni dönem atölyeleri ve kayıt tarihleri açıklandı.",
                "body": (
                    "Seramikten sinema okumalarına, yapay zekadan galeri turlarına kadar "
                    "genişleyen programımızı Eğitimler sayfasından inceleyebilirsiniz."
                ),
                "published_at": now - timezone.timedelta(hours=6),
            },
            {
                "title": "FOLIA: Sergileri Nasıl Gezerim?",
                "summary": "Sergi gezme pratiği üzerine yazıhane yazısı.",
                "body": (
                    "Sergileri gezerken eserlerin altında açıklama olmasa bile nasıl okuyabileceğinizi "
                    "anlatan rehber yazımız yayında."
                ),
                "published_at": now - timezone.timedelta(days=1),
            },
            {
                "title": "Leonardo da Vinci Gecesi",
                "summary": "Online etkinlik: 21 Temmuz, 20:00",
                "body": (
                    "Rönesans dehasının disiplinler arası yaklaşımını konuşacağımız online "
                    "buluşmamıza herkesi davet ediyoruz."
                ),
                "published_at": now - timezone.timedelta(days=2),
            },
            {
                "title": "Tin Kolektif x Instagram Canlı Yayın",
                "summary": "Atölye arkası görüntüler ve soru-cevap.",
                "body": (
                    "Bu hafta sonu Instagram canlı yayınımızda seramik atölyesinden görüntüler "
                    "paylaşacağız ve sorularınızı yanıtlayacağız."
                ),
                "published_at": now - timezone.timedelta(days=3),
            },
            {
                "title": "Yeni Üyelerimizle Tanışın",
                "summary": "Son bir ayda aramıza katılan kolektif üyeleri.",
                "body": (
                    "Tin Kolektif'e katılan yeni üyelerimizi tanıttığımız kısa röportaj "
                    "serimizin ilk bölümü yayında."
                ),
                "published_at": now - timezone.timedelta(days=5),
            },
            {
                "title": "Adana'da Açık Stüdyo Günü",
                "summary": "Herkesin davetli olduğu açık stüdyo buluşması.",
                "body": (
                    "Atölyelerimizi gezebileceğiniz, üyelerle tanışabileceğiniz ve "
                    "mini demo oturumlara katılabileceğiniz açık stüdyo günümüz yaklaşıyor."
                ),
                "published_at": now - timezone.timedelta(days=7),
            },
            {
                "title": "Çağdaş Sanatın Dolambaçlı Yolları",
                "summary": "İstanbul'daki güncel sergiler üzerine yazıhane notları.",
                "body": (
                    "Şehrin farklı noktalarında açılan sergileri bir araya getiren "
                    "aylık sanat rehberimiz güncellendi."
                ),
                "published_at": now - timezone.timedelta(days=9),
            },
            {
                "title": "Bookinton ile Kitap Kulübü Röportajı",
                "summary": "Topluluk okuma pratiklerini konuştuğumuz söyleşi.",
                "body": (
                    "Kitap kulübümüzün doğuş hikâyesini ve okuma listelerimizi "
                    "Bookinton ekibiyle konuştuk."
                ),
                "published_at": now - timezone.timedelta(days=12),
            },
            {
                "title": "Mayıs Atölyeleri Kayıtları Açıldı",
                "summary": "Erken kayıt için sınırlı kontenjan.",
                "body": (
                    "Mayıs ayı atölyelerinde erken kayıt dönemi başladı. "
                    "Kontenjanlar sınırlı olduğu için yerinizi ayırtmayı unutmayın."
                ),
                "published_at": now - timezone.timedelta(days=14),
            },
            {
                "title": "Gönüllü Program Başvuruları",
                "summary": "Etkinlik ve atölye destek ekibine katılın.",
                "body": (
                    "Tin Kolektif etkinliklerinde gönüllü olarak yer almak isteyenler "
                    "için yeni dönem başvuruları açıldı."
                ),
                "published_at": now - timezone.timedelta(days=16),
            },
            {
                "title": "Sinema Gecesi: Tarkovsky Retrospektifi",
                "summary": "Seçilmiş filmler ve ardından tartışma.",
                "body": (
                    "Tarkovsky retrospektifimizin ilk gösteriminde Stalker filmini "
                    "izleyip ardından kolektif tartışma yapacağız."
                ),
                "published_at": now - timezone.timedelta(days=19),
            },
        ]

        for item in announcements:
            announcement, created = Announcement.objects.get_or_create(
                title=item["title"],
                defaults={**item, "is_published": True, "created_by": admin},
            )
            if created:
                self.stdout.write(f"Created announcement: {announcement.title}")

        site_posts = [
            {
                "platform": SocialPost.Platform.INSTAGRAM,
                "post_url": "https://www.instagram.com/tinkolektif/",
                "external_id": "tinkolektif-profile",
                "caption": "Tin Kolektif — atölyeler, eğitimler ve topluluk.",
                "image_url": "/images/hero-featured.jpg",
                "author_name": "tinkolektif",
                "published_at": now,
            },
            {
                "platform": SocialPost.Platform.INSTAGRAM,
                "post_url": "https://www.instagram.com/p/tinkolektif-ceramics/",
                "external_id": "demo-ceramics",
                "caption": "Seramik atölyesinden kareler.",
                "image_url": "/images/workshop-ceramics.jpg",
                "author_name": "tinkolektif",
                "published_at": now - timezone.timedelta(hours=8),
            },
            {
                "platform": SocialPost.Platform.INSTAGRAM,
                "post_url": "https://www.instagram.com/p/tinkolektif-chocolate/",
                "external_id": "demo-chocolate",
                "caption": "Çikolata temperleme oturumundan.",
                "image_url": "/images/workshop-chocolate.jpg",
                "author_name": "tinkolektif",
                "published_at": now - timezone.timedelta(days=1),
            },
            {
                "platform": SocialPost.Platform.INSTAGRAM,
                "post_url": "https://www.instagram.com/p/tinkolektif-cinema/",
                "external_id": "demo-cinema",
                "caption": "Sinema gecesi hazırlıkları.",
                "image_url": "/images/workshop-cinema.jpg",
                "author_name": "tinkolektif",
                "published_at": now - timezone.timedelta(days=2),
            },
            {
                "platform": SocialPost.Platform.INSTAGRAM,
                "post_url": "https://www.instagram.com/p/tinkolektif-gallery/",
                "external_id": "demo-gallery",
                "caption": "Galeri turundan notlar.",
                "image_url": "/images/gallery-visit.jpg",
                "author_name": "tinkolektif",
                "published_at": now - timezone.timedelta(days=3),
            },
            {
                "platform": SocialPost.Platform.INSTAGRAM,
                "post_url": "https://www.instagram.com/p/tinkolektif-community/",
                "external_id": "demo-community",
                "caption": "Açık stüdyo gününden anlar.",
                "image_url": "/images/community-studio.jpg",
                "author_name": "tinkolektif",
                "published_at": now - timezone.timedelta(days=4),
            },
        ]

        for item in site_posts:
            post, created = SocialPost.objects.update_or_create(
                post_url=item["post_url"],
                defaults={**item, "user": None},
            )
            if created:
                self.stdout.write(f"Created social post: {post.caption[:40]}")

        self.stdout.write(self.style.SUCCESS("Seed data ready."))
