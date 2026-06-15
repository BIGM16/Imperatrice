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

from rest_framework.response import (
    Response
)

from rest_framework import status

from .services import (
    SaleService
)

from .serializers import (
    SaleCreateSerializer,
    SaleSerializer
)

from .models import (
    Sale
)

from apps.accounts.permissions import (
    IsSellerOrAdmin
)


class SaleViewSet(
    ModelViewSet
):

    queryset = (
        Sale
        .objects
        .select_related(
            "served_by",
            "drink"
        )
    )

    serializer_class = (
        SaleSerializer
    )

    permission_classes = [
        IsSellerOrAdmin
    ]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]

    filterset_fields = [
        'served_by',
        'created_at',
        'drink'
    ]

    search_fields = [
        'served_by__username',
        'drink__name'
    ]

    ordering_fields = [
        'created_at',
        'total_price'
    ]

    def create(
        self,
        request, *args, **kwargs
    ):

        serializer = (
            SaleCreateSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:

            sale = (
                SaleService
                .create_sale(
                    drink_id=serializer.validated_data[
                        "drink_id"
                    ],
                    quantity=serializer.validated_data[
                        "quantity"
                    ],
                    seller=request.user
                )
            )

            return Response(
                SaleSerializer(
                    sale
                ).data,
                status=status.HTTP_201_CREATED
            )

        except ValueError as e:

            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )