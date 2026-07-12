from rest_framework import serializers
from .models import Drink, Category


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description"]


class BoissonSerializer(serializers.ModelSerializer):
    benefice_unitaire = serializers.SerializerMethodField()
    category = CategorieSerializer( read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Drink
        fields = [
            "id",
            "name",
            "price_purchase",
            "price_sale",
            "stock",
            "min_stock",
            "benefice_unitaire",
            "category",
            "category_id",
            "volume",
            "image_url",
        ]

    def get_benefice_unitaire(self, obj):
        return obj.benefice_unitaire()