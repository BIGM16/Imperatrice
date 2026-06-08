from django.db import transaction

from .models import Sale

from apps.inventory.models import (
    Drink
)


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

        total = (
            drink.prix_vente
            * quantity
        )

        sale = Sale.objects.create(
            drink=drink,
            quantity=quantity,
            total_price=total,
            served_by=seller
        )

        return sale