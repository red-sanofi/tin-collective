from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    phone = models.CharField(max_length=30, blank=True)

    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username
