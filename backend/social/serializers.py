from rest_framework import serializers

from .models import SocialPost


class SocialPostSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()

    class Meta:
        model = SocialPost
        fields = (
            "id",
            "platform",
            "post_url",
            "caption",
            "image_url",
            "author_name",
            "author_username",
            "published_at",
        )
        read_only_fields = fields

    def get_author_username(self, obj):
        return obj.user.username if obj.user else obj.author_name


class SocialPostCreateSerializer(serializers.Serializer):
    post_url = serializers.URLField()

    def validate_post_url(self, value):
        from .services import detect_platform

        if not detect_platform(value):
            raise serializers.ValidationError("Unsupported social media URL.")
        return value.rstrip("/")
