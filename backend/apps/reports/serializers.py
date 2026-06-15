from rest_framework import serializers

class DashboardSerializer(serializers.Serializer):
    total_sales = serializers.FloatField()
    total_expenses = serializers.FloatField()
    net_profit = serializers.FloatField()
    sales_count = serializers.IntegerField()
    low_stock_drinks = serializers.IntegerField()
    today_net_profit = serializers.FloatField()
    total_today_sales = serializers.FloatField()
    total_today_expenses = serializers.FloatField()
    today_sales = serializers.ListField()
    today_expenses = serializers.ListField()


class FinanceReportSerializer(serializers.Serializer):
    total_sales = serializers.FloatField()
    total_expenses = serializers.FloatField()
    net_profit = serializers.FloatField()

class TopDrinksSerializer(serializers.Serializer):
    drink_name = serializers.CharField()
    total_sold = serializers.IntegerField() 