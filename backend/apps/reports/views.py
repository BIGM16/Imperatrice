# pyrefly: ignore [missing-import]
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from .service import DashboardService, FinanceReportService, SalesReportService, SalesByDayService, SalesBySellerService
from .serializers import DashboardSerializer, FinanceReportSerializer, TopDrinksSerializer, SalesByDaySerializer, SalesBySellerSerializer

class DashboardView(APIView):

    def get(self, request):
        dashboard_data = DashboardService.get_dashboard_stats()
        serializer = DashboardSerializer(dashboard_data)
        return Response(serializer.data)

class FinanceReportView(APIView):

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        finance_report_data = FinanceReportService.get_finance_report(start_date, end_date)
        serializer = FinanceReportSerializer(finance_report_data)
        return Response(serializer.data)

class TopDrinksView(APIView):

    def get(self, request):
        start_date = request.query_params.get('start_date')

        end_date = request.query_params.get('end_date')
        limit = int(request.query_params.get('limit', 10))

        top_drinks_data = SalesReportService.top_drinks(start_date, end_date, limit)

        serializer = TopDrinksSerializer(top_drinks_data, many=True)
        
        return Response(serializer.data)

class SalesByDayView(APIView):

    def get(self, request):
        sales_by_day_data = SalesByDayService.sales_by_day()
        serializer = SalesByDaySerializer(sales_by_day_data, many=True)
        return Response(serializer.data)

class SalesBySellerView(APIView):

    def get(self, request):
        sales_by_seller_data = SalesBySellerService.sales_by_seller()
        serializer = SalesBySellerSerializer(sales_by_seller_data, many=True)
        return Response(serializer.data)