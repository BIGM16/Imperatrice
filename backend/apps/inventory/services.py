from django.db import transaction

from .models import Drink

from apps.common.service import AuditLogService


class InventoryService:

    @staticmethod
    @transaction.atomic
    def add_stock(drink_id: int, quantity: int):

        drink = Drink.objects.select_for_update().get(
            pk=drink_id
        )

        drink.stock += quantity
        drink.save()

        AuditLogService.log_action(
            user=None,  # Replace with actual user if available
            action="add_stock",
            model_name="Drink",
            object_id=drink.id,
            description=f"Stock ajouté pour {drink.name}: {quantity}"
        )

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

        AuditLogService.log_action(
            user=None,  # Replace with actual user if available
            action="remove_stock",
            model_name="Drink",
            object_id=drink.id,
            description=f"Stock retiré pour {drink.name}: {quantity}"
        )

        return drink

    @staticmethod
    @transaction.atomic
    def set_stock(drink_id: int, quantity: int):

        drink = Drink.objects.select_for_update().get(
            pk=drink_id
        )

        old_stock = drink.stock
        drink.stock = quantity
        drink.save()

        AuditLogService.log_action(
            user=None,
            action="set_stock",
            model_name="Drink",
            object_id=drink.id,
            description=f"Stock défini pour {drink.name}: de {old_stock} à {quantity}"
        )

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

        if action == "set":
            return InventoryService.set_stock(
                drink_id,
                quantity
            )

        raise ValueError(
            "Action invalide."
        )