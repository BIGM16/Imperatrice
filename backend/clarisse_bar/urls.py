from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.accounts.serializers import EmailTokenObtainPairSerializer
from . import api_urls

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_urls)),
    path("api/auth/token/", TokenObtainPairView.as_view(serializer_class=EmailTokenObtainPairSerializer), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include("core.urls")),
]
