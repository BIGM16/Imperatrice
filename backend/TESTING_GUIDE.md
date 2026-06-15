# 📋 Guide Complet des Tests - Imperatrice Backend

## Vue d'ensemble

Ce document fournit un guide complet de tous les tests écrits pour le backend Imperatrice. Les tests couvrent :

- **Modèles** : Validation des données, relations, méthodes
- **Services** : Logique métier et transactions
- **Serializers** : Sérialisation et désérialisation des données
- **Permissions** : Contrôle d'accès aux endpoints
- **ViewSets** : Endpoints CRUD et interactions API

---

## 📚 Structure des Tests

### 1. **apps/common/tests.py**

Tests pour les modèles abstraits et les journaux d'audit.

#### Classes de test:

- `TimeStampedModelTest` : Tests pour le modèle abstrait avec timestamps
- `AuditLogTest` : Tests pour le journal d'audit complet

#### Tests clés:

```bash
python manage.py test apps.common
```

- ✓ Vérifier que `created_at` est défini automatiquement
- ✓ Vérifier que `updated_at` se met à jour lors de la sauvegarde
- ✓ Tester toutes les actions d'audit (CREATE, UPDATE, DELETE, SALE, EXPENSE, STOCK_UPDATE, LOGIN)
- ✓ Vérifier l'ordonnancement des logs

---

### 2. **apps/accounts/tests.py**

Tests pour l'authentification, les utilisateurs et les permissions.

#### Classes de test:

- `UserSerializerTest` : Sérialisation des utilisateurs
- `MeAPIViewTest` : Endpoint `/me/` pour obtenir l'utilisateur actuel
- `StatsViewTest` : Endpoint `/stats/` pour les statistiques
- `PermissionsTest` : Permissions personnalisées (IsAdminUserCustom, IsSellerOrAdmin, IsAdminOrReadOnly)
- `UserIntegrationTest` : Tests d'intégration utilisateur

#### Tests clés:

```bash
python manage.py test apps.accounts
```

- ✓ Vérifier la sérialisation correcte des utilisateurs
- ✓ Tester l'authentification requise pour `/me/`
- ✓ Vérifier que seuls les admins peuvent accéder à `/stats/`
- ✓ Tester les permissions pour chaque rôle utilisateur
- ✓ Vérifier le hachage sécurisé des mots de passe

---

### 3. **apps/inventory/tests.py**

Tests pour la gestion des boissons et des stocks.

#### Classes de test:

- `CategoryModelTest` : Modèle des catégories de boissons
- `IngredientModelTest` : Modèle des ingrédients
- `DrinkModelTest` : Modèle des boissons avec calculs de bénéfice
- `DrinkIngredientModelTest` : Relations boisson-ingrédient
- `DrinkSerializerTest` : Sérialisation des boissons
- `InventoryServiceTest` : Service de gestion des stocks
- `DrinkViewSetTest` : CRUD des boissons

#### Tests clés:

```bash
python manage.py test apps.inventory
```

- ✓ Créer/modifier/supprimer des catégories et boissons
- ✓ Vérifier que les noms sont uniques
- ✓ Calculer le bénéfice unitaire (prix_vente - prix_achat)
- ✓ Gérer le stock (ajouter/retirer avec validations)
- ✓ Vérifier les permissions (lecture seule pour non-admins)
- ✓ Valider que les prix/stock ne sont pas négatifs

---

### 4. **apps/sales/tests.py**

Tests pour la gestion des ventes.

#### Classes de test:

- `SaleModelTest` : Modèle des ventes
- `SaleItemModelTest` : Modèle des articles de vente
- `SaleSerializerTest` : Sérialisation des ventes
- `SaleCreateSerializerTest` : Validation de création de vente
- `SaleServiceTest` : Service de création de vente avec logique métier
- `SaleViewSetTest` : CRUD des ventes

#### Tests clés:

```bash
python manage.py test apps.sales
```

