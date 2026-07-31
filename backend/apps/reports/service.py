from django.db.models import Sum, Count, F, FloatField, ExpressionWrapper
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

        # Calcul propre du dernier jour du mois
        fin_mois = (debut_mois.replace(day=28) + timezone.timedelta(days=4)).replace(day=1) - timezone.timedelta(days=1)

        # 1. Récupération des requêtes de base filtrées par date
        ventes_aujourd_hui = Sale.objects.filter(created_at__date=aujourd_hui)
        depenses_aujourd_hui = Depense.objects.filter(date=aujourd_hui)
        ventes_mois = Sale.objects.filter(created_at__date__range=(debut_mois, fin_mois))
        depenses_mois = Depense.objects.filter(date__range=(debut_mois, fin_mois))

        # 2. Calculs pour AUJOURD'HUI
        chiffre_affaires_aujourd_hui = float(ventes_aujourd_hui.aggregate(total=Sum("total_price"))["total"] or 0)
        depenses_aujourd_hui_total = float(depenses_aujourd_hui.aggregate(total=Sum("montant"))["total"] or 0)

        # Marge brute aujourd'hui = Somme de (quantité * (prix_vente - prix_achat))
        marge_brute_aujourd_hui = float(
            ventes_aujourd_hui.aggregate(
                total_marge=Sum(
                    F("quantity") * ExpressionWrapper(
                        F("unit_price") - F("drink__price_purchase"), 
                        output_field=FloatField()
                    )
                )
            )["total_marge"] or 0
        )
        # Revenu net aujourd'hui = Marge brute - Dépenses du jour
        revenu_net_aujourd_hui = marge_brute_aujourd_hui - depenses_aujourd_hui_total

        # 3. Calculs pour LE MOIS
        chiffre_affaires_mensuel = float(ventes_mois.aggregate(total=Sum("total_price"))["total"] or 0)
        depenses_mensuelles = float(depenses_mois.aggregate(total=Sum("montant"))["total"] or 0)
        
        # Marge brute mensuelle
        marge_brute_mensuelle = float(
            ventes_mois.aggregate(
                total_marge=Sum(
                    F("quantity") * ExpressionWrapper(
                        F("unit_price") - F("drink__price_purchase"), 
                        output_field=FloatField()
                    )
                )
            )["total_marge"] or 0
        )
        # Revenu net mensuel = Marge brute mensuelle - Dépenses mensuelles
        revenu_net_mensuel = marge_brute_mensuelle - depenses_mensuelles

        total_boissons_vendues = int(ventes_mois.aggregate(total=Sum("quantity"))["total"] or 0)

        return {
            "chiffre_affaires_aujourd_hui": float(chiffre_affaires_aujourd_hui),
            "depenses_aujourd_hui": float(depenses_aujourd_hui_total),
            "benefice_net_aujourd_hui": float(revenu_net_aujourd_hui),
            "nombre_ventes_aujourd_hui": ventes_aujourd_hui.count(),
            "boissons_en_faible_stock": Drink.objects.filter(stock__lte=F("min_stock")).count(),
            "chiffre_affaires_mensuel": float(chiffre_affaires_mensuel),
            "depenses_mensuelles": float(depenses_mensuelles),
            "benefice_net_mensuel": float(revenu_net_mensuel),
            "total_boissons_vendues": int(total_boissons_vendues)
        }

    @staticmethod
    def get_dashboard_payload():
        aujourd_hui = timezone.localdate()
        debut_mois = aujourd_hui.replace(day=1)
        fin_mois = (debut_mois.replace(day=28) + timezone.timedelta(days=4)).replace(day=1) - timezone.timedelta(days=1)

        # Optimisation : On génère les stats une seule fois
        stats = DashboardService.get_dashboard_stats()

        return {
            "statistiques": stats,
            # On réutilise les calculs déjà faits au lieu de relancer des requêtes SQL lourdes
            "rapport_financier": {
                "chiffre_affaires": stats["chiffre_affaires_mensuel"],
                "depenses": stats["depenses_mensuelles"],
                "benefice_net": stats["benefice_net_mensuel"],
            },
            "top_boissons": list(SalesReportService.top_drinks(debut_mois, fin_mois, limit=5)),
            # Optimisation importante : On limite l'historique des graphiques au mois en cours
            "ventes_par_jour": list(SalesByDayService.sales_by_day(debut_mois, fin_mois)),
            "ventes_par_vendeur": list(SalesBySellerService.sales_by_seller(debut_mois, fin_mois)),
            "ventes_recentes": list(
                Sale.objects.select_related("drink", "served_by")
                .order_by("-created_at")[:10]
                .values("id", "drink__name", "quantity", "total_price", "served_by__username", "created_at")
            ),
        }

class FinanceReportService:
    @staticmethod
    def get_finance_report(start_date, end_date):
        ventes = float(Sale.objects.filter(created_at__date__range=(start_date, end_date)).aggregate(total_sales=Sum("total_price"))["total_sales"] or 0)
        depenses = float(Depense.objects.filter(date__range=(start_date, end_date)).aggregate(total_expenses=Sum("montant"))["total_expenses"] or 0)

        return {
            "chiffre_affaires": ventes,
            "depenses": depenses,
            "benefice_net": ventes - depenses,
        }


class SalesReportService:
    @staticmethod
    def top_drinks(start_date=None, end_date=None, limit=5):
        qs = Sale.objects.all()
        if start_date and end_date:
            qs = qs.filter(created_at__date__range=(start_date, end_date))
        return (
            qs.values("drink__id", "drink__name")
            .annotate(
                quantite_vendue=Sum("quantity"),
                nom_boisson=F("drink__name"),
                chiffre_affaires=Sum("total_price"),
                marge_boisson=Sum(
                    F("quantity") * ExpressionWrapper(
                        F("unit_price") - F("drink__price_purchase"), 
                        output_field=FloatField()
                    )
                )
            )
            .order_by("-quantite_vendue")[:limit]
        )


class SalesByDayService:
    @staticmethod
    def sales_by_day(start_date=None, end_date=None):
        qs = Sale.objects.all()
        if start_date and end_date:
            qs = qs.filter(created_at__date__range=(start_date, end_date))
        return (
            qs.annotate(jour=TruncDate("created_at"))
            .values("jour")
            .annotate(
                chiffre_affaires=Sum("total_price"),
                nombre_articles=Sum("quantity"),
            )
            .order_by("jour")
        )


class SalesBySellerService:
    @staticmethod
    def sales_by_seller(start_date=None, end_date=None):
        qs = Sale.objects.all()
        if start_date and end_date:
            qs = qs.filter(created_at__date__range=(start_date, end_date))
        return (
            qs.values("served_by__id", "served_by__username")
            .annotate(
                chiffre_affaires=Sum("total_price"),
                nombre_articles=Sum("quantity"),
                vendeur_id=F("served_by__id"),
                vendeur_nom=F("served_by__username"),
            )
            .values("vendeur_id", "vendeur_nom", "chiffre_affaires", "nombre_articles")
            .order_by("-chiffre_affaires")
        )