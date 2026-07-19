from django.utils.translation import gettext_lazy as _
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Education, EducationRegistration
from .serializers import (
    EducationDetailSerializer,
    EducationListSerializer,
    EducationRegistrationSerializer,
    EducationWriteSerializer,
)


class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class EducationListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        queryset = Education.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__iexact=category)
        return queryset

    def get_serializer_class(self):
        if self.request.method == "POST":
            return EducationWriteSerializer
        return EducationListSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class EducationDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        queryset = Education.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)
        return queryset

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return EducationWriteSerializer
        return EducationDetailSerializer


class EducationRegisterView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        try:
            education = Education.objects.get(slug=slug, is_published=True)
        except Education.DoesNotExist as exc:
            raise ValidationError({"detail": _("Education not found.")}) from exc

        registration, created = EducationRegistration.objects.get_or_create(
            user=request.user,
            education=education,
            defaults={"status": EducationRegistration.Status.CONFIRMED},
        )

        if not created and registration.status == EducationRegistration.Status.CONFIRMED:
            return Response(
                {"detail": _("You are already registered for this education.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if education.is_full and (
            created or registration.status != EducationRegistration.Status.CONFIRMED
        ):
            registration.status = EducationRegistration.Status.WAITLIST
            registration.save(update_fields=["status"])
            return Response(
                EducationRegistrationSerializer(registration).data,
                status=status.HTTP_201_CREATED,
            )

        registration.status = EducationRegistration.Status.CONFIRMED
        registration.save(update_fields=["status"])
        serializer = EducationRegistrationSerializer(registration)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def delete(self, request, slug):
        try:
            education = Education.objects.get(slug=slug)
        except Education.DoesNotExist as exc:
            raise ValidationError({"detail": _("Education not found.")}) from exc

        registration = EducationRegistration.objects.filter(
            user=request.user,
            education=education,
        ).first()
        if not registration:
            return Response(status=status.HTTP_404_NOT_FOUND)

        registration.status = EducationRegistration.Status.CANCELLED
        registration.save(update_fields=["status"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class MyRegistrationsView(generics.ListAPIView):
    serializer_class = EducationRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EducationRegistration.objects.filter(
            user=self.request.user,
        ).exclude(status=EducationRegistration.Status.CANCELLED)
