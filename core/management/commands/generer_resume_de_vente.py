from django.core.management.base import BaseCommand
from ...models import DailySummary, Drink, Sale
from django.utils import timezone
from decimal import Decimal

class Command(BaseCommand):
    help = "Génère le résumé quotidien des ventes"

    def handle(self, *args, **kwargs):
        today = timezone.now().date()
        boissons = Drink.objects.all()

        for boisson in boissons:
            ventes = Sale.objects.filter(drink=boisson)
            total_vendu = ventes.count()
            montant_total = sum([v.total for v in ventes]) if ventes.exists() else Decimal('0.00')

            DailySummary.objects.create(
                boisson=boisson,
                total_vendu=total_vendu,
                montant_total=montant_total,
                stock_restant=boisson.stock
            )

        # Nettoyer les ventes après résumé
        Sale.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f"Résumé du {today} généré et ventes nettoyées."))
