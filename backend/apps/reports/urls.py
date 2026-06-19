from django.urls import path
from .views import (
    DashboardView, 
    FinanceReportView, 
    TopDrinksView,
    SalesByDayView,
    SalesBySellerView
)

urlpatterns = [
    path('stats/', DashboardView.as_view(), name='dashboard-stats'),
    path('finance/', FinanceReportView.as_view(), name='finance-report'),
    path('top-drinks/', TopDrinksView.as_view(), name='top-drinks'),
    path('sales/by-day/', SalesByDayView.as_view(), name='sales-by-day'),
    path('sales/by-seller/', SalesBySellerView.as_view(), name='sales-by-seller'),
]