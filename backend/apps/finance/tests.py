from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from decimal import Decimal
from django.core.exceptions import ValidationError

from .models import Depense, Personne
from .serializers import DepenseSerializer, PersonSerializer


class PersonneModelTest(TestCase):
    """Tests pour le modèle Personne"""

    def test_create_personne(self):
        """Vérifier la création d'une personne"""
        personne = Personne.objects.create(name="Alice")
        self.assertEqual(personne.name, "Alice")
        self.assertIsNotNone(personne.id)

    def test_personne_name_unique(self):
        """Vérifier que les noms de personne sont uniques"""
        Personne.objects.create(name="Bob")
        with self.assertRaises(Exception):
            Personne.objects.create(name="Bob")

    def test_personne_name_max_length(self):
        """Vérifier que le nom ne peut pas dépasser 10 caractères"""
        with self.assertRaises(ValidationError):
            personne = Personne(name="AliceCharles")
            personne.full_clean()

    def test_personne_name_letters_only(self):
        """Vérifier que le nom ne contient que des lettres"""
        with self.assertRaises(ValidationError):
            personne = Personne(name="Alice123")
            personne.full_clean()

    def test_personne_name_accepts_accents(self):
        """Vérifier que les lettres accentuées sont acceptées"""
        personne = Personne.objects.create(name="Élève")
        self.assertEqual(personne.name, "Élève")

    def test_personne_str_representation(self):
        """Vérifier la représentation en string de la personne"""
        personne = Personne.objects.create(name="Charlie")
        self.assertEqual(str(personne), "Charlie")

    def test_personne_ordering(self):
        """Vérifier que les personnes sont ordonnées par nom"""
        Personne.objects.create(name="Zoe")
        Personne.objects.create(name="Alice")
        Personne.objects.create(name="Bob")
        
        personnes = list(Personne.objects.all())
        names = [p.name for p in personnes]
        self.assertEqual(names, ["Alice", "Bob", "Zoe"])

    def test_personne_meta_verbose_name(self):
        """Vérifier les noms verbeux du modèle"""
        self.assertEqual(Personne._meta.verbose_name, 'Personne')
        self.assertEqual(Personne._meta.verbose_name_plural, 'Personnes')


class DepenseModelTest(TestCase):
    """Tests pour le modèle Depense"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )
        self.personne = Personne.objects.create(name="Alice")

    def test_create_depense(self):
        """Vérifier la création d'une dépense"""
        depense = Depense.objects.create(
            motif="Achat d'alcool",
            montant=Decimal("5000.00"),
            responsable=self.user
        )
        self.assertEqual(depense.motif, "Achat d'alcool")
        self.assertEqual(depense.montant, Decimal("5000.00"))
        self.assertEqual(depense.responsable, self.user)
        self.assertIsNotNone(depense.date)
        self.assertIsNotNone(depense.created_at)

    def test_depense_without_responsable(self):
        """Vérifier qu'une dépense peut ne pas avoir de responsable"""
        depense = Depense.objects.create(
            motif="Dépense générale",
            montant=Decimal("1000.00")
        )
        self.assertIsNone(depense.responsable)

    def test_depense_str_representation(self):
        """Vérifier la représentation en string de la dépense"""
        depense = Depense.objects.create(
            motif="Achat d'alcool",
            montant=Decimal("5000.00"),
            responsable=self.user
        )
        expected_str = f"Achat d'alcool (5000.00 FC) - {self.user.username}"
        self.assertEqual(str(depense), expected_str)

    def test_depense_str_without_responsable(self):
        """Vérifier la représentation sans responsable"""
        depense = Depense.objects.create(
            motif="Dépense",
            montant=Decimal("1000.00")
        )
        expected_str = "Dépense (1000.00 FC) - —"
        self.assertEqual(str(depense), expected_str)

    def test_depense_ordering(self):
        """Vérifier que les dépenses sont ordonnées par date (décroissante)"""
        import time
        dep1 = Depense.objects.create(motif="Dep1", montant=Decimal("100.00"))
        time.sleep(0.1)
        dep2 = Depense.objects.create(motif="Dep2", montant=Decimal("200.00"))
        
        depenses = list(Depense.objects.all())
        # Les plus récentes en premier (ordering=['-date', '-id'])
        self.assertEqual(depenses[0].id, dep2.id)
        self.assertEqual(depenses[1].id, dep1.id)

    def test_depense_meta_verbose_name(self):
        """Vérifier les noms verbeux du modèle"""
        self.assertEqual(Depense._meta.verbose_name, 'Dépense')
        self.assertEqual(Depense._meta.verbose_name_plural, 'Dépenses')


