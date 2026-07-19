import os
import re
from datetime import datetime
from urllib.parse import urlparse

import requests
from django.utils import timezone
from django.utils.dateparse import parse_datetime

from .models import SocialPost

OEMBED_ENDPOINTS = {
    SocialPost.Platform.INSTAGRAM: "https://www.instagram.com/oembed/",
    SocialPost.Platform.TWITTER: "https://publish.twitter.com/oembed",
    SocialPost.Platform.YOUTUBE: "https://www.youtube.com/oembed",
    SocialPost.Platform.TIKTOK: "https://www.tiktok.com/oembed",
}

PLATFORM_PATTERNS = {
    SocialPost.Platform.INSTAGRAM: r"(?:instagram\.com|instagr\.am)",
    SocialPost.Platform.TWITTER: r"(?:twitter\.com|x\.com)",
    SocialPost.Platform.YOUTUBE: r"(?:youtube\.com|youtu\.be)",
    SocialPost.Platform.TIKTOK: r"tiktok\.com",
}


def detect_platform(url):
    lowered = url.lower()
    for platform, pattern in PLATFORM_PATTERNS.items():
        if re.search(pattern, lowered):
            return platform
    return None


def normalize_social_value(value, platform):
    value = (value or "").strip()
    if not value:
        return ""

    if value.startswith("http://") or value.startswith("https://"):
        return value.rstrip("/")

    handle = value.lstrip("@")

    if platform == "instagram":
        return f"https://www.instagram.com/{handle}/"
    if platform == "twitter":
        return f"https://twitter.com/{handle}"
    if platform == "youtube":
        if handle.startswith("UC") or handle.startswith("@"):
            return f"https://www.youtube.com/{handle if handle.startswith('@') else '@' + handle}"
        return f"https://www.youtube.com/@{handle}"
    if platform == "tiktok":
        return f"https://www.tiktok.com/@{handle}"

    return value


def extract_external_id(url, platform):
    path = urlparse(url).path.strip("/")
    if platform == SocialPost.Platform.INSTAGRAM:
        match = re.search(r"(?:p|reel|tv)/([^/]+)", path)
        return match.group(1) if match else path.split("/")[-1]
    if platform == SocialPost.Platform.TWITTER:
        parts = path.split("/")
        return parts[-1] if parts else ""
    if platform == SocialPost.Platform.YOUTUBE:
        if "watch" in url:
            query = urlparse(url).query
            for part in query.split("&"):
                if part.startswith("v="):
                    return part.split("=", 1)[1]
        return path.split("/")[-1]
    if platform == SocialPost.Platform.TIKTOK:
        match = re.search(r"video/(\d+)", path)
        return match.group(1) if match else path.split("/")[-1]
    return path.split("/")[-1]


def fetch_oembed(url, platform):
    endpoint = OEMBED_ENDPOINTS.get(platform)
    if not endpoint:
        return None

    try:
        response = requests.get(
            endpoint,
            params={"url": url, "omitscript": "true"},
            timeout=12,
            headers={"User-Agent": "TinKolektifBot/1.0"},
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        return None


def upsert_post_from_url(url, user=None):
    platform = detect_platform(url)
    if not platform:
        raise ValueError("unsupported_platform")

    payload = fetch_oembed(url, platform) or {}
    external_id = extract_external_id(url, platform)
    published_at = timezone.now()

    timestamp = payload.get("timestamp") or payload.get("upload_date")
    if isinstance(timestamp, str):
        parsed = parse_datetime(timestamp.replace("Z", "+00:00"))
        if parsed:
            published_at = parsed
    elif isinstance(timestamp, (int, float)):
        published_at = datetime.fromtimestamp(timestamp, tz=timezone.utc)

    defaults = {
        "platform": platform,
        "user": user,
        "external_id": external_id,
        "caption": payload.get("title") or payload.get("author_name") or "",
        "image_url": payload.get("thumbnail_url") or "",
        "author_name": payload.get("author_name") or (user.username if user else ""),
        "published_at": published_at,
    }

    post, _ = SocialPost.objects.update_or_create(post_url=url.rstrip("/"), defaults=defaults)
    return post


def sync_instagram_graph_feed(user=None, limit=12):
    token = os.environ.get("INSTAGRAM_ACCESS_TOKEN", "").strip()
    account_id = os.environ.get("INSTAGRAM_USER_ID", "").strip()
    if not token or not account_id:
        return 0

    try:
        response = requests.get(
            f"https://graph.instagram.com/{account_id}/media",
            params={
                "fields": "id,caption,media_type,media_url,permalink,timestamp,thumbnail_url",
                "access_token": token,
                "limit": limit,
            },
            timeout=15,
        )
        response.raise_for_status()
        items = response.json().get("data", [])
    except requests.RequestException:
        return 0

    synced = 0
    for item in items:
        permalink = item.get("permalink")
        if not permalink:
            continue
        published_at = timezone.now()
        timestamp = item.get("timestamp")
        if timestamp:
            parsed = parse_datetime(timestamp.replace("Z", "+00:00"))
            if parsed:
                published_at = parsed

        image_url = item.get("media_url") or item.get("thumbnail_url") or ""
        if item.get("media_type") == "VIDEO" and not image_url:
            image_url = item.get("thumbnail_url") or ""

        SocialPost.objects.update_or_create(
            post_url=permalink.rstrip("/"),
            defaults={
                "platform": SocialPost.Platform.INSTAGRAM,
                "user": user,
                "external_id": item.get("id", ""),
                "caption": item.get("caption") or "",
                "image_url": image_url,
                "author_name": os.environ.get("SOCIAL_INSTAGRAM_HANDLE", "tinkolektif"),
                "published_at": published_at,
            },
        )
        synced += 1

    return synced


def sync_user_submitted_urls(user):
    synced = 0
    for post in SocialPost.objects.filter(user=user):
        try:
            upsert_post_from_url(post.post_url, user=user)
            synced += 1
        except ValueError:
            continue
    return synced


def sync_public_feed():
    synced = sync_instagram_graph_feed(user=None)
    return synced
