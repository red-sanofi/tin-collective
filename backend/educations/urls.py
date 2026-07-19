from django.urls import path

from .views import (
    EducationDetailView,
    EducationListCreateView,
    EducationRegisterView,
    MyRegistrationsView,
)

urlpatterns = [
    path("", EducationListCreateView.as_view(), name="education-list"),
    path("mine/", MyRegistrationsView.as_view(), name="my-registrations"),
    path("<slug:slug>/", EducationDetailView.as_view(), name="education-detail"),
    path("<slug:slug>/register/", EducationRegisterView.as_view(), name="education-register"),
]
