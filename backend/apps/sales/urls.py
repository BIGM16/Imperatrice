from rest_framework.routers import DefaultRouter

from .views import (
    SaleViewSet
)

router = DefaultRouter()

router.register(
    r"record",
    SaleViewSet,
    basename="record"
)

urlpatterns = router.urls