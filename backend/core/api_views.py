from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Sum, F
from django.db import transaction
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404

from .models import Drink, Sale, Depense, Personne
from .serializers import DrinkSerializer, SaleSerializer, DepenseSerializer, PersonneSerializer

class IsStaffOrReadOnly(permissions.BasePermission):
    """
    Permission pour accorder l'accès en écriture uniquement aux membres du staff.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff

class IsStaffUser(permissions.BasePermission):
    """
    Permission pour accorder l'accès uniquement aux membres du staff.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class DrinkViewSet(viewsets.ModelModelViewSet if hasattr(viewsets, 'ModelModelViewSet') else viewsets.ModelViewSet):
    queryset = Drink.objects.all().order_by('name')
    serializer_class = DrinkSerializer
    permission_classes = [IsStaffOrReadOnly]

    @action(detail=True, methods=['post'], permission_classes=[IsStaffUser])
    def update_stock(self, request, pk=None):
        drink = self.get_object()
        action_type = request.data.get('action')
        try:
            qty = int(request.data.get('quantity', 1))
        except (ValueError, TypeError):
            qty = 1

        if action_type == 'add':
            drink.stock += qty
        elif action_type == 'remove':
            drink.stock = max(0, drink.stock - qty)
        else:
            return Response({"detail": "Action invalide. Utilisez 'add' ou 'remove'."}, status=status.HTTP_400_BAD_REQUEST)

        drink.save()
        return Response({
            "status": "Stock mis à jour",
            "name": drink.name,
            "new_stock": drink.stock
        }, status=status.HTTP_200_OK)

class SaleViewSet(viewsets.ModelViewSet):
    serializer_class = SaleSerializer

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]
        return [IsStaffUser()]

    def get_queryset(self):
        queryset = Sale.objects.all().order_by('-created_at')
        
        # Filtres pour le staff
        drink_id = self.request.query_params.get('drink')
        date_debut = self.request.query_params.get('date_debut')
        date_fin = self.request.query_params.get('date_fin')

        if drink_id:
            queryset = queryset.filter(drink_id=drink_id)
        if date_debut:
            queryset = queryset.filter(created_at__date__gte=date_debut)
        if date_fin:
            queryset = queryset.filter(created_at__date__lte=date_fin)
            
        return queryset

    def perform_create(self, serializer):
        drink = serializer.validated_data['drink']
        qty = serializer.validated_data['quantity']

        with transaction.atomic():
            drink_locked = Drink.objects.select_for_update().get(pk=drink.pk)
            if drink_locked.stock < qty:
                raise ValidationError({"detail": f"Stock insuffisant pour {drink_locked.name}."})

            drink_locked.stock -= qty
            drink_locked.save()

            total = drink_locked.prix_vente * qty
            benefice_total = drink_locked.benefice_unitaire() * qty

            serializer.save(
                seller=self.request.user,
                total=total,
                benefice_total=benefice_total
            )

class DepenseViewSet(viewsets.ModelViewSet):
    serializer_class = DepenseSerializer
    permission_classes = [IsStaffUser]

    def get_queryset(self):
        queryset = Depense.objects.all().order_by('-date', '-id')
        
        # Filtres
        personne_id = self.request.query_params.get('personne')
        date_debut = self.request.query_params.get('date_debut')
        date_fin = self.request.query_params.get('date_fin')

        if personne_id:
            queryset = queryset.filter(responsable_id=personne_id)
        if date_debut:
            queryset = queryset.filter(date__gte=date_debut)
        if date_fin:
            queryset = queryset.filter(date__lte=date_fin)

        return queryset

class PersonneViewSet(viewsets.ModelViewSet):
    queryset = Personne.objects.all().order_by('name')
    serializer_class = PersonneSerializer
    permission_classes = [IsStaffUser]

class TodayStatsView(APIView):
    permission_classes = [IsStaffUser]

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
