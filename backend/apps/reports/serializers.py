from rest_framework import serializers


class DashboardStatistiquesSerializer(serializers.Serializer):
    chiffre_affaires_aujourd_hui = serializers.FloatField()
    depenses_aujourd_hui = serializers.FloatField()
    benefice_net_aujourd_hui = serializers.FloatField()
    nombre_ventes_aujourd_hui = serializers.IntegerField()
    boissons_en_faible_stock = serializers.IntegerField()
    chiffre_affaires_mensuel = serializers.FloatField()
    depenses_mensuelles = serializers.FloatField()
    benefice_net_mensuel = serializers.FloatField()
    total_boissons_vendues = serializers.IntegerField()


class RapportFinancierSerializer(serializers.Serializer):
    chiffre_affaires = serializers.FloatField()
    depenses = serializers.FloatField()
    benefice_net = serializers.FloatField()


class TopBoissonSerializer(serializers.Serializer):
    nom_boisson = serializers.CharField()
    quantite_vendue = serializers.IntegerField()
    chiffre_affaires = serializers.FloatField()


class VenteParJourSerializer(serializers.Serializer):
    jour = serializers.DateField()
    chiffre_affaires = serializers.FloatField()
    nombre_articles = serializers.IntegerField()


class VenteParVendeurSerializer(serializers.Serializer):
    vendeur_id = serializers.IntegerField()
    vendeur_nom = serializers.CharField()
    chiffre_affaires = serializers.FloatField()
    nombre_articles = serializers.IntegerField()


class VenteRecenteSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nom_boisson = serializers.CharField(source="drink__name")
    quantite = serializers.IntegerField(source="quantity")
    montant_total = serializers.FloatField(source="total_price")
    vendeur = serializers.CharField(source="served_by__username")
    date = serializers.DateTimeField(source="created_at")


class TableauDeBordSerializer(serializers.Serializer):
    statistiques = DashboardStatistiquesSerializer()
    rapport_financier = RapportFinancierSerializer()
    top_boissons = TopBoissonSerializer(many=True)
    ventes_par_jour = VenteParJourSerializer(many=True)
    ventes_par_vendeur = VenteParVendeurSerializer(many=True)
    ventes_recentes = VenteRecenteSerializer(many=True)


class DashboardStatsRawSerializer(serializers.Serializer):
    total_sales = serializers.FloatField(source="chiffre_affaires_mensuel")
    total_expenses = serializers.FloatField(source="depenses_mensuelles")
    total_drinks_sold = serializers.IntegerField(source="total_boissons_vendues")
    net_profit = serializers.FloatField(source="benefice_net_mensuel")
    sales_today = serializers.FloatField(source="chiffre_affaires_aujourd_hui")
    expenses_today = serializers.FloatField(source="depenses_aujourd_hui")
    sales_count = serializers.IntegerField(source="nombre_ventes_aujourd_hui")
    low_stock_drinks = serializers.IntegerField(source="boissons_en_faible_stock")
    today_net_profit = serializers.FloatField(source="benefice_net_aujourd_hui")
    total_today_sales = serializers.FloatField(source="chiffre_affaires_aujourd_hui")
    total_today_expenses = serializers.FloatField(source="depenses_aujourd_hui")


class SalesByDaySerializer(serializers.Serializer):
    day = serializers.DateField(source="jour")
    total_sales = serializers.FloatField(source="chiffre_affaires")
    sales_count = serializers.IntegerField(source="nombre_articles")


class SalesBySellerSerializer(serializers.Serializer):
    served_by__id = serializers.IntegerField(source="vendeur_id")
    served_by__username = serializers.CharField(source="vendeur_nom")
    total_sales = serializers.FloatField(source="chiffre_affaires")
    total_items = serializers.IntegerField(source="nombre_articles")


class TopDrinkSerializer(serializers.Serializer):
    drink_name = serializers.CharField(source="nom_boisson")
    total_sold = serializers.IntegerField(source="quantite_vendue")
    revenue = serializers.FloatField(source="chiffre_affaires")