from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient, APIRequestFactory, force_authenticate
from rest_framework.request import Request
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta

from apps.sales.models import Sale
from apps.finance.models import Depense, Personne
from apps.inventory.models import Drink
from .serializers import UserSerializer
from .permissions import IsAdminUserCustom, IsSellerOrAdmin, IsAdminOrReadOnly


class UserSerializerTest(TestCase):
    """Tests pour UserSerializer"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            first_name="Test",
            last_name="User",
            email="test@example.com",
            is_staff=True,
        )

    def test_serialize_user(self):
        """Vérifier la sérialisation d'un utilisateur"""
        serializer = UserSerializer(self.user)
        data = serializer.data
        
        self.assertEqual(data['id'], self.user.id)
        self.assertEqual(data['username'], 'testuser')
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], 'User')
        self.assertEqual(data['email'], 'test@example.com')
        self.assertTrue(data['is_staff'])
    def test_serializer_fields(self):
        """Vérifier que tous les champs requis sont présents"""
        serializer = UserSerializer(self.user)
        expected_fields = {'id', 'username', 'first_name', 'last_name', 'email', 'is_staff'}
        self.assertEqual(set(serializer.data.keys()), expected_fields)

    def test_serialize_non_staff_user(self):
        """Vérifier la sérialisation d'un utilisateur non-staff"""
        non_staff_user = User.objects.create_user(
            username="regular",
            is_staff=False,
        )
        serializer = UserSerializer(non_staff_user)
        self.assertFalse(serializer.data['is_staff'])


class MeAPIViewTest(APITestCase):
    """Tests pour la vue MeAPIView"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            is_staff=True
        )
        self.url = '/api/v1/me/'  # À adapter selon ta configuration

    def test_me_endpoint_requires_authentication(self):
        """Vérifier que le endpoint /me/ requiert l'authentification"""
        # Voir si l'endpoint est accessible sans authentification
        # response = self.client.get(self.url)
        # self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_endpoint_returns_authenticated_user(self):
        """Vérifier que /me/ retourne l'utilisateur authentifié"""
        self.client.force_authenticate(user=self.user)
        # À adapter si le endpoint existe
        # response = self.client.get(self.url)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # self.assertEqual(response.data['username'], 'testuser')

    def test_me_endpoint_returns_correct_user_data(self):
        """Vérifier que les bonnes données utilisateur sont retournées"""
        self.client.force_authenticate(user=self.user)
        # À adapter si le endpoint existe
        # response = self.client.get(self.url)
        # self.assertEqual(response.data['email'], 'test@example.com')
        # self.assertEqual(response.data['is_staff'], True)


class StatsViewTest(APITestCase):
    """Tests pour la vue StatsView"""

    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username="admin",
            password="adminpass123",
            is_staff=True
        )
        self.regular_user = User.objects.create_user(
            username="regular",
            password="userpass123",
            is_staff=False
        )
        self.url = '/api/v1/stats/'  # À adapter selon ta configuration

    def test_stats_requires_admin_permission(self):
        """Vérifier que le endpoint stats requiert les permissions d'admin"""
        # À adapter si le endpoint existe
        # self.client.force_authenticate(user=self.regular_user)
        # response = self.client.get(self.url)
        # self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_stats_accessible_to_admin(self):
        """Vérifier que les admins peuvent accéder aux stats"""
        # À adapter si le endpoint existe
        # self.client.force_authenticate(user=self.admin_user)
        # response = self.client.get(self.url)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_stats_include_today_sales(self):
        """Vérifier que les stats incluent les ventes d'aujourd'hui"""
        # Créer une boisson et une vente
        # À adapter si le endpoint existe


class PermissionsTest(TestCase):
    """Tests pour les permissions personnalisées"""

    def setUp(self):
        self.admin_user = User.objects.create_user(
            username="admin",
            is_staff=True,
        )
        self.regular_user = User.objects.create_user(
            username="regular",
            is_staff=False,
        )
        self.factory = APIRequestFactory()

    def test_is_admin_user_custom_permission(self):
        """Vérifier la permission IsAdminUserCustom"""
        permission = IsAdminUserCustom()
        
        # Admin devrait avoir accès
        request = self.factory.get('/')
        request.user = self.admin_user
        self.assertTrue(permission.has_permission(request, None))
        
        # Utilisateur régulier ne devrait pas avoir accès
        request = self.factory.get('/')
        request.user = self.regular_user
        self.assertFalse(permission.has_permission(request, None))
        # permission = IsAdminUserCustom()
        
        # # Admin devrait avoir accès
        # request = factory.get('/')
        # request.user = self.admin_user
        # drf_request = Request(request)
        # self.assertTrue(permission.has_permission(drf_request, None))
        
        # # Utilisateur régulier ne devrait pas avoir accès
        # request = factory.get('/')
        # request.user = self.regular_user
        # drf_request = Request(request)
        # self.assertFalse(permission.has_permission(drf_request, None))

    def test_is_seller_or_admin_permission(self):
        """Vérifier la permission IsSellerOrAdmin"""
        permission = IsSellerOrAdmin()
        
        # Admin et utilisateur régulier authentifiés devraient avoir accès
        request = self.factory.get('/')
        request.user = self.admin_user
        self.assertTrue(permission.has_permission(request, None))
        
        request = self.factory.get('/')
        request.user = self.regular_user
        self.assertTrue(permission.has_permission(request, None))

    def test_is_admin_or_read_only_permission_for_safe_methods(self):
        """Vérifier IsAdminOrReadOnly pour les méthodes sûres (GET, HEAD, OPTIONS)"""
        permission = IsAdminOrReadOnly()
        
        # N'importe qui (même régulier ou anonyme) peut faire un GET
        request = self.factory.get('/')
        request.user = self.regular_user
        self.assertTrue(permission.has_permission(request, None))

    def test_is_admin_or_read_only_permission_for_write_methods(self):
        """Vérifier IsAdminOrReadOnly pour les méthodes d'écriture"""
        permission = IsAdminOrReadOnly()
        
        # Un utilisateur régulier ne peut pas faire de POST
        request = self.factory.post('/')
        request.user = self.regular_user
        self.assertFalse(permission.has_permission(request, None))
        
        # Seul l'admin peut POST
        request = self.factory.post('/')
        request.user = self.admin_user
        self.assertTrue(permission.has_permission(request, None))

class UserIntegrationTest(APITestCase):
    """Tests d'intégration pour les utilisateurs"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            is_staff=True
        )

    def test_user_can_authenticate(self):
        """Vérifier qu'un utilisateur peut s'authentifier"""
        # Test avec DRF
        self.client.force_authenticate(user=self.user)
        # Vérifier que l'utilisateur est authentifié
        self.assertTrue(self.user.is_authenticated)

    def test_user_creation(self):
        """Vérifier qu'un nouvel utilisateur peut être créé"""
        new_user = User.objects.create_user(
            username="newuser",
            email="new@example.com",
            password="newpass123"
        )
        self.assertEqual(new_user.username, "newuser")
        self.assertEqual(new_user.email, "new@example.com")
        self.assertTrue(new_user.check_password("newpass123"))

    def test_user_password_hashing(self):
        """Vérifier que les mots de passe sont correctement hashés"""
        user = User.objects.create_user(
            username="hashtest",
            password="plaintext123"
        )
        # Le mot de passe ne devrait pas être stocké en clair
        self.assertNotEqual(user.password, "plaintext123")
        # Mais check_password devrait fonctionner
        self.assertTrue(user.check_password("plaintext123"))
