from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.accounts.serializers import EmailTokenObtainPairSerializer
from apps.accounts.views import UserViewSet

urlpatterns = [

    path(
        "schema/",
        SpectacularAPIView.as_view(),
        name="schema"
    ),

    path(
        "docs/",
        SpectacularSwaggerView.as_view(
            url_name="schema"
        ),
        name="swagger-ui"
    ),

    path(
        "auth/login/",
        TokenObtainPairView.as_view(serializer_class=EmailTokenObtainPairSerializer),
        name="token_obtain_pair"
    ),

    path(
        "auth/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),
    
    path("users/", UserViewSet.as_view({"get": "list"}), name="users"),
    
    # Inclusion des URLs des différentes applications
    path("inventory/", include("apps.inventory.urls")),
    path("", include("apps.sales.urls")),
    path("auth/", include("apps.accounts.urls")),
    path("reports/", include("apps.reports.urls")),
    path("", include("apps.common.urls")),
    path("", include("apps.finance.urls")),

]