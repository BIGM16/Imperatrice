from rest_framework.routers import DefaultRouter

from .views import DrinkViewSet

router = DefaultRouter()

router.register(
    r"drinks",
    DrinkViewSet,
    basename="drink"
)

urlpatterns = router.urls