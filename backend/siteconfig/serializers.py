from rest_framework import serializers

from .models import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    available_themes = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = ("default_theme", "available_themes", "updated_at")
        read_only_fields = ("updated_at",)

    def get_available_themes(self, _obj):
        return [choice[0] for choice in SiteSettings.THEME_CHOICES]

    def validate_default_theme(self, value):
        if value not in SiteSettings.THEME_IDS:
            raise serializers.ValidationError("Invalid theme.")
        return value
