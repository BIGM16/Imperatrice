from django.urls import path
from .views import AuditLogViewSet

from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(
    "audit-logs",
    AuditLogViewSet,
    basename="audit-logs"
)
urlpatterns= router.urls