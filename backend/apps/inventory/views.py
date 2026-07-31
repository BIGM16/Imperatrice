from rest_framework.viewsets import (
    ModelViewSet
)

from django_filters.rest_framework import (
    DjangoFilterBackend
)

from rest_framework.filters import (
    SearchFilter,
    OrderingFilter
)

from .models import Drink, Category
from .serializers import (
    BoissonSerializer,
    CategorieSerializer,
)

from rest_framework.decorators import (
    action
)

from rest_framework.response import (
    Response
)

from rest_framework import status

from .services import (
    InventoryService
)

from apps.accounts.permissions import (
    IsAdminOrReadOnly
)


from apps.common.service import AuditLogService

class DrinkViewSet(
    ModelViewSet
):

    queryset = Drink.objects.all()

    serializer_class = BoissonSerializer

    permission_classes = [
        IsAdminOrReadOnly
    ]

    filter_backends = [
        SearchFilter,
        OrderingFilter
    ]

    filterset_fields = [
        'name',
        'price_sale',
        'stock'
    ]

    search_fields = [
        'name'
    ]

    ordering_fields = [
        'price_sale',
        'stock',
        'created_at'
    ]

    def perform_create(self, serializer):
        drink = serializer.save()
        user = self.request.user if self.request.user and self.request.user.is_authenticated else None
        AuditLogService.log_action(
            user=user,
            action="CREATE",
            model_name="Drink",
            object_id=drink.id,
            description=f"Création de la boisson '{drink.name}' (Prix: {drink.price_sale} FC, Stock: {drink.stock})."
        )

    def perform_update(self, serializer):
        drink = serializer.save()
        user = self.request.user if self.request.user and self.request.user.is_authenticated else None
        AuditLogService.log_action(
            user=user,
            action="UPDATE",
            model_name="Drink",
            object_id=drink.id,
            description=f"Modification de la boisson '{drink.name}' (Prix: {drink.price_sale} FC, Stock: {drink.stock})."
        )

    def perform_destroy(self, instance):
        user = self.request.user if self.request.user and self.request.user.is_authenticated else None
        AuditLogService.log_action(
            user=user,
            action="DELETE",
            model_name="Drink",
            object_id=instance.id,
            description=f"Suppression de la boisson '{instance.name}'."
        )
        instance.delete()

    @action(
        detail=True,
        methods=["post"]
    )
    def update_stock(
        self,
        request,
        pk=None
    ):

        action_type = request.data.get("action")

        if action_type not in {"add", "remove", "set"}:
            return Response(
                {"success": False, "message": "Action invalide."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(request.data.get("quantity", 1))
            if quantity < 0:
                raise ValueError("La quantité ne peut pas être négative.")
            if action_type in {"add", "remove"} and quantity == 0:
                raise ValueError("La quantité doit être supérieure à 0.")

            user = request.user if request.user and request.user.is_authenticated else None
            drink = InventoryService.update_stock(
                drink_id=pk,
                quantity=quantity,
                action=action_type,
                user=user,
            )

            return Response({"success": True, "new_stock": drink.stock})

        except (ValueError, TypeError) as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CategorieViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAdminOrReadOnly]





