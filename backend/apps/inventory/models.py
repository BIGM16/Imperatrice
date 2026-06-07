from django.db import models
from apps.common.models import TimeStampedModel
from django.core.validators import MinValueValidator

class Category(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Ingredient(TimeStampedModel):
    name = models.CharField(max_length=100)
    quantity = models.FloatField(default=0)
    unit = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"

class Drink(TimeStampedModel):
    name = models.CharField(max_length=150, unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    ingredients = models.ManyToManyField(Ingredient, through="DrinkIngredient")
    price_purchase = models.FloatField(validators=[MinValueValidator(0)])
    price_sale = models.FloatField(validators=[MinValueValidator(0)])
    volume = models.CharField(max_length=50, blank=True, help_text="e.g., 25cl, 33cl")
    image_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.price_sale} FC)"

class DrinkIngredient(TimeStampedModel):
    drink = models.ForeignKey(Drink, on_delete=models.CASCADE, related_name="ingredients_detail")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity_used = models.FloatField()

    class Meta:
        unique_together = ('drink', 'ingredient')
