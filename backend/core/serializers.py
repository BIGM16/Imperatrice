from rest_framework import serializers
from .models import Drink, Sale, Depense, Personne

class DrinkSerializer(serializers.ModelSerializer):
    benefice_unitaire = serializers.SerializerMethodField()

    class Meta:
        model = Drink
        fields = ['id', 'name', 'prix_achat', 'prix_vente', 'stock', 'benefice_unitaire']

    def get_benefice_unitaire(self, obj):
        return obj.benefice_unitaire()

    def validate(self, data):
        # En cas de validation partielle (PATCH), il faut récupérer les valeurs existantes de l'instance si elles ne sont pas dans data
        prix_achat = data.get('prix_achat', self.instance.prix_achat if self.instance else 0)
        prix_vente = data.get('prix_vente', self.instance.prix_vente if self.instance else 0)

        if prix_vente < prix_achat:
            raise serializers.ValidationError(
                "Le prix de vente ne peut pas être inférieur au prix d'achat."
            )
        return data

class SaleSerializer(serializers.ModelSerializer):
    drink_name = serializers.CharField(source='drink.name', read_only=True)
    seller_name = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = ['id', 'drink', 'drink_name', 'quantity', 'total',
                  'benefice_total', 'seller', 'seller_name', 'created_at']
        read_only_fields = ['total', 'benefice_total', 'seller', 'created_at']

    def get_seller_name(self, obj):
        if obj.seller:
            return obj.seller.get_full_name() or obj.seller.username
        return None

class DepenseSerializer(serializers.ModelSerializer):
    responsable_name = serializers.CharField(
        source='responsable.name', read_only=True, allow_null=True
    )

    class Meta:
        model = Depense
        fields = ['id', 'motif', 'montant', 'date', 'responsable', 'responsable_name']
        read_only_fields = ['date']

class PersonneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personne
        fields = ['id', 'name']
