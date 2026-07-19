from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/social/", include("allauth.urls")),
    path("api/auth/", include("users.urls")),
    path("api/educations/", include("educations.urls")),
    path("api/announcements/", include("announcements.urls")),
    path("api/join/", include("joinus.urls")),
]
