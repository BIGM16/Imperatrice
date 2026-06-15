from django.urls import path
from .views import DepenseViewSet, PersonneViewSet

urlpatterns = [
    path(
        "depenses/",
        DepenseViewSet.as_view(),
        name="depenses"
    )
    path(
        "personnes/",
        PersonneViewSet.as_view(),
        name="personnes"
    )
]