from .models import (
    Depense, Personne
)

class FinanceService:

    @staticmethod
    def create_expense(
        *,
        motif,
        amount,
        responsible
    ):

        return Depense.objects.create(
            motif=motif,
            montant=amount,
            responsable=responsible
        )

class PersonneService:

    @staticmethod
    def create_person(
        *,
        name,
        email
    ):

        return Personne.objects.create(
            name=name,
            email=email
        )