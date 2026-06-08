from rest_framework import serializers

from .models import Drink


class DrinkSerializer(
    serializers.ModelSerializer
):

    benefice_unitaire = serializers.SerializerMethodField()

    class Meta:
        model = Drink

        fields = [
            "id",
            "name",
            "price_purchase",
            "price_sale",
            "stock",
            "benefice_unitaire",
        ]

    def get_benefice_unitaire(
        self,
        obj
    ):
        return obj.benefice_unitaire()