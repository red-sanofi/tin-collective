from django.urls import path

from .oauth_views import OAuthJWTCallbackView, OAuthProvidersView
from .views import LoginView, MeView, RefreshView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("refresh/", RefreshView.as_view(), name="auth-refresh"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("oauth/providers/", OAuthProvidersView.as_view(), name="oauth-providers"),
    path("oauth/callback/", OAuthJWTCallbackView.as_view(), name="oauth-callback"),
]
