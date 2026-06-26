from rest_framework import serializers
from .models import Drink, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description"]


class DrinkSerializer(serializers.ModelSerializer):
    benefice_unitaire = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Drink
        fields = [
            "id",
            "name",
            "price_purchase",
            "price_sale",
            "stock",
            "benefice_unitaire",
            "category",
            "category_id",
            "volume",
            "image_url",
        ]

    def get_benefice_unitaire(self, obj):
        return obj.benefice_unitaire()