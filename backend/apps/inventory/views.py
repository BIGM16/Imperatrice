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

        if action_type not in {"add", "remove"}:
            return Response(
                {"success": False, "message": "Action invalide."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(request.data.get("quantity", 1))
            if quantity <= 0:
                raise ValueError("La quantité doit être supérieure à 0.")

            drink = InventoryService.update_stock(
                drink_id=pk,
                quantity=quantity,
                action=action_type,
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