- ✓ Créer une vente avec automatisation des prix
- ✓ Vérifier que la quantité doit être >= 1
- ✓ Valider le stock suffisant avant de vendre
- ✓ Réduire automatiquement le stock après une vente
- ✓ Vérifier que seuls les utilisateurs authentifiés peuvent vendre
- ✓ Tester les transactions atomiques pour la cohérence

---

### 5. **apps/finance/tests.py**

Tests pour la gestion des finances et dépenses.

#### Classes de test:

- `PersonneModelTest` : Modèle des personnes responsables
- `DepenseModelTest` : Modèle des dépenses
- `DepenseSerializerTest` : Sérialisation des dépenses
- `PersonSerializerTest` : Sérialisation des personnes
- `DepenseViewSetTest` : CRUD des dépenses
- `PersonneViewSetTest` : CRUD des personnes
- `FinanceIntegrationTest` : Tests d'intégration financière

#### Tests clés:

```bash
python manage.py test apps.finance
```

- ✓ Créer des dépenses avec responsable
- ✓ Valider les noms (max 10 caractères, lettres seulement, accentuées acceptées)
- ✓ Ordonnancer les dépenses par date décroissante
- ✓ Calculer les totaux de dépenses
- ✓ Vérifier les permissions d'admin pour les dépenses
- ✓ Gérer les références NULL pour les responsables

---

### 6. **apps/reports/tests.py**

Tests pour les services et rapports analytiques.

#### Classes de test:

- `DashboardServiceTest` : Service de tableau de bord
- `FinanceReportServiceTest` : Service de rapport financier
- `SalesReportServiceTest` : Service de top ventes
- `DashboardSerializerTest` : Sérialisation du dashboard
- `FinanceReportSerializerTest` : Sérialisation du rapport financier
- `TopDrinksSerializerTest` : Sérialisation des top boissons
- `ReportsViewsTest` : Endpoints de rapports

#### Tests clés:

```bash
python manage.py test apps.reports
```

- ✓ Récupérer les statistiques du dashboard (ventes, dépenses, profit)
- ✓ Générer des rapports financiers par plage de dates
- ✓ Obtenir le top 5 des boissons les plus vendues
- ✓ Calculer les boissons en faible stock
- ✓ Vérifier les permissions d'accès aux rapports
- ✓ Tester les filtres par date

---

## 🧪 Commandes de Test Utiles

### Exécuter tous les tests

```bash
python manage.py test
```

### Exécuter les tests d'une app spécifique

```bash
python manage.py test apps.inventory
python manage.py test apps.sales
python manage.py test apps.finance
```

### Exécuter une classe de test spécifique

```bash
python manage.py test apps.inventory.tests.DrinkModelTest
```

### Exécuter une méthode de test spécifique

```bash
python manage.py test apps.inventory.tests.DrinkModelTest.test_benefice_unitaire
```

### Exécuter avec verbosité

```bash
python manage.py test --verbosity=2
```

### Voir la couverture de tests

```bash
# Installer coverage
pip install coverage

# Exécuter les tests avec couverture
coverage run --source='.' manage.py test

# Générer un rapport
coverage report
coverage html  # Génère un rapport HTML
```

### Exécuter les tests en parallèle

```bash
python manage.py test --parallel
```

---

## 📊 Couverture de Tests

### Couverture par app

| App       | Modèles | Services | Permissions | ViewSets | Serializers |
| --------- | ------- | -------- | ----------- | -------- | ----------- |
| common    | ✓       | -        | -           | -        | -           |
| accounts  | ✓       | -        | ✓           | ✓        | ✓           |
| inventory | ✓✓      | ✓        | ✓           | ✓        | ✓           |
| sales     | ✓✓      | ✓        | ✓           | ✓        | ✓           |
| finance   | ✓✓      | -        | ✓           | ✓        | ✓           |
| reports   | -       | ✓✓       | ✓           | ✓        | ✓           |

---

## 🎯 Cas de Test Clés par Domaine

### Tests de Modèles

