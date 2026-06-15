from django.urls import path
from .views import DashboardView, FinanceReportView, TopDrinksView

urlpatterns = [
    path('stats/', DashboardView.as_view(), name='dashboard-stats'),
    path('finance/', FinanceReportView.as_view(), name='finance-report'),
    path('top-drinks/', TopDrinksView.as_view(), name='top-drinks'),
]