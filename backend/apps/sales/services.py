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