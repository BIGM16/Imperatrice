from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import AuditLog
from .serializers import AuditLogSerializer

from apps.accounts.permissions import IsAdminUserCustom

class AuditLogViewSet(
    ReadOnlyModelViewSet
):

    queryset = AuditLog.objects.select_related("user").all().order_by("-created_at")

    serializer_class = AuditLogSerializer

    permission_classes = [
        IsAdminUserCustom
    ]