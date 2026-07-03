from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from decimal import Decimal

from .models import Category, Ingredient, Drink, DrinkIngredient
from .serializers import BoissonSerializer
from .services import InventoryService


class CategoryModelTest(TestCase):
    """Tests pour le modèle Category"""

    def test_create_category(self):
        """Vérifier la création d'une catégorie"""
        category = Category.objects.create(
            name="Boissons alcoolisées",
            description="Toutes les boissons alcoolisées"
        )
        self.assertEqual(category.name, "Boissons alcoolisées")
        self.assertEqual(category.description, "Toutes les boissons alcoolisées")
        self.assertIsNotNone(category.created_at)
        self.assertIsNotNone(category.updated_at)

    def test_category_name_unique(self):
        """Vérifier que les noms de catégorie sont uniques"""
        Category.objects.create(name="Bière")
        with self.assertRaises(Exception):
            Category.objects.create(name="Bière")

    def test_category_str_representation(self):
        """Vérifier la représentation en string de la catégorie"""
        category = Category.objects.create(name="Vin")
        self.assertEqual(str(category), "Vin")

    def test_category_description_optional(self):
        """Vérifier que la description est optionnelle"""
        category = Category.objects.create(name="Eau")
        self.assertEqual(category.description, "")


class IngredientModelTest(TestCase):
    """Tests pour le modèle Ingredient"""

    def test_create_ingredient(self):
        """Vérifier la création d'un ingrédient"""
        ingredient = Ingredient.objects.create(
            name="Glaçon",
            quantity=100,
            unit="g"
        )
        self.assertEqual(ingredient.name, "Glaçon")
        self.assertEqual(ingredient.quantity, 100)
        self.assertEqual(ingredient.unit, "g")

    def test_ingredient_str_representation(self):
        """Vérifier la représentation en string de l'ingrédient"""
        ingredient = Ingredient.objects.create(
            name="Sucre",
            quantity=50,
            unit="g"
        )
        self.assertEqual(str(ingredient), "Sucre (50 g)")

    def test_ingredient_quantity_default(self):
        """Vérifier que la quantité par défaut est 0"""
        ingredient = Ingredient.objects.create(
            name="Citron",
            unit="pièce"
        )
        self.assertEqual(ingredient.quantity, 0)


class DrinkModelTest(TestCase):
    """Tests pour le modèle Drink"""

    def setUp(self):
        self.category = Category.objects.create(name="Boissons")

    def test_create_drink(self):
        """Vérifier la création d'une boisson"""
        drink = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=100,
            volume="33cl"
        )
        self.assertEqual(drink.name, "Coca-Cola")
        self.assertEqual(drink.price_purchase, Decimal("200.00"))
        self.assertEqual(drink.price_sale, Decimal("500.00"))
        self.assertEqual(drink.stock, 100)

    def test_drink_name_unique(self):
        """Vérifier que les noms de boisson sont uniques"""
        Drink.objects.create(
            name="Sprite",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00")
        )
        with self.assertRaises(Exception):
            Drink.objects.create(
                name="Sprite",
                category=self.category,
                price_purchase=Decimal("200.00"),
                price_sale=Decimal("500.00")
            )

    def test_drink_benefice_unitaire(self):
        """Vérifier le calcul du bénéfice unitaire"""
        drink = Drink.objects.create(
            name="Fanta",
            category=self.category,
            price_purchase=Decimal("150.00"),
            price_sale=Decimal("400.00")
        )
        expected_benefice = Decimal("250.00")
        self.assertEqual(drink.benefice_unitaire(), expected_benefice)

    def test_drink_str_representation(self):
        """Vérifier la représentation en string de la boisson"""
        drink = Drink.objects.create(
            name="Sprite",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00")
        )
        self.assertEqual(str(drink), "Sprite (500.00 FC)")

    def test_drink_price_validators(self):
        """Vérifier que les prix ne peuvent pas être négatifs"""
        from django.core.exceptions import ValidationError
        
        drink = Drink(
            name="Test",
            category=self.category,
            price_purchase=Decimal("-100.00"),
            price_sale=Decimal("500.00")
        )
        # Les validateurs sont appelés lors de full_clean()
        with self.assertRaises(ValidationError):
            drink.full_clean()

    def test_drink_stock_validator(self):
        """Vérifier que le stock ne peut pas être négatif"""
        from django.core.exceptions import ValidationError
        
        drink = Drink(
            name="Test",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=-10
        )
        with self.assertRaises(ValidationError):
            drink.full_clean()

    def test_drink_category_null(self):
        """Vérifier qu'une boisson peut ne pas avoir de catégorie"""
        drink = Drink.objects.create(
            name="Boisson générique",
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00")
        )
        self.assertIsNone(drink.category)


