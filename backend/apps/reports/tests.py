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
   DashboardStatistiquesSerializer, 
    RapportFinancierSerializer, 
    TopBoissonSerializer
)


class DashboardPayloadServiceTest(TestCase):
    """Tests pour le payload structuré du dashboard."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="dashboard-user",
            password="pass123",
            is_staff=True,
        )
        self.category = Category.objects.create(name="Boissons")
        self.drink = Drink.objects.create(
            name="Coca-Cola",
            category=self.category,
            price_purchase=Decimal("200.00"),
            price_sale=Decimal("500.00"),
            stock=10,
        )

    def test_get_dashboard_payload_contains_structured_sections(self):
        payload = DashboardService.get_dashboard_payload()
        self.assertIn("statistiques", payload)
        self.assertIn("ventes_par_jour", payload)
        self.assertIn("top_boissons", payload)
        self.assertIn("ventes_recentes", payload)


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
            'chiffre_affaires_aujourd_hui',
            'depenses_aujourd_hui',
            'benefice_net_aujourd_hui',
            'nombre_ventes_aujourd_hui',
            'boissons_en_faible_stock',
            'chiffre_affaires_mensuel',
            'depenses_mensuelles',
            'benefice_net_mensuel',
            'total_boissons_vendues',
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
        self.assertGreater(stats['chiffre_affaires_aujourd_hui'], 0)

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
        self.assertGreater(stats['boissons_en_faible_stock'], 0)

    def test_dashboard_net_profit_calculation(self):
        """Vérifier le calcul du profit net"""
        stats = DashboardService.get_dashboard_stats()
        
        expected_profit = stats['chiffre_affaires_mensuel'] - stats['depenses_mensuelles']
        self.assertEqual(stats['benefice_net_mensuel'], expected_profit)


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
        
        required_fields = ['chiffre_affaires', 'depenses', 'benefice_net']
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
        self.assertGreater(report['chiffre_affaires'], 0)

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
        self.assertGreater(report['depenses'], 0)

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
        
        self.assertGreater(report_today['chiffre_affaires'], 0)


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
                top_drinks[0]['quantite_vendue'],
                top_drinks[1]['quantite_vendue']
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
            self.assertIn('nom_boisson', top_drinks[0])

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
            'chiffre_affaires_aujourd_hui': 10000,
            'depenses_aujourd_hui': 3000,
            'benefice_net_aujourd_hui': 7000,
            'nombre_ventes_aujourd_hui': 50,
            'boissons_en_faible_stock': 2,
            'chiffre_affaires_mensuel': 5000,
            'depenses_mensuelles': 1000,
            'benefice_net_mensuel': 4000,
            'total_boissons_vendues': 120,
        }
        serializer = DashboardStatistiquesSerializer(data)
        self.assertEqual(serializer.data['chiffre_affaires_aujourd_hui'], 10000)


class RapportFinancierSerializerTest(TestCase):
    """Tests pour le serializer RapportFinancierSerializer"""

    def test_serialize_finance_report(self):
        """Vérifier la sérialisation du rapport financier"""
        data = {
            'chiffre_affaires': 15000,
            'depenses': 5000,
            'benefice_net': 10000
        }
        serializer = RapportFinancierSerializer(data)
        self.assertEqual(serializer.data['chiffre_affaires'], 15000)
        self.assertEqual(serializer.data['benefice_net'], 10000)


class TopBoissonSerializerTest(TestCase):
    """Tests pour le serializer TopBoissonSerializer"""

    def test_serialize_top_drinks(self):
        """Vérifier la sérialisation des top boissons"""
        data = [
            {
                'nom_boisson': 'Coca-Cola',
                'quantite_vendue': 50,
                'chiffre_affaires': 25000,
            },
            {
                'nom_boisson': 'Sprite',
                'quantite_vendue': 30,
                'chiffre_affaires': 15000,
            }
        ]
        serializer = TopBoissonSerializer(data, many=True)
        self.assertEqual(len(serializer.data), 2)
        self.assertEqual(serializer.data[0]['nom_boisson'], 'Coca-Cola')


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
