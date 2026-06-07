from django.urls import path
from . import views

urlpatterns = [
    # ===== URLs d'authentification =====
    path("", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),

    # ===== Dashboards principaux =====
    path("seller/", views.seller_dashboard, name="seller_dashboard"),
    path("admin_dashboard/", views.admin_dashboard, name="admin_dashboard"),

    # ===== API Endpoints pour les ventes =====
    path("api/sale/", views.api_record_sale, name="api_record_sale"),
    path("api/generer_resume/", views.generer_resume_ajax, name="generer_resume_ajax"),

    # ===== API AJAX pour la gestion des boissons =====
    # Note: utilisation du préfixe 'ajax/' pour éviter les conflits avec l'admin Django
    path("ajax/drinks/add/", views.create_drink_ajax, name="create_drink_ajax"),
    path("ajax/drinks/<int:pk>/edit/", views.edit_drink_ajax, name="edit_drink_ajax"),
    path("ajax/drinks/<int:pk>/delete/", views.delete_drink_ajax, name="delete_drink_ajax"),
    path("ajax/drinks/<int:pk>/update_stock/", views.update_stock_ajax, name="update_stock_ajax"),

    # ===== API AJAX pour la gestion des dépenses =====
    path("ajax/depenses/add/", views.create_depense_ajax, name="create_depense_ajax"),
    path("ajax/depenses/<int:pk>/delete/", views.delete_depense_ajax, name="delete_depense_ajax"),

    # ===== Interface historique des ventes =====
    path("sales/history/", views.sales_history, name="sales_history"),
    path("depenses/history/", views.depense_history, name="depense_history"),

    # ===== URLs CRUD pour les boissons (non-AJAX) =====
    # Ces routes sont principalement utilisées comme fallback et pour les redirections
    # La majorité des opérations se font via AJAX dans le dashboard admin
    path("drinks/", views.admin_dashboard, name="drink_list"),  # Redirige vers dashboard
    path("drinks/create/", views.DrinkCreateView.as_view(), name="drink_create"),
    path("drinks/<int:pk>/update/", views.DrinkUpdateView.as_view(), name="drink_update"),
    path("drinks/<int:pk>/delete/", views.DrinkDeleteView.as_view(), name="drink_delete"),
    # path("drinks/<int:pk>/update-stock/", views.update_stock, name="update_stock"),
]
