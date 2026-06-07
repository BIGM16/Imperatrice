from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator

User = get_user_model()

class Drink(models.Model):
    name = models.CharField(max_length=100)
    prix_achat = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    prix_vente = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    stock = models.IntegerField(default=0)

    def benefice_unitaire(self):
        """Calcule le bénéfice unitaire (prix_vente - prix_achat)"""
        return self.prix_vente - self.prix_achat

    def __str__(self):
        return f"{self.name} ({self.prix_vente} FC)"

class Sale(models.Model):
    drink = models.ForeignKey(Drink, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    benefice_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    seller = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="ventes_personne")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.total:
            self.total = self.drink.prix_vente * self.quantity
        # Calcul automatique du bénéfice total
        self.benefice_total = self.drink.benefice_unitaire() * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.drink.name} ({self.total} FC) - Bénéfice: {self.benefice_total} FC"

class DailySummary(models.Model):
    date = models.DateField(auto_now_add=True)
    boisson = models.ForeignKey(Drink, on_delete=models.PROTECT)
    total_vendu = models.PositiveIntegerField()
    montant_total = models.DecimalField(max_digits=10, decimal_places=2)
    stock_restant = models.PositiveIntegerField()

    def __str__(self):
        return f"Résumé du {self.date} - {self.boisson}"

class Personne(models.Model):
    """Représente une personne responsable d'une dépense.

    Contraintes demandées :
    - un seul mot
    - maximum 10 lettres
    """
    name = models.CharField(
        max_length=10,
        unique=True,
        validators=[
            # accepte lettres latines (majuscules/minuscules, accentuées)
            RegexValidator(r'^[A-Za-zÀ-ÖØ-öø-ÿ]{1,10}$',
                           message='Le nom doit être un seul mot (lettres seulement) et maximum 10 caractères.')
        ],
    )

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name = 'Personne'
        verbose_name_plural = 'Personnes'


class Depense(models.Model):
    motif = models.CharField(max_length=255)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    # lier à Personne pour suivre qui a fait la dépense
    responsable = models.ForeignKey(Personne, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        responsable_name = self.responsable.name if self.responsable else '—'
        return f"{self.motif} ({self.montant} FC) - {responsable_name}"

    class Meta:
        ordering = ['-date', '-id']
        verbose_name = "Dépense"
        verbose_name_plural = "Dépenses"
