from rest_framework.routers import DefaultRouter

from .views import DrinkViewSet, CategorieViewSet

router = DefaultRouter()

router.register(
    r"drinks",
    DrinkViewSet,
    basename="drink"
)

router.register(
    r"categories",
    CategorieViewSet,
    basename="categorie"
)

urlpatterns = router.urls