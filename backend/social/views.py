from django.db import models
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SocialPost
from .serializers import SocialPostCreateSerializer, SocialPostSerializer
from .services import upsert_post_from_url


class SocialFeedView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SocialPostSerializer
    pagination_class = None

    def get_queryset(self):
        return (
            SocialPost.objects.select_related("user")
            .filter(models.Q(user__isnull=True) | models.Q(user__share_social_in_feed=True))
            .order_by("-published_at", "-id")[:12]
        )


class MySocialPostsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SocialPostSerializer
    pagination_class = None

    def get_queryset(self):
        return SocialPost.objects.filter(user=self.request.user).order_by("-published_at", "-id")


class SocialPostCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = SocialPostCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            post = upsert_post_from_url(serializer.validated_data["post_url"], user=request.user)
        except ValueError:
            return Response(
                {"detail": "Unsupported social media URL."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(SocialPostSerializer(post).data, status=status.HTTP_201_CREATED)


class SocialPostDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        post = get_object_or_404(SocialPost, pk=pk, user=request.user)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
