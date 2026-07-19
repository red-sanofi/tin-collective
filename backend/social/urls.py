from django.urls import path

from .views import MySocialPostsView, SocialFeedView, SocialPostCreateView, SocialPostDeleteView

urlpatterns = [
    path("feed/", SocialFeedView.as_view(), name="social-feed"),
    path("mine/", MySocialPostsView.as_view(), name="my-social-posts"),
    path("posts/", SocialPostCreateView.as_view(), name="social-post-create"),
    path("posts/<int:pk>/", SocialPostDeleteView.as_view(), name="social-post-delete"),
]
