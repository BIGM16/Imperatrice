from django.db.models import Sum, Count, F
from django.utils import timezone
from django.db.models.functions import TruncDate

from apps.sales.models import Sale
from apps.finance.models import Depense
from apps.inventory.models import Drink

class DashboardService:
    @staticmethod
    def get_dashboard_stats():
        today = timezone.now().date()
        start_of_month = today.replace(day=1)
        end_of_month = (start_of_month + timezone.timedelta(days=32)).replace(day=1) - timezone.timedelta(days=1)

        sales_today = Sale.objects.filter(created_at__date=today).aggregate(total=Sum('total_price'))['total'] or 0

        expenses_today = Depense.objects.filter(date=today).aggregate(total=Sum('montant'))['total'] or 0

        total_sales = Sale.objects.filter(created_at__date__range=(start_of_month, end_of_month)).aggregate(total=Sum('total_price'))['total'] or 0

        # total_today_sales = Sale.objects.filter(created_at__date=today).aggregate(total=Sum('total_price'))['total'] or 0

        today_sales = Sale.objects.filter(created_at__date=today)

        total_expenses = Depense.objects.filter(date__range=(start_of_month, end_of_month)).aggregate(total=Sum('montant'))['total'] or 0

        total_today_expenses = Depense.objects.filter(date=today).aggregate(total=Sum('montant'))['total'] or 0

        today_expenses = Depense.objects.filter(date=today)

        total_drinks_sold = Drink.objects.filter(sale__created_at__date__range=(start_of_month, end_of_month)).aggregate(total=Count('id'))['total'] or 0

        sales_count = today_sales.count() if today_sales else 0

        low_stock_drinks = Drink.objects.filter(stock__lte=10).count()

        return {
            'total_sales': total_sales,
            'today_sales': today_sales,
            'total_expenses': total_expenses,
            'today_expenses': today_expenses,
            'total_drinks_sold': total_drinks_sold,
            'net_profit': total_sales - total_expenses,
            'sales_today': sales_today,
            'expenses_today': expenses_today,
            'sales_count': sales_count,
            'low_stock_drinks': low_stock_drinks,
            'today_net_profit': sales_today - total_today_expenses,
            'total_today_sales': sales_today,
            'total_today_expenses': total_today_expenses
        }

class FinanceReportService:
    @staticmethod
    def get_finance_report(start_date, end_date):

        sales = Sale.objects.filter(created_at__date__range=(start_date, end_date)).aggregate(total_sales=Sum('total_price'))['total_sales'] or 0

        expenses = Depense.objects.filter(date__range=(start_date, end_date)).aggregate(total_expenses=Sum('montant'))['total_expenses'] or 0

        return {
            'total_sales': sales,
            'total_expenses': expenses,
            'net_profit': sales - expenses,
        }

class SalesReportService:
    @staticmethod
    def top_drinks(start_date, end_date, limit=10):

        return Sale.objects.filter(created_at__date__range=(start_date, end_date)).values('drink__id', 'drink__name') \
            .annotate(total_sold=Sum('quantity'), drink_name=F('drink__name'), revenue=Sum('total_price')).order_by('-total_sold')[:5]
    
class SalesByDayService :
    @staticmethod
    def sales_by_day():
        return(
            Sale.objects
            .annotate(
                day=TruncDate("create_at")
            )
            .values("day")
        )
    
class SalesBySellerService : 
    @staticmethod
    def sales_by_seller():
        return(
            Sale.objects
            .values(
                "served_by__id",
                "served_by__username"
            )
            .annotate(
                total_sales=Sum("total_price"),
                total_items=Sum("quantity")
            )
            .order_by("-total_sales")
        )