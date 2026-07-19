import os

from allauth.socialaccount.models import SocialApp
from django.conf import settings
from django.contrib.sites.models import Site
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Configure OAuth providers from environment variables"

    def handle(self, *args, **options):
        site, _ = Site.objects.update_or_create(
            id=settings.SITE_ID,
            defaults={
                "domain": os.environ.get("SITE_DOMAIN", "localhost:8000"),
                "name": "Tin Kolektif",
            },
        )

        configured = 0
        configured += self._upsert_provider(
            site,
            provider="google",
            name="Google",
            client_id=os.environ.get("GOOGLE_CLIENT_ID", ""),
            secret=os.environ.get("GOOGLE_CLIENT_SECRET", ""),
        )
        configured += self._upsert_provider(
            site,
            provider="github",
            name="GitHub",
            client_id=os.environ.get("GITHUB_CLIENT_ID", ""),
            secret=os.environ.get("GITHUB_CLIENT_SECRET", ""),
        )

        if configured:
            self.stdout.write(self.style.SUCCESS(f"Configured {configured} OAuth provider(s)."))
        else:
            self.stdout.write(
                "No OAuth providers configured. Set GOOGLE_* or GITHUB_* env vars to enable social login."
            )

    def _upsert_provider(self, site, provider, name, client_id, secret):
        if not client_id or not secret:
            SocialApp.objects.filter(provider=provider).delete()
            return 0

        app, _ = SocialApp.objects.update_or_create(
            provider=provider,
            defaults={
                "name": name,
                "client_id": client_id,
                "secret": secret,
            },
        )
        app.sites.set([site])
        return 1
