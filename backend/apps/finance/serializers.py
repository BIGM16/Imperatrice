from rest_framework import serializers
from .models import (
    Personne,
    Depense
)

class PersonSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = Personne
        fields = "__all__"


class DepenseSerializer(
    serializers.ModelSerializer
):

    responsible_name = serializers.CharField(
        source="responsable.name",
        read_only=True
    )

    class Meta:
        model = Depense

        fields = "__all__"