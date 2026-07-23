from django.http import JsonResponse


def api_root(_request):
    return JsonResponse(
        {
            "name": "Tin Kolektif API",
            "version": "1",
            "endpoints": {
                "auth": "/auth/",
                "educations": "/educations/",
                "announcements": "/announcements/",
                "join": "/join/",
                "social": "/social/",
                "site": "/site/",
                "admin": "/admin/",
            },
        }
    )
