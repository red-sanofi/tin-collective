from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Education(models.Model):
    class DeliveryMode(models.TextChoices):
        ONLINE = "online", "Online"
        IN_PERSON = "in_person", "In person"
        HYBRID = "hybrid", "Hybrid"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    summary = models.CharField(max_length=300)
    description = models.TextField()
    category = models.CharField(max_length=100)
    delivery_mode = models.CharField(
        max_length=20,
        choices=DeliveryMode.choices,
        default=DeliveryMode.ONLINE,
    )
    location = models.CharField(max_length=200, blank=True)
    start_at = models.DateTimeField()
    end_at = models.DateTimeField(null=True, blank=True)
    capacity = models.PositiveIntegerField(default=30)
    is_published = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_educations",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_at"]

    def __str__(self):
        return self.title

    @property
    def registration_count(self):
        return self.registrations.filter(status=EducationRegistration.Status.CONFIRMED).count()

    @property
    def spots_remaining(self):
        return max(self.capacity - self.registration_count, 0)

    @property
    def is_full(self):
        return self.spots_remaining == 0

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "education"
            slug = base_slug
            counter = 1
            while Education.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


class EducationRegistration(models.Model):
    class Status(models.TextChoices):
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"
        WAITLIST = "waitlist", "Waitlist"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="education_registrations",
    )
    education = models.ForeignKey(
        Education,
        on_delete=models.CASCADE,
        related_name="registrations",
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CONFIRMED,
    )
    notes = models.TextField(blank=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "education")
        ordering = ["-registered_at"]

    def __str__(self):
        return f"{self.user.username} -> {self.education.title}"
