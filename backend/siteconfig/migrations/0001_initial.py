from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="SiteSettings",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "default_theme",
                    models.CharField(
                        choices=[
                            ("poster", "Poster Kolektif"),
                            ("artisan", "Zanaat Atölyesi"),
                            ("gallery", "Sanat Galerisi"),
                        ],
                        default="gallery",
                        max_length=20,
                    ),
                ),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Site settings",
                "verbose_name_plural": "Site settings",
            },
        ),
    ]
