from django.urls import path
from .views import DepenseViewSet, PersonneViewSet

urlpatterns = [
    path(
        "depenses/",
        DepenseViewSet.as_view({"get": "list", "post": "create"}),
        name="depenses"
    ),
    path(
        "depenses/<int:pk>/",
        DepenseViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"}),
        name="depense-detail"
    ),
    path(
        "personnes/",
        PersonneViewSet.as_view({"get": "list", "post": "create"}),
        name="personnes"
    ),
    path(
        "personnes/<int:pk>/",
        PersonneViewSet.as_view({"get": "retrieve", "patch": "partial_update", "delete": "destroy"}),
        name="personne-detail"
    ),
]