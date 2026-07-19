import re

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        email = data.get("email") or user.email or ""
        if email and not user.email:
            user.email = email
        if not user.username:
            user.username = self._generate_username(email, data)
        return user

    def _generate_username(self, email, data):
        base_source = email.split("@")[0] if email else data.get("name") or data.get("username") or "user"
        base = re.sub(r"[^\w.@+-]", "", base_source.lower())[:140] or "user"
        candidate = base
        counter = 1
        while User.objects.filter(username=candidate).exists():
            suffix = str(counter)
            candidate = f"{base[:140 - len(suffix)]}{suffix}"
            counter += 1
        return candidate
