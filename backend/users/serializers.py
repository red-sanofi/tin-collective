from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "bio",
            "phone",
            "instagram",
            "twitter",
            "youtube",
            "tiktok",
            "website",
            "share_social_in_feed",
            "is_staff",
            "date_joined",
        )
        read_only_fields = ("id", "is_staff", "date_joined")

    def validate_instagram(self, value):
        from social.services import normalize_social_value

        return normalize_social_value(value, "instagram")

    def validate_twitter(self, value):
        from social.services import normalize_social_value

        return normalize_social_value(value, "twitter")

    def validate_youtube(self, value):
        from social.services import normalize_social_value

        return normalize_social_value(value, "youtube")

    def validate_tiktok(self, value):
        from social.services import normalize_social_value

        return normalize_social_value(value, "tiktok")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "password_confirm",
            "first_name",
            "last_name",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": _("Passwords do not match.")})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
