from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_staff",
        ]


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username = serializers.CharField(required=False, allow_blank=True, write_only=True)
    email = serializers.EmailField(required=False, allow_blank=True, write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].required = False
        self.fields["username"].allow_blank = True

    def validate(self, attrs):
        email = attrs.get("email")
        username = attrs.get("username")
        password = attrs.get("password")

        if not password:
            raise ValidationError({"password": "This field is required."})

        user = None
        if email:
            user = User.objects.filter(Q(email__iexact=email) | Q(username__iexact=email)).first()
        elif username:
            user = User.objects.filter(Q(username__iexact=username) | Q(email__iexact=username)).first()

        if user is None or not user.is_active or not user.check_password(password):
            raise ValidationError({"detail": "No active account found with the given credentials"})

        data = super().validate({"username": user.get_username(), "password": password})
        return data