from rest_framework.viewsets import ModelViewSet
from .models import Depense, Personne
from .serializers import DepenseSerializer, PersonneSerializer

from apps.accounts.permissions import (
    IsAdminUserCustom
)

from apps.common.service import AuditLogService

# Create your views here.
class DepenseViewSet(
    ModelViewSet
):

    queryset = (
        Depense.objects
        .select_related(
            "responsable"
        )
        .all()
    )

    permission_classes = [
        IsAdminUserCustom
    ]

    serializer_class = (
        DepenseSerializer
    )

    def perform_create(self, serializer):
        depense = serializer.save()
        user = self.request.user if self.request.user and self.request.user.is_authenticated else None
        AuditLogService.log_action(
            user=user,
            action="EXPENSE",
            model_name="Depense",
            object_id=depense.id,
            description=f"Création de la dépense '{depense.motif}' de {depense.montant} FC."
        )

    def perform_update(self, serializer):
        depense = serializer.save()
        user = self.request.user if self.request.user and self.request.user.is_authenticated else None
        AuditLogService.log_action(
            user=user,
            action="UPDATE",
            model_name="Depense",
            object_id=depense.id,
            description=f"Modification de la dépense '{depense.motif}' (Montant: {depense.montant} FC)."
        )

    def perform_destroy(self, instance):
        user = self.request.user if self.request.user and self.request.user.is_authenticated else None
        AuditLogService.log_action(
            user=user,
            action="DELETE",
            model_name="Depense",
            object_id=instance.id,
            description=f"Suppression de la dépense '{instance.motif}' de {instance.montant} FC."
        )
        instance.delete()

class PersonneViewSet(ModelViewSet):
    queryset = Personne.objects.all()
    serializer_class = PersonneSerializer