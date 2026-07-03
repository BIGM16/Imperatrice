from django.db import transaction

from .models import Sale

from apps.inventory.models import (
    Drink
)
from apps.common.service import AuditLogService


class SaleService:

    @staticmethod
    @transaction.atomic
    def create_sale(
        *,
        drink_id,
        quantity,
        seller
    ):

        drink = (
            Drink.objects
            .select_for_update()
            .get(pk=drink_id)
        )

        if drink.stock < quantity:
            raise ValueError(
                "Stock insuffisant."
            )

        drink.stock -= quantity

        drink.save()

        sale = Sale.objects.create(
            drink=drink,
            quantity=quantity,
            served_by=seller,
            unit_price=drink.price_sale,
            total_price=drink.price_sale * quantity,
        )

        AuditLogService.log_action(
            user=seller,
            action="SALE",
            model_name="Sale",
            object_id=sale.id if 'sale' in locals() else None,
            description=f"Vente de {quantity} {drink.name}(s) pour un total de {drink.price_sale * quantity} FCFA."
        )
        

        return sale

    @staticmethod
    @transaction.atomic
    def create_bulk_sale(
        *,
        items,  # list of {"drink_id": int, "quantity": int}
        seller
    ):
        """
        Crée plusieurs ventes (une par article) en une seule transaction atomique.
        Vérifie le stock pour tous les articles avant de débiter quoi que ce soit.
        """
        sales = []
        descriptions = []

        # Verrouiller et valider les stocks en premier
        drink_ids = [item["drink_id"] for item in items]
        drinks_map = {
            d.pk: d
            for d in Drink.objects.select_for_update().filter(pk__in=drink_ids)
        }

        for item in items:
            drink_id = item["drink_id"]
            quantity = item["quantity"]

            if drink_id not in drinks_map:
                raise ValueError(f"Boisson introuvable (id={drink_id}).")

            drink = drinks_map[drink_id]
            if drink.stock < quantity:
                raise ValueError(
                    f"Stock insuffisant pour '{drink.name}' "
                    f"(disponible: {drink.stock}, demandé: {quantity})."
                )

        # Débiter les stocks et créer les ventes
        for item in items:
            drink_id = item["drink_id"]
            quantity = item["quantity"]
            drink = drinks_map[drink_id]

            drink.stock -= quantity
            drink.save()

            sale = Sale.objects.create(
                drink=drink,
                quantity=quantity,
                served_by=seller,
                unit_price=drink.price_sale,
                total_price=drink.price_sale * quantity,
            )
            sales.append(sale)
            descriptions.append(f"{quantity}x {drink.name}")

        AuditLogService.log_action(
            user=seller,
            action="SALE",
            model_name="Sale",
            object_id=sales[0].id if sales else None,
            description=(
                f"Vente groupée : {', '.join(descriptions)} "
                f"— Total: {sum(s.total_price for s in sales)} FCFA."
            )
        )

        return sales