from rest_framework import serializers
from .models import Drink, Category


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description"]


class BoissonSerializer(serializers.ModelSerializer):
    benefice_unitaire = serializers.SerializerMethodField()
    categorie = CategorieSerializer(read_only=True)
    categorie_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
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
            "benefice_unitaire",
            "categorie",
            "categorie_id",
            "volume",
            "image_url",
        ]

    def get_benefice_unitaire(self, obj):
        return obj.benefice_unitaire()