from rest_framework.viewsets import (
    ModelViewSet
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


class SaleViewSet(
    ModelViewSet
):

    queryset = (
        Sale
        .objects
        .all()
    )

    serializer_class = (
        SaleSerializer
    )

    def post(
        self,
        request
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