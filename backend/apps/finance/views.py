from rest_framework.viewsets import ModelViewSet
from .models import Depense, Personne
from .serializers import DepenseSerializer, PersonneSerializer

from apps.accounts.permissions import (
    IsAdminUserCustom
)

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

class PersonneViewSet(ModelViewSet):
    queryset = Personne.objects.all()
    serializer_class = PersonneSerializer