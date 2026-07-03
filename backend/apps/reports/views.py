from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .service import DashboardService, FinanceReportService, SalesReportService, SalesByDayService, SalesBySellerService
from .serializers import (
    TableauDeBordSerializer,
    RapportFinancierSerializer,
    TopBoissonSerializer,
    VenteParJourSerializer,
    VenteParVendeurSerializer,
)


class TableauDeBordView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        payload = DashboardService.get_dashboard_payload()
        serializer = TableauDeBordSerializer(payload)
        return Response(serializer.data)


class RapportFinancierView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        finance_report_data = FinanceReportService.get_finance_report(start_date, end_date)
        serializer = RapportFinancierSerializer(finance_report_data)
        return Response(serializer.data)


class TopBoissonsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        limit = int(request.query_params.get("limit", 10))

        top_drinks_data = SalesReportService.top_drinks(start_date, end_date, limit)
        serializer = TopBoissonSerializer(top_drinks_data, many=True)

        return Response(serializer.data)


class VentesParJourView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sales_by_day_data = SalesByDayService.sales_by_day()
        serializer = VenteParJourSerializer(sales_by_day_data, many=True)
        return Response(serializer.data)


class VentesParVendeurView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sales_by_seller_data = SalesBySellerService.sales_by_seller()
        serializer = VenteParVendeurSerializer(sales_by_seller_data, many=True)
        return Response(serializer.data)