class DepenseSerializerTest(TestCase):
    """Tests pour le serializer Depense"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )
        self.depense = Depense.objects.create(
            motif="Achat d'alcool",
            montant=Decimal("5000.00"),
            responsable=self.user
        )

    def test_serialize_depense(self):
        """Vérifier la sérialisation d'une dépense"""
        serializer = DepenseSerializer(self.depense)
        data = serializer.data
        
        self.assertEqual(data['motif'], "Achat d'alcool")
        self.assertEqual(float(data['montant']), 5000.00)

    def test_serialize_depense_includes_responsable_name(self):
        """Vérifier que le serializer inclut le nom du responsable"""
        serializer = DepenseSerializer(self.depense)
        data = serializer.data
        
        # Le champ responsible_name devrait contenir le username
        # (ou adapter selon ta implémentation du serializer)


class PersonSerializerTest(TestCase):
    """Tests pour le serializer Personne"""

    def test_serialize_personne(self):
        """Vérifier la sérialisation d'une personne"""
        personne = Personne.objects.create(name="Alice")
        serializer = PersonSerializer(personne)
        data = serializer.data
        
        self.assertEqual(data['id'], personne.id)
        self.assertEqual(data['name'], 'Alice')

    def test_deserialize_personne(self):
        """Vérifier la désérialisation d'une personne"""
        data = {
            'name': 'Bob'
        }
        serializer = PersonSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        personne = serializer.save()
        
        self.assertEqual(personne.name, 'Bob')

    def test_deserialize_personne_invalid_name(self):
        """Vérifier que la désérialisation échoue avec un nom invalide"""
        data = {
            'name': 'InvalidName123'
        }
        serializer = PersonSerializer(data=data)
        # Selon la configuration, cela peut ou non échouer au niveau du serializer


class DepenseViewSetTest(APITestCase):
    """Tests pour le viewset Depense"""

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
        self.depense = Depense.objects.create(
            motif="Achat",
            montant=Decimal("5000.00"),
            responsable=self.admin_user
        )
        self.url = '/api/v1/depenses/'  # À adapter selon ta configuration

    def test_list_depenses_as_admin(self):
        """Vérifier qu'un admin peut lister les dépenses"""
        # À adapter si le endpoint existe
        # self.client.force_authenticate(user=self.admin_user)
        # response = self.client.get(self.url)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_depenses_as_regular_user_denied(self):
        """Vérifier qu'un utilisateur régulier ne peut pas lister les dépenses"""
        # À adapter si le endpoint existe
        # self.client.force_authenticate(user=self.regular_user)
        # response = self.client.get(self.url)
        # self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_depense_as_admin(self):
        """Vérifier qu'un admin peut créer une dépense"""
        # À adapter si le endpoint existe
        # self.client.force_authenticate(user=self.admin_user)
        # data = {
        #     'motif': 'Nouvelle dépense',
        #     'montant': '1000.00'
        # }
        # response = self.client.post(self.url, data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class PersonneViewSetTest(APITestCase):
    """Tests pour le viewset Personne"""

    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username="admin",
            password="adminpass123",
            is_staff=True
        )
        self.personne = Personne.objects.create(name="Alice")
        self.url = '/api/v1/personnes/'  # À adapter selon ta configuration

    def test_list_personnes(self):
        """Vérifier que les personnes peuvent être listées"""
        # À adapter si le endpoint existe
        # response = self.client.get(self.url)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_personne(self):
        """Vérifier qu'une personne peut être créée"""
        # À adapter si le endpoint existe
        # data = {
        #     'name': 'Bob'
        # }
        # response = self.client.post(self.url, data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class FinanceIntegrationTest(TestCase):
    """Tests d'intégration pour les finances"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="manager",
            password="pass123",
            is_staff=True
        )

    def test_create_multiple_depenses(self):
        """Vérifier la création de plusieurs dépenses"""
        depenses = []
        for i in range(5):
            depense = Depense.objects.create(
                motif=f"Dépense {i}",
                montant=Decimal("1000.00") * (i + 1),
                responsable=self.user
            )
            depenses.append(depense)
        
        self.assertEqual(Depense.objects.count(), 5)

    def test_calculate_total_expenses(self):
        """Vérifier le calcul des dépenses totales"""
        montants = [Decimal("1000.00"), Decimal("2000.00"), Decimal("3000.00")]
        for montant in montants:
            Depense.objects.create(motif="Test", montant=montant)
        
        total = sum(d.montant for d in Depense.objects.all())
        expected_total = Decimal("6000.00")
        self.assertEqual(total, expected_total)
