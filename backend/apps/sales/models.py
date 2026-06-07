from django.db import models

# Create your models here.
from apps.common.models import TimeStampedModel
from apps.inventory.models import Drink
from django.contrib.auth.models import User


class Sale(TimeStampedModel):
    drink = models.ForeignKey(Drink, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    unit_price = models.FloatField()
    total_price = models.FloatField()
    served_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)


    def __str__(self):
        return f"{self.drink.name} ({self.quantity}) - {self.total_price} FC"

    def save(self, *args, **kwargs):
        self.total_price = self.drink.price_sale * self.quantity
        self.unit_price = self.drink.price_sale
        super().save(*args, **kwargs)

class SaleItem(TimeStampedModel):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name="items")
    drink = models.ForeignKey(Drink, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    unit_price = models.FloatField()
    total_price = models.FloatField()

    def __str__(self):
        return f"{self.drink.name} ({self.quantity}) - {self.total_price} FC"

    def save(self, *args, **kwargs):
        self.total_price = self.drink.price_sale * self.quantity
        self.unit_price = self.drink.price_sale
        super().save(*args, **kwargs)