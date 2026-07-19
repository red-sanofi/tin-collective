from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    instagram = models.CharField(max_length=200, blank=True)
    twitter = models.CharField(max_length=200, blank=True)
    youtube = models.CharField(max_length=200, blank=True)
    tiktok = models.CharField(max_length=200, blank=True)
    website = models.URLField(blank=True)
    share_social_in_feed = models.BooleanField(default=True)

    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username
