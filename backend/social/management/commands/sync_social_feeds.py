from django.core.management.base import BaseCommand

from social.services import sync_public_feed, sync_user_submitted_urls
from users.models import User


class Command(BaseCommand):
    help = "Refresh cached social media feed posts"

    def handle(self, *args, **options):
        synced = sync_public_feed()
        resynced = 0

        for user in User.objects.exclude(instagram="").filter(share_social_in_feed=True):
            resynced += sync_user_submitted_urls(user)

        self.stdout.write(
            self.style.SUCCESS(
                f"Synced {synced} site post(s) and refreshed {resynced} user post(s)."
            )
        )
