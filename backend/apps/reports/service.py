from django.db.models import Sum, Count, F
from django.utils import timezone
from django.db.models.functions import TruncDate

from apps.sales.models import Sale
from apps.finance.models import Depense
from apps.inventory.models import Drink


class DashboardService:
    @staticmethod
    def get_dashboard_stats():
        aujourd_hui = timezone.localdate()
        debut_mois = aujourd_hui.replace(day=1)
        fin_mois = (debut_mois.replace(day=28) + timezone.timedelta(days=4)).replace(day=1) - timezone.timedelta(days=1)

        ventes_aujourd_hui = Sale.objects.filter(created_at__date=aujourd_hui)
        depenses_aujourd_hui = Depense.objects.filter(date=aujourd_hui)
        ventes_mois = Sale.objects.filter(created_at__date__range=(debut_mois, fin_mois))
        depenses_mois = Depense.objects.filter(date__range=(debut_mois, fin_mois))

        chiffre_affaires_aujourd_hui = ventes_aujourd_hui.aggregate(total=Sum("total_price"))["total"] or 0
        depenses_aujourd_hui_total = depenses_aujourd_hui.aggregate(total=Sum("montant"))["total"] or 0
        chiffre_affaires_mensuel = ventes_mois.aggregate(total=Sum("total_price"))["total"] or 0
        depenses_mensuelles = depenses_mois.aggregate(total=Sum("montant"))["total"] or 0
        total_boissons_vendues = ventes_mois.aggregate(total=Sum("quantity"))["total"] or 0

        return {
            "chiffre_affaires_aujourd_hui": float(chiffre_affaires_aujourd_hui),
            "depenses_aujourd_hui": float(depenses_aujourd_hui_total),
            "benefice_net_aujourd_hui": float(chiffre_affaires_aujourd_hui - depenses_aujourd_hui_total),
            "nombre_ventes_aujourd_hui": ventes_aujourd_hui.count(),
            "boissons_en_faible_stock": Drink.objects.filter(stock__lte=10).count(),
            "chiffre_affaires_mensuel": float(chiffre_affaires_mensuel),
            "depenses_mensuelles": float(depenses_mensuelles),
            "benefice_net_mensuel": float(chiffre_affaires_mensuel - depenses_mensuelles),
            "total_boissons_vendues": int(total_boissons_vendues),
        }

    @staticmethod
    def get_dashboard_payload():
        aujourd_hui = timezone.localdate()
        debut_mois = aujourd_hui.replace(day=1)
        fin_mois = (debut_mois.replace(day=28) + timezone.timedelta(days=4)).replace(day=1) - timezone.timedelta(days=1)

        return {
            "statistiques": DashboardService.get_dashboard_stats(),
            "rapport_financier": FinanceReportService.get_finance_report(debut_mois, fin_mois),
            "top_boissons": list(SalesReportService.top_drinks(debut_mois, fin_mois, limit=5)),
            "ventes_par_jour": list(SalesByDayService.sales_by_day()),
            "ventes_par_vendeur": list(SalesBySellerService.sales_by_seller()),
            "ventes_recentes": list(
                Sale.objects.select_related("drink", "served_by")
                .order_by("-created_at")[:10]
                .values("id", "drink__name", "quantity", "total_price", "served_by__username", "created_at")
            ),
        }


class FinanceReportService:
    @staticmethod
    def get_finance_report(start_date, end_date):
        ventes = Sale.objects.filter(created_at__date__range=(start_date, end_date)).aggregate(total_sales=Sum("total_price"))["total_sales"] or 0
        depenses = Depense.objects.filter(date__range=(start_date, end_date)).aggregate(total_expenses=Sum("montant"))["total_expenses"] or 0

        return {
            "chiffre_affaires": float(ventes),
            "depenses": float(depenses),
            "benefice_net": float(ventes - depenses),
        }


class SalesReportService:
    @staticmethod
    def top_drinks(start_date, end_date, limit=5):
        return (
            Sale.objects.filter(created_at__date__range=(start_date, end_date))
            .values("drink__id", "drink__name")
            .annotate(
                quantite_vendue=Sum("quantity"),
                nom_boisson=F("drink__name"),
                chiffre_affaires=Sum("total_price"),
            )
            .order_by("-quantite_vendue")[:limit]
        )


class SalesByDayService:
    @staticmethod
    def sales_by_day():
        return (
            Sale.objects.annotate(jour=TruncDate("created_at"))
            .values("jour")
            .annotate(
                chiffre_affaires=Sum("total_price"),
                nombre_articles=Sum("quantity"),
            )
            .order_by("jour")
        )


class SalesBySellerService:
    @staticmethod
    def sales_by_seller():
        return (
            Sale.objects
            .values("served_by__id", "served_by__username")
            .annotate(
                chiffre_affaires=Sum("total_price"),
                nombre_articles=Sum("quantity"),
                vendeur_id=F("served_by__id"),
                vendeur_nom=F("served_by__username"),
            )
            .values("vendeur_id", "vendeur_nom", "chiffre_affaires", "nombre_articles")
            .order_by("-chiffre_affaires")
        )