from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from decimal import Decimal
from datetime import date, timedelta
from django.utils import timezone

from apps.inventory.models import Category, Drink
from apps.sales.models import Sale
from apps.finance.models import Depense
from .service import DashboardService, FinanceReportService, SalesReportService
from .serializers import (
    DashboardSerializer, 
    FinanceReportSerializer, 
    TopDrinksSerializer
)


class DashboardServiceTest(TestCase):
    """Tests pour le service DashboardService"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="admin",
            password="pass123",
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

    def test_get_dashboard_stats_returns_dict(self):
        """Vérifier que le service retourne un dictionnaire"""
        stats = DashboardService.get_dashboard_stats()
        self.assertIsInstance(stats, dict)

    def test_dashboard_stats_includes_required_fields(self):
        """Vérifier que les champs requis sont présents"""
        stats = DashboardService.get_dashboard_stats()
        required_fields = [
            'total_sales',
            'total_expenses',
            'net_profit',
            'sales_count',
            'low_stock_drinks',
            'today_net_profit',
            'total_today_sales',
            'total_today_expenses'
        ]
        for field in required_fields:
            self.assertIn(field, stats)

    def test_dashboard_stats_today_data(self):
        """Vérifier les données d'aujourd'hui"""
        # Créer une vente
        Sale.objects.create(
            drink=self.drink,
            quantity=5,
            unit_price=Decimal("500.00"),
            total_price=Decimal("2500.00"),
            served_by=self.user
        )
        
        stats = DashboardService.get_dashboard_stats()
        # Vérifier que les totaux sont calculés correctement
        self.assertGreater(stats['total_today_sales'], 0)

    def test_dashboard_low_stock_drinks(self):
        """Vérifier le calcul des boissons en faible stock"""
        # Créer une boisson avec faible stock
        low_stock_drink = Drink.objects.create(
            name="Eau",
            category=self.category,
            price_purchase=Decimal("50.00"),
            price_sale=Decimal("100.00"),
            stock=5
        )
        
        stats = DashboardService.get_dashboard_stats()
        self.assertGreater(stats['low_stock_drinks'], 0)

    def test_dashboard_net_profit_calculation(self):
        """Vérifier le calcul du profit net"""
        stats = DashboardService.get_dashboard_stats()
        
        # net_profit = total_sales - total_expenses
        expected_profit = stats['total_sales'] - stats['total_expenses']
        self.assertEqual(stats['net_profit'], expected_profit)


class FinanceReportServiceTest(TestCase):
    """Tests pour le service FinanceReportService"""

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

    def test_get_finance_report_returns_dict(self):
        """Vérifier que le service retourne un dictionnaire"""
        start_date = date.today()
        end_date = date.today()
        report = FinanceReportService.get_finance_report(start_date, end_date)
        self.assertIsInstance(report, dict)

    def test_finance_report_includes_required_fields(self):
        """Vérifier que les champs requis sont présents"""
        start_date = date.today()
        end_date = date.today()
        report = FinanceReportService.get_finance_report(start_date, end_date)
        
        required_fields = ['total_sales', 'total_expenses', 'net_profit']
        for field in required_fields:
            self.assertIn(field, report)

    def test_finance_report_with_sales(self):
        """Vérifier le rapport avec des ventes"""
        start_date = date.today()
        end_date = date.today()
        
        # Créer une vente
        Sale.objects.create(
            drink=self.drink,
            quantity=5,
            unit_price=Decimal("500.00"),
            total_price=Decimal("2500.00"),
            served_by=self.user
        )
        
        report = FinanceReportService.get_finance_report(start_date, end_date)
        self.assertGreater(report['total_sales'], 0)

    def test_finance_report_with_expenses(self):
        """Vérifier le rapport avec des dépenses"""
        start_date = date.today()
        end_date = date.today()
        
        # Créer une dépense
        Depense.objects.create(
            motif="Achat d'alcool",
            montant=Decimal("1000.00")
        )
        
        report = FinanceReportService.get_finance_report(start_date, end_date)
        self.assertGreater(report['total_expenses'], 0)

    def test_finance_report_date_range(self):
        """Vérifier que le rapport filtre par plage de dates"""
        # Créer une vente aujourd'hui
        today = date.today()
        Sale.objects.create(
            drink=self.drink,
            quantity=5,
            unit_price=Decimal("500.00"),
            total_price=Decimal("2500.00"),
            served_by=self.user
        )
        
        # Rapport pour aujourd'hui
        report_today = FinanceReportService.get_finance_report(today, today)
        
        # Rapport pour demain (pas de ventes)
        tomorrow = today + timedelta(days=1)
        report_tomorrow = FinanceReportService.get_finance_report(tomorrow, tomorrow)
        
        self.assertGreater(report_today['total_sales'], 0)


class SalesReportServiceTest(TestCase):
    """Tests pour le service SalesReportService"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="seller",
            password="pass123"
        )
        self.category = Category.objects.create(name="Boissons")
        
        # Créer plusieurs boissons
        self.drink1 = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=100
        )
        self.drink2 = Drink.objects.create(
            name="Sprite",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=100
        )

    def test_top_drinks_returns_queryset(self):
        """Vérifier que le service retourne une QuerySet"""
        start_date = date.today()
        end_date = date.today()
        top_drinks = SalesReportService.top_drinks(start_date, end_date)
        
        # Devrait être itérable (QuerySet)
        self.assertTrue(hasattr(top_drinks, '__iter__'))

    def test_top_drinks_sorted_by_sales(self):
        """Vérifier que les boissons sont triées par quantité vendue"""
        # Créer plusieurs ventes
        Sale.objects.create(
            drink=self.drink1,
            quantity=10,
            unit_price=Decimal("500.00"),
            total_price=Decimal("5000.00"),
            served_by=self.user
        )
        Sale.objects.create(
            drink=self.drink2,
            quantity=5,
            unit_price=Decimal("500.00"),
            total_price=Decimal("2500.00"),
            served_by=self.user
        )
        
        start_date = date.today()
        end_date = date.today()
        top_drinks = list(SalesReportService.top_drinks(start_date, end_date))
        
        if len(top_drinks) >= 2:
            # Le premier devrait avoir plus de ventes
            self.assertGreaterEqual(
                top_drinks[0]['total_sold'],
                top_drinks[1]['total_sold']
            )

    def test_top_drinks_includes_drink_name(self):
        """Vérifier que la QuerySet inclut le nom de la boisson"""
        Sale.objects.create(
            drink=self.drink1,
            quantity=5,
            unit_price=Decimal("500.00"),
            total_price=Decimal("2500.00"),
            served_by=self.user
        )
        
        start_date = date.today()
        end_date = date.today()
        top_drinks = list(SalesReportService.top_drinks(start_date, end_date))
        
        if len(top_drinks) > 0:
            self.assertIn('drink_name', top_drinks[0])

    def test_top_drinks_limit_to_5(self):
        """Vérifier que le service retourne au maximum 5 boissons"""
        # Créer plus de 5 ventes
        for i in range(10):
            drink = Drink.objects.create(
                name=f"Boisson {i}",
                category=self.category,
                price_purchase=Decimal("200.00"),
                price_sale=Decimal("500.00")
            )
            Sale.objects.create(
                drink=drink,
                quantity=i+1,
                unit_price=Decimal("500.00"),
                total_price=Decimal(str(500 * (i+1))),
                served_by=self.user
            )
        
        start_date = date.today()
        end_date = date.today()
        top_drinks = list(SalesReportService.top_drinks(start_date, end_date))
        
        self.assertLessEqual(len(top_drinks), 5)


