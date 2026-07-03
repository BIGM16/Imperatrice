from rest_framework import serializers
from .models import Personne, Depense


class PersonneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personne
        fields = ["id", "name"]


class DepenseSerializer(serializers.ModelSerializer):
    responsable_nom = serializers.CharField(source="responsable.name", read_only=True)

    class Meta:
        model = Depense
        fields = ["id", "motif", "montant", "date", "responsable", "responsable_nom"]