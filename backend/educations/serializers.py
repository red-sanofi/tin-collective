from rest_framework import serializers

from .models import Education, EducationRegistration


class EducationListSerializer(serializers.ModelSerializer):
    registration_count = serializers.IntegerField(read_only=True)
    spots_remaining = serializers.IntegerField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    is_registered = serializers.SerializerMethodField()

    class Meta:
        model = Education
        fields = (
            "id",
            "title",
            "slug",
            "summary",
            "category",
            "delivery_mode",
            "location",
            "start_at",
            "end_at",
            "capacity",
            "registration_count",
            "spots_remaining",
            "is_full",
            "is_registered",
        )

    def get_is_registered(self, obj):
        user = self.context["request"].user
        if not user.is_authenticated:
            return False
        return obj.registrations.filter(
            user=user,
            status=EducationRegistration.Status.CONFIRMED,
        ).exists()


class EducationDetailSerializer(EducationListSerializer):
    description = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    class Meta(EducationListSerializer.Meta):
        fields = EducationListSerializer.Meta.fields + (
            "description",
            "created_at",
        )


class EducationWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = (
            "title",
            "slug",
            "summary",
            "description",
            "category",
            "delivery_mode",
            "location",
            "start_at",
            "end_at",
            "capacity",
            "is_published",
        )


class EducationRegistrationSerializer(serializers.ModelSerializer):
    education_title = serializers.CharField(source="education.title", read_only=True)
    education_slug = serializers.CharField(source="education.slug", read_only=True)
    education_start_at = serializers.DateTimeField(source="education.start_at", read_only=True)

    class Meta:
        model = EducationRegistration
        fields = (
            "id",
            "education",
            "education_title",
            "education_slug",
            "education_start_at",
            "status",
            "notes",
            "registered_at",
        )
        read_only_fields = ("status", "registered_at")
