from urllib.parse import urlencode

from django.conf import settings
from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.utils.translation import gettext as _
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


PROVIDER_LABELS = {
    "google": "Google",
    "github": "GitHub",
}


class OAuthProvidersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from allauth.socialaccount.models import SocialApp

        backend_base = settings.BACKEND_PUBLIC_URL.rstrip("/")
        providers = []

        for app in SocialApp.objects.all().order_by("provider"):
            providers.append(
                {
                    "id": app.provider,
                    "name": PROVIDER_LABELS.get(app.provider, app.name),
                    "login_url": f"{backend_base}/auth/social/{app.provider}/login/",
                }
            )

        return Response(providers)


class OAuthJWTCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        frontend = settings.FRONTEND_URL.rstrip("/")

        if not request.user.is_authenticated:
            error = urlencode({"error": "oauth_failed"})
            return HttpResponseRedirect(f"{frontend}/auth/callback#{error}")

        refresh = RefreshToken.for_user(request.user)
        logout(request)

        fragment = urlencode(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )
        return HttpResponseRedirect(f"{frontend}/auth/callback#{fragment}")
