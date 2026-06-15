from django.urls import path
from .views import MeAPIView, StatsView

urlpatterns = [
    path(
        "me/",
        MeAPIView.as_view(),
        name="me"
    )
]