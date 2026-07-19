from rest_framework import serializers

from .models import Announcement


class AnnouncementListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = (
            "id",
            "title",
            "slug",
            "summary",
            "published_at",
            "created_at",
        )


class AnnouncementDetailSerializer(AnnouncementListSerializer):
    body = serializers.CharField()

    class Meta(AnnouncementListSerializer.Meta):
        fields = AnnouncementListSerializer.Meta.fields + ("body",)


class AnnouncementWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = (
            "title",
            "slug",
            "summary",
            "body",
            "is_published",
            "published_at",
        )