class DrinkIngredientModelTest(TestCase):
    """Tests pour le modèle DrinkIngredient"""

    def setUp(self):
        self.category = Category.objects.create(name="Boissons")
        self.drink = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00")
        )
        self.ingredient = Ingredient.objects.create(
            name="Glaçon",
            quantity=100,
            unit="g"
        )

    def test_create_drink_ingredient(self):
        """Vérifier la création d'une relation drink-ingredient"""
        drink_ingredient = DrinkIngredient.objects.create(
            drink=self.drink,
            ingredient=self.ingredient,
            quantity_used=10
        )
        self.assertEqual(drink_ingredient.drink, self.drink)
        self.assertEqual(drink_ingredient.ingredient, self.ingredient)
        self.assertEqual(drink_ingredient.quantity_used, 10)

    def test_drink_ingredient_unique_together(self):
        """Vérifier que la combinaison drink-ingredient est unique"""
        DrinkIngredient.objects.create(
            drink=self.drink,
            ingredient=self.ingredient,
            quantity_used=10
        )
        with self.assertRaises(Exception):
            DrinkIngredient.objects.create(
                drink=self.drink,
                ingredient=self.ingredient,
                quantity_used=20
            )

    def test_drink_ingredient_cascade_delete(self):
        """Vérifier que supprimer un drink supprime ses relations"""
        DrinkIngredient.objects.create(
            drink=self.drink,
            ingredient=self.ingredient,
            quantity_used=10
        )
        drink_id = self.drink.id
        self.drink.delete()
        self.assertEqual(DrinkIngredient.objects.filter(drink_id=drink_id).count(), 0)


class DrinkSerializerTest(TestCase):
    """Tests pour le serializer Drink"""

    def setUp(self):
        self.category = Category.objects.create(name="Boissons")
        self.drink = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=100
        )

    def test_serialize_drink(self):
        """Vérifier la sérialisation d'une boisson"""
        serializer = BoissonSerializer(self.drink)
        data = serializer.data
        
        self.assertEqual(data['id'], self.drink.id)
        self.assertEqual(data['name'], 'Coca-Cola')
        self.assertEqual(float(data['price_purchase']), 200.00)
        self.assertEqual(float(data['price_sale']), 500.00)
        self.assertEqual(data['stock'], 100)

    def test_serializer_includes_benefice_unitaire(self):
        """Vérifier que le serializer inclut le bénéfice unitaire"""
        serializer = BoissonSerializer(self.drink)
        data = serializer.data
        
        expected_benefice = float(Decimal("300.00"))
        self.assertEqual(float(data['benefice_unitaire']), expected_benefice)


