from django.db import models
from apps.accounts.models import User
from apps.common.models import TimeStampedModel
from django.core.validators import RegexValidator
# Create your models here.
class Depense(TimeStampedModel):
    motif = models.CharField(max_length=255)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    responsable = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        responsable_name = self.responsable.username if self.responsable else '—'
        return f"{self.motif} ({self.montant} FC) - {responsable_name}"

    class Meta:
        ordering = ['-date', '-id']
        verbose_name = "Dépense"
        verbose_name_plural = "Dépenses"


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

