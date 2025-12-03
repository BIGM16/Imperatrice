from django import forms
from .models import Drink, Depense

class DrinkForm(forms.ModelForm):
    class Meta:
        model = Drink
        fields = ['name', 'prix_achat', 'prix_vente', 'stock']
        labels = {
            'name': 'Nom de la boisson',
            'prix_achat': 'Prix d\'achat (FC)',
            'prix_vente': 'Prix de vente (FC)',
            'stock': 'Stock initial'
        }
        widgets = {
            'name': forms.TextInput(attrs={'class': 'w-full p-3 rounded-lg theme-bg-primary theme-text-primary theme-border border focus:ring-2 focus:ring-cyan-400 focus:border-transparent'}),
            'prix_achat': forms.NumberInput(attrs={'class': 'w-full p-3 rounded-lg theme-bg-primary theme-text-primary theme-border border focus:ring-2 focus:ring-cyan-400 focus:border-transparent', 'min': '0', 'step': '0.01'}),
            'prix_vente': forms.NumberInput(attrs={'class': 'w-full p-3 rounded-lg theme-bg-primary theme-text-primary theme-border border focus:ring-2 focus:ring-cyan-400 focus:border-transparent', 'min': '0', 'step': '0.01'}),
            'stock': forms.NumberInput(attrs={'class': 'w-full p-3 rounded-lg theme-bg-primary theme-text-primary theme-border border focus:ring-2 focus:ring-cyan-400 focus:border-transparent', 'min': '0'})
        }

    def clean_prix_achat(self):
        prix_achat = self.cleaned_data.get('prix_achat')
        if prix_achat and prix_achat < 0:
            raise forms.ValidationError("Le prix d'achat ne peut pas être négatif.")
        return prix_achat

    def clean_prix_vente(self):
        prix_vente = self.cleaned_data.get('prix_vente')
        if prix_vente and prix_vente < 0:
            raise forms.ValidationError("Le prix de vente ne peut pas être négatif.")
        return prix_vente

    def clean_stock(self):
        stock = self.cleaned_data.get('stock')
        if stock and stock < 0:
            raise forms.ValidationError("Le stock ne peut pas être négatif.")
        return stock


class DepenseForm(forms.ModelForm):
    class Meta:
        model = Depense
        fields = ['motif', 'montant', 'responsable']
        labels = {
            'motif': 'Motif de la dépense',
            'montant': 'Montant (FC)',
            'responsable': 'Responsable'
        }
        widgets = {
            'motif': forms.TextInput(attrs={'class': 'w-full p-3 rounded-lg theme-bg-primary theme-text-primary theme-border border focus:ring-2 focus:ring-cyan-400 focus:border-transparent', 'placeholder': 'Ex: Achat de glaçons, maintenance...'}),
            'montant': forms.NumberInput(attrs={'class': 'w-full p-3 rounded-lg theme-bg-primary theme-text-primary theme-border border focus:ring-2 focus:ring-cyan-400 focus:border-transparent', 'min': '0', 'step': '0.01'}),
            'responsable': forms.TextInput(attrs={'class': 'w-full p-3 rounded-lg theme-bg-primary theme-text-primary theme-border border focus:ring-2 focus:ring-cyan-400 focus:border-transparent', 'placeholder': 'Nom de la personne'})
        }

    def clean_montant(self):
        montant = self.cleaned_data.get('montant')
        if montant and montant < 0:
            raise forms.ValidationError("Le montant ne peut pas être négatif.")
        return montant