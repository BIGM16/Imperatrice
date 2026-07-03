from rest_framework import serializers
from .models import AuditLog


class JournalisationSerializer(serializers.ModelSerializer):
    utilisateur = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = AuditLog
        fields = ["id", "utilisateur", "action", "model_name", "object_id", "description", "created_at", "updated_at"]