class InventoryServiceTest(TestCase):
    """Tests pour le service InventoryService"""

    def setUp(self):
        self.category = Category.objects.create(name="Boissons")
        self.drink = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=100
        )

    def test_add_stock(self):
        """Vérifier l'ajout de stock"""
        initial_stock = self.drink.stock
        InventoryService.add_stock(self.drink.id, 50)
        
        updated_drink = Drink.objects.get(id=self.drink.id)
        self.assertEqual(updated_drink.stock, initial_stock + 50)

    def test_remove_stock(self):
        """Vérifier la suppression de stock"""
        initial_stock = self.drink.stock
        InventoryService.remove_stock(self.drink.id, 30)
        
        updated_drink = Drink.objects.get(id=self.drink.id)
        self.assertEqual(updated_drink.stock, initial_stock - 30)

    def test_remove_stock_insufficient(self):
        """Vérifier que la suppression échoue si stock insuffisant"""
        self.drink.stock = 10
        self.drink.save()
        
        with self.assertRaises(ValueError) as context:
            InventoryService.remove_stock(self.drink.id, 50)
        
        self.assertIn("Stock insuffisant", str(context.exception))

    def test_update_stock_add(self):
        """Vérifier la mise à jour du stock avec l'action 'add'"""
        initial_stock = self.drink.stock
        InventoryService.update_stock(self.drink.id, 25, "add")
        
        updated_drink = Drink.objects.get(id=self.drink.id)
        self.assertEqual(updated_drink.stock, initial_stock + 25)

    def test_update_stock_remove(self):
        """Vérifier la mise à jour du stock avec l'action 'remove'"""
        initial_stock = self.drink.stock
        InventoryService.update_stock(self.drink.id, 15, "remove")
        
        updated_drink = Drink.objects.get(id=self.drink.id)
        self.assertEqual(updated_drink.stock, initial_stock - 15)

    def test_update_stock_invalid_action(self):
        """Vérifier que les actions invalides levent une erreur"""
        with self.assertRaises(ValueError) as context:
            InventoryService.update_stock(self.drink.id, 10, "invalid")
        
        self.assertIn("Action invalide", str(context.exception))


class DrinkViewSetTest(APITestCase):
    """Tests pour le viewset Drink"""

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
        self.category = Category.objects.create(name="Boissons")
        self.drink = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=100
        )
        self.url = '/api/v1/drinks/'  # À adapter selon ta configuration

    def test_list_drinks(self):
        """Vérifier que les boissons peuvent être listées"""
        # À adapter si le endpoint existe
        # response = self.client.get(self.url)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # self.assertEqual(len(response.data), 1)

    def test_create_drink_as_admin(self):
        """Vérifier qu'un admin peut créer une boisson"""
        # À adapter si le endpoint existe
        # self.client.force_authenticate(user=self.admin_user)
        # data = {
        #     'name': 'Sprite',
        #     'price_purchase': '200.00',
        #     'price_sale': '500.00',
        #     'stock': 100
        # }
        # response = self.client.post(self.url, data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_drink_as_regular_user_denied(self):
        """Vérifier qu'un utilisateur régulier ne peut pas créer une boisson"""
        # À adapter si le endpoint existe
        # self.client.force_authenticate(user=self.regular_user)
        # data = {
        #     'name': 'Fanta',
        #     'price_purchase': '200.00',
        #     'price_sale': '500.00'
        # }
        # response = self.client.post(self.url, data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_drink(self):
        """Vérifier qu'une boisson peut être récupérée"""
        # À adapter si le endpoint existe
        # url = f'{self.url}{self.drink.id}/'
        # response = self.client.get(url)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_drink_as_admin(self):
        """Vérifier qu'un admin peut mettre à jour une boisson"""
        # À adapter si le endpoint existe
        # self.client.force_authenticate(user=self.admin_user)
        # url = f'{self.url}{self.drink.id}/'
        # data = {'name': 'Coca-Cola Updated', 'price_sale': '600.00'}
        # response = self.client.patch(url, data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_drink_as_admin(self):
        """Vérifier qu'un admin peut supprimer une boisson"""
        # À adapter si le endpoint existe
        # self.client.force_authenticate(user=self.admin_user)
        # url = f'{self.url}{self.drink.id}/'
        # response = self.client.delete(url)
        # self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
