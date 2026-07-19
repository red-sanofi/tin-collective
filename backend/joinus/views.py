from rest_framework import generics, permissions

from .models import JoinApplication
from .serializers import JoinApplicationSerializer


class JoinApplicationCreateView(generics.CreateAPIView):
    queryset = JoinApplication.objects.all()
    serializer_class = JoinApplicationSerializer
    permission_classes = [permissions.AllowAny]


class JoinApplicationListView(generics.ListAPIView):
    queryset = JoinApplication.objects.all()
    serializer_class = JoinApplicationSerializer
    permission_classes = [permissions.IsAdminUser]
