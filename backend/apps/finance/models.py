from django.db import models
from apps.accounts.models import User
from apps.common.models import TimeStampedModel
# Create your models here.
class Depense(TimeStampedModel):
    motif = models.CharField(max_length=255)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    responsable = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        responsable_name = self.responsable.name if self.responsable else '—'
        return f"{self.motif} ({self.montant} FC) - {responsable_name}"

    class Meta:
        ordering = ['-date', '-id']
        verbose_name = "Dépense"
        verbose_name_plural = "Dépenses"
