from django.core.exceptions import ValidationError
from django.db import models


class SiteSettings(models.Model):
    THEME_POSTER = "poster"
    THEME_ARTISAN = "artisan"
    THEME_GALLERY = "gallery"
    THEME_CHOICES = [
        (THEME_POSTER, "Poster Kolektif"),
        (THEME_ARTISAN, "Zanaat Atölyesi"),
        (THEME_GALLERY, "Sanat Galerisi"),
    ]
    THEME_IDS = {choice[0] for choice in THEME_CHOICES}

    default_theme = models.CharField(
        max_length=20,
        choices=THEME_CHOICES,
        default=THEME_GALLERY,
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def __str__(self):
        return f"Site settings (default theme: {self.default_theme})"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError("Site settings cannot be deleted.")

    @classmethod
    def load(cls):
        settings, _ = cls.objects.get_or_create(
            pk=1,
            defaults={"default_theme": cls.THEME_GALLERY},
        )
        return settings
