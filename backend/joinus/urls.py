from django.urls import path

from .views import JoinApplicationCreateView, JoinApplicationListView

urlpatterns = [
    path("", JoinApplicationCreateView.as_view(), name="join-create"),
    path("applications/", JoinApplicationListView.as_view(), name="join-list"),
]
