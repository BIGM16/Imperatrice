from rest_framework import serializers
from .models import Personne, Depense


class PersonneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personne
        fields = ["id", "name"]


class DepenseSerializer(serializers.ModelSerializer):
    responsable_nom = serializers.SerializerMethodField()

    class Meta:
        model = Depense
        fields = ["id", "motif", "montant", "date", "responsable", "responsable_nom"]

    def get_responsable_nom(self, obj):
        if obj.responsable is None:
            return None
        # User Django utilise `username`
        return getattr(obj.responsable, "username", None) or getattr(obj.responsable, "name", None)