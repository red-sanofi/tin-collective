from rest_framework import serializers

from .models import JoinApplication


class JoinApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinApplication
        fields = (
            "id",
            "full_name",
            "email",
            "phone",
            "interest_area",
            "message",
            "portfolio_url",
            "status",
            "created_at",
        )
        read_only_fields = ("status", "created_at")
