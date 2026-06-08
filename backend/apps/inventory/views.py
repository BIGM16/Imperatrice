from rest_framework.viewsets import (
    ModelViewSet
)

from .models import Drink
from .serializers import (
    DrinkSerializer
)
from .permissions import (
    IsAdminOrReadOnly
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


class DrinkViewSet(
    ModelViewSet
):

    queryset = Drink.objects.all()

    serializer_class = DrinkSerializer

    permission_classes = [
        IsAdminOrReadOnly
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

        action_type = request.data.get(
            "action"
        )

        quantity = int(
            request.data.get(
                "quantity",
                1
            )
        )

        try:

            drink = (
                InventoryService
                .update_stock(
                drink_id=pk,
                quantity=quantity,
                action=action_type
            )
        )

            return Response(
                {
                    "success": True,
                    "new_stock": drink.stock
                }
            )

        except ValueError as e:

            return Response(
                {
                    "success": False,
                    "message": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )




