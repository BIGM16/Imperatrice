from rest_framework import serializers

from apps.inventory.models import Drink


class SaleCreateSerializer(
    serializers.Serializer
):

    drink_id = serializers.IntegerField(
        required=False,
        write_only=True
    )

    drink = serializers.PrimaryKeyRelatedField(
        queryset=Drink.objects.all(),
        required=False,
        write_only=True
    )

    quantity = serializers.IntegerField(
        min_value=1
    )

    def validate(self, data):
        if not data.get("drink_id") and not data.get("drink"):
            raise serializers.ValidationError(
                "Le champ drink ou drink_id est requis."
            )

        if not data.get("drink_id"):
            data["drink_id"] = data["drink"].pk

        return data


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

        fields = [
            "id",
            "drink",
            "drink_name",
            "quantity",
            "unit_price",
            "total_price",
            "served_by",
            "seller_name",
            "created_at",
        ]

        read_only_fields = [
            "unit_price",
            "total_price",
            "served_by",
            "drink_name",
            "seller_name",
            "created_at",
        ]