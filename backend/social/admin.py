from django.contrib import admin

from .models import SocialPost


@admin.register(SocialPost)
class SocialPostAdmin(admin.ModelAdmin):
    list_display = ("platform", "author_name", "user", "published_at", "post_url")
    list_filter = ("platform",)
    search_fields = ("caption", "author_name", "post_url", "user__username")
