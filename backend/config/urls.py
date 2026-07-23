from django.contrib import admin
from django.urls import include, path

from .views import api_root

urlpatterns = [
    path("", api_root),
    path("admin/", admin.site.urls),
    path("auth/social/", include("allauth.urls")),
    path("auth/", include("users.urls")),
    path("educations/", include("educations.urls")),
    path("announcements/", include("announcements.urls")),
    path("join/", include("joinus.urls")),
    path("social/", include("social.urls")),
    path("site/", include("siteconfig.urls")),
]
