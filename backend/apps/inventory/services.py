from django.db import transaction

from .models import Drink


class InventoryService:

    @staticmethod
    @transaction.atomic
    def add_stock(drink_id: int, quantity: int):

        drink = Drink.objects.select_for_update().get(
            pk=drink_id
        )

        drink.stock += quantity
        drink.save()

        return drink

    @staticmethod
    @transaction.atomic
    def remove_stock(drink_id: int, quantity: int):

        drink = Drink.objects.select_for_update().get(
            pk=drink_id
        )

        if drink.stock < quantity:
            raise ValueError(
                "Stock insuffisant."
            )

        drink.stock -= quantity
        drink.save()

        return drink

    @staticmethod
    @transaction.atomic
    def update_stock(
        drink_id: int,
        quantity: int,
        action: str
    ):

        if action == "add":
            return InventoryService.add_stock(
                drink_id,
                quantity
            )

        if action == "remove":
            return InventoryService.remove_stock(
                drink_id,
                quantity
            )

        raise ValueError(
            "Action invalide."
        )