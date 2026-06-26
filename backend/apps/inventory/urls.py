from rest_framework.routers import DefaultRouter

from .views import DrinkViewSet, CategoryViewSet

router = DefaultRouter()

router.register(
    r"drinks",
    DrinkViewSet,
    basename="drink"
)

router.register(
    r"categories",
    CategoryViewSet,
    basename="category"
)

urlpatterns = router.urls