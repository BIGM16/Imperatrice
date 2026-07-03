from django.urls import path
from apps.reports.views import (
    TableauDeBordView,
    StatistiquesView,
    RapportFinancierView,
    TopBoissonsView,
    VentesParJourView,
    VentesParVendeurView,
)

urlpatterns = [
    # French paths (for backward compatibility if needed)
    path("dashboard/", TableauDeBordView.as_view(), name="tableau-de-bord"),
    path("dashboard/statistiques/", TableauDeBordView.as_view(), name="tableau-de-bord-statistiques"),
    path("finance/", RapportFinancierView.as_view(), name="rapport-financier"),
    path("top-boissons/", TopBoissonsView.as_view(), name="top-boissons"),
    path("ventes/par-jour/", VentesParJourView.as_view(), name="ventes-par-jour"),
    path("ventes/par-vendeur/", VentesParVendeurView.as_view(), name="ventes-par-vendeur"),

    # English paths (requested by frontend page / services)
    path("stats/", StatistiquesView.as_view(), name="statistiques"),
    path("top-drinks/", TopBoissonsView.as_view(), name="top-drinks"),
    path("sales/by-day/", VentesParJourView.as_view(), name="sales-by-day"),
    path("sales/by-seller/", VentesParVendeurView.as_view(), name="sales-by-seller"),
]