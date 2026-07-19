from django.contrib import admin

from .models import Education, EducationRegistration


class EducationRegistrationInline(admin.TabularInline):
    model = EducationRegistration
    extra = 0
    readonly_fields = ("registered_at",)


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "start_at",
        "delivery_mode",
        "is_published",
        "capacity",
    )
    list_filter = ("is_published", "delivery_mode", "category")
    search_fields = ("title", "summary", "description")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [EducationRegistrationInline]


@admin.register(EducationRegistration)
class EducationRegistrationAdmin(admin.ModelAdmin):
    list_display = ("user", "education", "status", "registered_at")
    list_filter = ("status",)
    search_fields = ("user__username", "education__title")
