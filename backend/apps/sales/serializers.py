from rest_framework import serializers


class SaleCreateSerializer(
    serializers.Serializer
):

    drink_id = serializers.IntegerField()

    quantity = serializers.IntegerField(
        min_value=1
    )


from .models import Sale


class SaleSerializer(
    serializers.ModelSerializer
):

    drink_name = serializers.CharField(
        source="drink.name",
        read_only=True
    )

    seller_name = serializers.CharField(
        source="served_by.username",
        read_only=True
    )

    class Meta:

        model = Sale

        fields = "__all__"