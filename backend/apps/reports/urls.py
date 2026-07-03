from django.urls import path
from .views import (
    TableauDeBordView,
    RapportFinancierView,
    TopBoissonsView,
    VentesParJourView,
    VentesParVendeurView,
)

urlpatterns = [
    path("dashboard/", TableauDeBordView.as_view(), name="tableau-de-bord"),
    path("dashboard/statistiques/", TableauDeBordView.as_view(), name="tableau-de-bord-statistiques"),
    path("finance/", RapportFinancierView.as_view(), name="rapport-financier"),
    path("top-boissons/", TopBoissonsView.as_view(), name="top-boissons"),
    path("ventes/par-jour/", VentesParJourView.as_view(), name="ventes-par-jour"),
    path("ventes/par-vendeur/", VentesParVendeurView.as_view(), name="ventes-par-vendeur"),
]