- ✓ Création avec données valides
- ✓ Validation des contraintes (unique, max_length, min_value)
- ✓ Relations ForeignKey et ManyToMany
- ✓ Méthodes personnalisées (`benefice_unitaire()`, `__str__()`)
- ✓ Timestamps automatiques (created_at, updated_at)

### Tests de Services

- ✓ Transactions atomiques
- ✓ Gestion des erreurs (stock insuffisant, données invalides)
- ✓ Logique métier complexe (calculs, mises à jour en cascade)
- ✓ Audit logging

### Tests de Permissions

- ✓ Accès non-authentifié → 401
- ✓ Accès authentifié non-autorisé → 403
- ✓ Accès autorisé → 200
- ✓ Méthodes sûres (GET) vs destructives (DELETE)

### Tests d'API

- ✓ GET (list, retrieve)
- ✓ POST (create)
- ✓ PATCH (update)
- ✓ DELETE (delete)
- ✓ Paramètres de requête et filtres

---

## 🚀 Bonnes Pratiques

### 1. Organiser les tests

```python
class MyModelTest(TestCase):
    def setUp(self):
        """Créer les données de test"""
        self.object = MyModel.objects.create(...)

    def test_something(self):
        """Tester quelque chose"""
        self.assertEqual(self.object.field, expected)
```

### 2. Nommer les tests clairement

```python
# Bon
def test_create_drink_with_valid_data(self):
def test_remove_stock_raises_error_when_insufficient(self):

# Mauvais
def test_drink(self):
def test_error(self):
```

### 3. Tester une seule chose par test

```python
# Bon
def test_benefice_calculation(self):
    drink = Drink.objects.create(..., price_purchase=100, price_sale=300)
    self.assertEqual(drink.benefice_unitaire(), 200)

# Mauvais
def test_drink_everything(self):
    drink = Drink.objects.create(...)
    self.assertEqual(drink.benefice_unitaire(), 200)
    self.assertEqual(str(drink), "...")
    # ...
```

### 4. Utiliser des fixtures ou factories si besoin

```python
# Considérer factory_boy pour les données complexes
from factory import DjangoModelFactory

class DrinkFactory(DjangoModelFactory):
    class Meta:
        model = Drink

    name = "Test Drink"
    price_sale = 500
```

---

## 📝 Exemple d'Exécution

```bash
$ python manage.py test apps.inventory.tests.DrinkModelTest.test_benefice_unitaire -v 2

test_benefice_unitaire (apps.inventory.tests.DrinkModelTest) ... ok

Ran 1 test in 0.123s

OK
```

---

## 🐛 Débogage des Tests

### Afficher les requêtes SQL

```python
from django.test.utils import override_settings

@override_settings(DEBUG=True)
def test_something(self):
    from django.db import connection
    # ...
    print(connection.queries)  # Voir les requêtes SQL
```

### Utiliser pdb

```python
def test_something(self):
    import pdb; pdb.set_trace()
    # Code débogué
```

### Voir la sortie

```bash
python manage.py test --debug-mode  # Voir les détails des erreurs
```

---

## 📈 Prochaines Étapes

1. **Augmenter la couverture** : Viser au minimum 80%+ de couverture
2. **Tests d'intégration** : Tester les workflows complets
3. **Tests de performance** : Benchmark des queries
4. **Tests E2E** : Tester depuis le frontend (utiliser Selenium/Playwright)
5. **Continuous Integration** : Exécuter les tests automatiquement lors des commits

---

## 📞 Questions Courantes

**Q: Pourquoi les tests ViewSet sont commentés?**
A: Adapter les URL selon votre configuration Django (par exemple, `/api/v1/...`)

**Q: Comment tester une vue qui demande une authentification?**
A: Utiliser `self.client.force_authenticate(user=user)`

**Q: Comment tester les filtres et recherches?**
A: Vérifier avec `response = self.client.get(url, {'filter': 'value'})`

---

**Généré pour le projet Imperatrice**
**Dernière mise à jour**: 2026-06-15
