from django.contrib import admin

from .models import JoinApplication


@admin.register(JoinApplication)
class JoinApplicationAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "interest_area", "status", "created_at")
    list_filter = ("status", "interest_area")
    search_fields = ("full_name", "email", "message")
