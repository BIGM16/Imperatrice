from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from .serializers import UserSerializer

from rest_framework.permissions import IsAdminUser
from django.utils import timezone
from .models import User
from apps.sales.models import Sale
from apps.finance.models import Depense
from django.db.models import Sum, F

class MeAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        serializer = UserSerializer(
            request.user
        )

        return Response(
            serializer.data
        )

class StatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        today = timezone.now().date()
        
        sales = Sale.objects.filter(created_at__date=today)
        total_sales = sales.aggregate(Sum('total'))['total__sum'] or 0
        total_benefice = sales.aggregate(Sum('benefice_total'))['benefice_total__sum'] or 0
        total_today_sales_count = sales.count()

        depenses = Depense.objects.filter(date=today)
        total_depenses = depenses.aggregate(Sum('montant'))['montant__sum'] or 0

        benefice_net = total_benefice - total_depenses

        stats = (
            Sale.objects.filter(created_at__date=today)
            .values('drink__name', 'drink__id')
            .annotate(
                total_vendu=Sum('quantity'),
                total_montant=Sum('total'),
                benefice=Sum('benefice_total'),
                stock_restant=F('drink__stock')
            )
            .order_by('drink__name')
        )

        return Response({
            "date": today.isoformat(),
            "total_sales": float(total_sales),
            "total_benefice": float(total_benefice),
            "total_depenses": float(total_depenses),
            "benefice_net": float(benefice_net),
            "sales_count": total_today_sales_count,
            "drink_stats": list(stats)
        })


class UserViewSet(ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

