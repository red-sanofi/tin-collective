from django.core.management.base import BaseCommand
from django.utils import timezone

from announcements.models import Announcement
from educations.models import Education
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
            defaults={"email": "demo@tinkolektif.local"},
        )
        if created:
            demo_user.set_password("demo12345")
            demo_user.save()
            self.stdout.write(self.style.SUCCESS("Created demo user (demo / demo12345)"))

        now = timezone.now()

        educations = [
            {
                "title": "Çikolata Eğitimi",
                "summary": "Temel çikolata temperleme ve atölye deneyimi.",
                "description": (
                    "Bu atölyede çikolata temperleme, kalıplama ve sunum tekniklerini "
                    "uygulamalı olarak öğreneceksiniz. Başlangıç seviyesine uygundur."
                ),
                "category": "Workshop",
                "delivery_mode": Education.DeliveryMode.IN_PERSON,
                "location": "Adana",
                "start_at": now + timezone.timedelta(days=14),
                "capacity": 20,
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
                "title": "Sinema Okumaları",
                "summary": "Seçilmiş filmler üzerinden sinema dili atölyesi.",
                "description": (
                    "Sinema tarihinden örneklerle görsel anlatım, kurgu ve ses tasarımını "
                    "birlikte inceleyeceğimiz kolektif bir okuma grubu."
                ),
                "category": "Culture",
                "delivery_mode": Education.DeliveryMode.HYBRID,
                "location": "Tin Kolektif Studio",
                "start_at": now + timezone.timedelta(days=30),
                "capacity": 15,
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
                "title": "Leonardo da Vinci Gecesi",
                "summary": "Online etkinlik: 21 Temmuz, 20:00",
                "body": (
                    "Rönesans dehasının disiplinler arası yaklaşımını konuşacağımız online "
                    "buluşmamıza herkesi davet ediyoruz."
                ),
                "published_at": now - timezone.timedelta(days=2),
            },
        ]

        for item in announcements:
            announcement, created = Announcement.objects.get_or_create(
                title=item["title"],
                defaults={**item, "is_published": True, "created_by": admin},
            )
            if created:
                self.stdout.write(f"Created announcement: {announcement.title}")

        self.stdout.write(self.style.SUCCESS("Seed data ready."))
