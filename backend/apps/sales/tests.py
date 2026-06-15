from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from decimal import Decimal
from django.utils import timezone

from apps.inventory.models import Category, Drink
from .models import Sale, SaleItem
from .serializers import SaleSerializer, SaleCreateSerializer
from .services import SaleService


class SaleModelTest(TestCase):
    """Tests pour le modèle Sale"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="seller",
            password="pass123"
        )
        self.category = Category.objects.create(name="Boissons")
        self.drink = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=100
        )

    def test_create_sale(self):
        """Vérifier la création d'une vente"""
        sale = Sale.objects.create(
            drink=self.drink,
            quantity=5,
            unit_price=Decimal("500.00"),
            total_price=Decimal("2500.00"),
            served_by=self.user
        )
        self.assertEqual(sale.drink, self.drink)
        self.assertEqual(sale.quantity, 5)
        self.assertEqual(sale.unit_price, Decimal("500.00"))
        self.assertEqual(sale.total_price, Decimal("2500.00"))
        self.assertEqual(sale.served_by, self.user)
        self.assertIsNotNone(sale.created_at)

    def test_sale_save_updates_price(self):
        """Vérifier que la sauvegarde met à jour les prix"""
        sale = Sale(
            drink=self.drink,
            quantity=3,
            served_by=self.user
        )
        sale.save()
        
        expected_total = self.drink.price_sale * 3
        self.assertEqual(sale.total_price, expected_total)
        self.assertEqual(sale.unit_price, self.drink.price_sale)

    def test_sale_str_representation(self):
        """Vérifier la représentation en string de la vente"""
        sale = Sale.objects.create(
            drink=self.drink,
            quantity=2,
            unit_price=Decimal("500.00"),
            total_price=Decimal("1000.00"),
            served_by=self.user
        )
        expected_str = f"Coca-Cola (2) - 1000.00 FC"
        self.assertEqual(str(sale), expected_str)

    def test_sale_with_null_served_by(self):
        """Vérifier qu'une vente peut ne pas avoir de vendeur"""
        sale = Sale.objects.create(
            drink=self.drink,
            quantity=1,
            unit_price=Decimal("500.00"),
            total_price=Decimal("500.00")
        )
        self.assertIsNone(sale.served_by)


class SaleItemModelTest(TestCase):
    """Tests pour le modèle SaleItem"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="seller",
            password="pass123"
        )
        self.category = Category.objects.create(name="Boissons")
        self.drink = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=100
        )
        self.sale = Sale.objects.create(
            drink=self.drink,
            quantity=5,
            unit_price=Decimal("500.00"),
            total_price=Decimal("2500.00"),
            served_by=self.user
        )

    def test_create_sale_item(self):
        """Vérifier la création d'un article de vente"""
        sale_item = SaleItem.objects.create(
            sale=self.sale,
            drink=self.drink,
            quantity=3,
            unit_price=Decimal("500.00"),
            total_price=Decimal("1500.00")
        )
        self.assertEqual(sale_item.sale, self.sale)
        self.assertEqual(sale_item.drink, self.drink)
        self.assertEqual(sale_item.quantity, 3)

    def test_sale_item_save_updates_price(self):
        """Vérifier que la sauvegarde met à jour les prix"""
        sale_item = SaleItem(
            sale=self.sale,
            drink=self.drink,
            quantity=2
        )
        sale_item.save()
        
        expected_total = self.drink.price_sale * 2
        self.assertEqual(sale_item.total_price, expected_total)
        self.assertEqual(sale_item.unit_price, self.drink.price_sale)

    def test_sale_item_str_representation(self):
        """Vérifier la représentation en string de l'article"""
        sale_item = SaleItem.objects.create(
            sale=self.sale,
            drink=self.drink,
            quantity=1,
            unit_price=Decimal("500.00"),
            total_price=Decimal("500.00")
        )
        expected_str = f"Coca-Cola (1) - 500.00 FC"
        self.assertEqual(str(sale_item), expected_str)

    def test_sale_item_cascade_delete(self):
        """Vérifier que supprimer une vente supprime ses articles"""
        SaleItem.objects.create(
            sale=self.sale,
            drink=self.drink,
            quantity=1,
            unit_price=Decimal("500.00"),
            total_price=Decimal("500.00")
        )
        sale_id = self.sale.id
        self.sale.delete()
        self.assertEqual(SaleItem.objects.filter(sale_id=sale_id).count(), 0)


