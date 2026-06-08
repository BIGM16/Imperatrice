from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views

router = DefaultRouter()
router.register(r'drinks', api_views.DrinkViewSet, basename='api-drink')
router.register(r'sales', api_views.SaleViewSet, basename='api-sale')
router.register(r'depenses', api_views.DepenseViewSet, basename='api-depense')
router.register(r'personnes', api_views.PersonneViewSet, basename='api-personne')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/today/', api_views.TodayStatsView.as_view(), name='api-stats-today'),
]
