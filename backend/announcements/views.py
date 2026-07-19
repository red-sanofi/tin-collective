from rest_framework import generics, permissions

from .models import Announcement
from .serializers import (
    AnnouncementDetailSerializer,
    AnnouncementListSerializer,
    AnnouncementWriteSerializer,
)


class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class AnnouncementListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        queryset = Announcement.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)
        return queryset

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AnnouncementWriteSerializer
        return AnnouncementListSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class AnnouncementDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        queryset = Announcement.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)
        return queryset

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return AnnouncementWriteSerializer
        return AnnouncementDetailSerializer