class SaleSerializerTest(TestCase):
    """Tests pour le serializer Sale"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="seller",
            password="pass123"
        )
        self.category = Category.objects.create(name="Boissons")
        self.drink = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=100
        )
        self.sale = Sale.objects.create(
            drink=self.drink,
            quantity=2,
            unit_price=Decimal("500.00"),
            total_price=Decimal("1000.00"),
            served_by=self.user
        )

    def test_serialize_sale(self):
        """Vérifier la sérialisation d'une vente"""
        serializer = SaleSerializer(self.sale)
        data = serializer.data
        
        self.assertEqual(data['id'], self.sale.id)
        self.assertEqual(data['quantity'], 2)
        self.assertEqual(float(data['unit_price']), 500.00)


class SaleCreateSerializerTest(TestCase):
    """Tests pour le serializer SaleCreateSerializer"""

    def setUp(self):
        self.category = Category.objects.create(name="Boissons")
        self.drink = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=100
        )

    def test_validate_sale_create_with_drink_id(self):
        """Vérifier la validation avec drink_id"""
        data = {
            'drink_id': self.drink.id,
            'quantity': 5
        }
        serializer = SaleCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_validate_sale_create_with_drink(self):
        """Vérifier la validation avec drink"""
        data = {
            'drink': self.drink.id,
            'quantity': 5
        }
        serializer = SaleCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_validate_sale_create_missing_drink(self):
        """Vérifier que drink ou drink_id est requis"""
        data = {
            'quantity': 5
        }
        serializer = SaleCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)

    def test_validate_quantity_min_value(self):
        """Vérifier que la quantité doit être >= 1"""
        data = {
            'drink_id': self.drink.id,
            'quantity': 0
        }
        serializer = SaleCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())


class SaleServiceTest(TestCase):
    """Tests pour le service SaleService"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="seller",
            password="pass123"
        )
        self.category = Category.objects.create(name="Boissons")
        self.drink = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=100
        )

    def test_create_sale_success(self):
        """Vérifier la création d'une vente avec le service"""
        initial_stock = self.drink.stock
        sale = SaleService.create_sale(
            drink_id=self.drink.id,
            quantity=10,
            seller=self.user
        )
        
        self.assertIsNotNone(sale)
        self.assertEqual(sale.quantity, 10)
        self.assertEqual(sale.served_by, self.user)
        
        # Vérifier que le stock a été réduit
        updated_drink = Drink.objects.get(id=self.drink.id)
        self.assertEqual(updated_drink.stock, initial_stock - 10)

    def test_create_sale_insufficient_stock(self):
        """Vérifier que la création échoue si stock insuffisant"""
        self.drink.stock = 5
        self.drink.save()
        
        with self.assertRaises(ValueError) as context:
            SaleService.create_sale(
                drink_id=self.drink.id,
                quantity=10,
                seller=self.user
            )
        
        self.assertIn("Stock insuffisant", str(context.exception))

    def test_create_sale_reduces_stock(self):
        """Vérifier que créer une vente réduit le stock"""
        initial_stock = self.drink.stock
        SaleService.create_sale(
            drink_id=self.drink.id,
            quantity=20,
            seller=self.user
        )
        
        updated_drink = Drink.objects.get(id=self.drink.id)
        self.assertEqual(updated_drink.stock, initial_stock - 20)


class SaleViewSetTest(APITestCase):
    """Tests pour le viewset Sale"""

    def setUp(self):
        self.client = APIClient()
        self.seller_user = User.objects.create_user(
            username="seller",
            password="pass123",
            is_staff=False
        )
        self.admin_user = User.objects.create_user(
            username="admin",
            password="adminpass123",
            is_staff=True
        )
        self.category = Category.objects.create(name="Boissons")
        self.drink = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=100
        )
        self.url = '/api/v1/sales/'  # À adapter selon ta configuration

    def test_list_sales(self):
        """Vérifier que les ventes peuvent être listées"""
        # À adapter si le endpoint existe
        # response = self.client.get(self.url)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_sale_as_seller(self):
        """Vérifier qu'un vendeur peut créer une vente"""
        # À adapter si le endpoint existe
        # self.client.force_authenticate(user=self.seller_user)
        # data = {
        #     'drink_id': self.drink.id,
        #     'quantity': 5
        # }
        # response = self.client.post(self.url, data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_sale_without_authentication(self):
        """Vérifier qu'une vente ne peut pas être créée sans authentification"""
        # À adapter si le endpoint existe
        # data = {
        #     'drink_id': self.drink.id,
        #     'quantity': 5
        # }
        # response = self.client.post(self.url, data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
