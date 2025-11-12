from django import forms
from .models import Drink

class DrinkForm(forms.ModelForm):
    class Meta:
        model = Drink
        fields = ['name', 'price', 'stock']
        labels = {
            'name': 'Nom de la boisson',
            'price': 'Prix (FC)',
            'stock': 'Stock initial'
        }
        widgets = {
            'name': forms.TextInput(attrs={'class': 'w-full p-3 rounded-lg theme-bg-primary theme-text-primary theme-border border focus:ring-2 focus:ring-cyan-400 focus:border-transparent'}),
            'price': forms.NumberInput(attrs={'class': 'w-full p-3 rounded-lg theme-bg-primary theme-text-primary theme-border border focus:ring-2 focus:ring-cyan-400 focus:border-transparent', 'min': '0', 'step': '0.01'}),
            'stock': forms.NumberInput(attrs={'class': 'w-full p-3 rounded-lg theme-bg-primary theme-text-primary theme-border border focus:ring-2 focus:ring-cyan-400 focus:border-transparent', 'min': '0'})
        }

    def clean_price(self):
        price = self.cleaned_data.get('price')
        if price and price < 0:
            raise forms.ValidationError("Le prix ne peut pas être négatif.")
        return price

    def clean_stock(self):
        stock = self.cleaned_data.get('stock')
        if stock and stock < 0:
            raise forms.ValidationError("Le stock ne peut pas être négatif.")
        return stock