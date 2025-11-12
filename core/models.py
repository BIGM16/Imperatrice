from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Drink(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    stock = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.price} FC)"

class Sale(models.Model):
    drink = models.ForeignKey(Drink, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    seller = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.total:
            self.total = self.drink.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.drink.name} ({self.total} FC)"

class DailySummary(models.Model):
    date = models.DateField(auto_now_add=True)
    boisson = models.ForeignKey(Drink, on_delete=models.PROTECT)
    total_vendu = models.PositiveIntegerField()
    montant_total = models.DecimalField(max_digits=10, decimal_places=2)
    stock_restant = models.PositiveIntegerField()

    def __str__(self):
        return f"Résumé du {self.date} - {self.boisson}"
