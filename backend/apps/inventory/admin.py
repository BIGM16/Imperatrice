from django.contrib import admin
from .models import Drink, Category, Ingredient, DrinkIngredient
# Register your models here.

admin.site.register(Drink)
admin.site.register(Category)
admin.site.register(Ingredient)
admin.site.register(DrinkIngredient)