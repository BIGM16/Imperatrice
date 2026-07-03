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
    vendeur_id = serializers.IntegerField(source="served_by__id")
    vendeur_nom = serializers.CharField(source="served_by__username")
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