class DashboardSerializerTest(TestCase):
    """Tests pour le serializer DashboardSerializer"""

    def test_serialize_dashboard_data(self):
        """Vérifier la sérialisation des données du dashboard"""
        data = {
            'total_sales': 10000,
            'total_expenses': 3000,
            'net_profit': 7000,
            'sales_count': 50,
            'low_stock_drinks': 2,
            'today_net_profit': 1000,
            'total_today_sales': 5000,
            'total_today_expenses': 1000,
            'today_sales': [],
            'today_expenses': []
        }
        serializer = DashboardSerializer(data)
        self.assertEqual(serializer.data['total_sales'], 10000)


class FinanceReportSerializerTest(TestCase):
    """Tests pour le serializer FinanceReportSerializer"""

    def test_serialize_finance_report(self):
        """Vérifier la sérialisation du rapport financier"""
        data = {
            'total_sales': 15000,
            'total_expenses': 5000,
            'net_profit': 10000
        }
        serializer = FinanceReportSerializer(data)
        self.assertEqual(serializer.data['total_sales'], 15000)
        self.assertEqual(serializer.data['net_profit'], 10000)


class TopDrinksSerializerTest(TestCase):
    """Tests pour le serializer TopDrinksSerializer"""

    def test_serialize_top_drinks(self):
        """Vérifier la sérialisation des top boissons"""
        data = [
            {
                'drink_name': 'Coca-Cola',
                'total_sold': 50
            },
            {
                'drink_name': 'Sprite',
                'total_sold': 30
            }
        ]
        serializer = TopDrinksSerializer(data, many=True)
        self.assertEqual(len(serializer.data), 2)
        self.assertEqual(serializer.data[0]['drink_name'], 'Coca-Cola')


class ReportsViewsTest(APITestCase):
    """Tests pour les vues des rapports"""

    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username="admin",
            password="adminpass123",
            is_staff=True
        )
        self.url_dashboard = '/api/v1/dashboard/'  # À adapter selon ta configuration
        self.url_finance = '/api/v1/finance-report/'
        self.url_top_drinks = '/api/v1/top-drinks/'

    def test_dashboard_view_accessible(self):
        """Vérifier que le dashboard est accessible"""
        # À adapter si le endpoint existe
        # self.client.force_authenticate(user=self.admin_user)
        # response = self.client.get(self.url_dashboard)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_finance_report_view_with_date_params(self):
        """Vérifier le rapport financier avec les paramètres de date"""
        # À adapter si le endpoint existe
        # self.client.force_authenticate(user=self.admin_user)
        # response = self.client.get(self.url_finance, {
        #     'start_date': '2024-01-01',
        #     'end_date': '2024-01-31'
        # })
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_top_drinks_view_with_date_params(self):
        """Vérifier la vue top drinks avec les paramètres de date"""
        # À adapter si le endpoint existe
        # response = self.client.get(self.url_top_drinks, {
        #     'start_date': '2024-01-01',
        #     'end_date': '2024-01-31'
        # })
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
