from django.conf import settings
from django.db import models


class SocialPost(models.Model):
    class Platform(models.TextChoices):
        INSTAGRAM = "instagram", "Instagram"
        TWITTER = "twitter", "Twitter/X"
        YOUTUBE = "youtube", "YouTube"
        TIKTOK = "tiktok", "TikTok"

    platform = models.CharField(max_length=20, choices=Platform.choices)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="social_posts",
        null=True,
        blank=True,
    )
    post_url = models.URLField(unique=True)
    external_id = models.CharField(max_length=120, blank=True)
    caption = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    author_name = models.CharField(max_length=120, blank=True)
    published_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-id"]

    def __str__(self):
        return f"{self.platform}: {self.post_url}"
