# Django imports standards
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.urls import reverse_lazy

# Django auth
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib import messages

# Django vues génériques
from django.views.generic import CreateView, UpdateView, DeleteView  # ListView non utilisé

# Django utilitaires
from django.utils import timezone
from django.db.models import Sum, F
from django.views.decorators.http import require_POST
from django.forms.models import model_to_dict
from django.core import management

# Python standard
import json

# Import locaux
from .models import Drink, Sale, DailySummary, Depense, Personne
from .forms import DrinkForm, DepenseForm, PersonneForm

# =================================================================
# Vues d'authentification
# =================================================================
"""
Cette section contient les vues liées à l'authentification des utilisateurs.
Fonctionnalités :
- Connexion avec redirection selon le rôle (admin/vendeur)
- Déconnexion avec redirection vers login
"""

def login_view(request):
    """Vue de connexion avec redirection intelligente selon le rôle"""
    if request.user.is_authenticated:  # Redirection auto si déjà connecté
        if request.user.is_staff:
            return redirect("admin_dashboard")
        else:
            return redirect("seller_dashboard")

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            if user.is_staff:
                return redirect("admin_dashboard")
            else:
                return redirect("seller_dashboard")
        else:
            messages.error(request, "Identifiants incorrects.")
    return render(request, "connexion.html")


def logout_view(request):
    logout(request)
    return redirect("login")


# =================================================================
# Dashboards utilisateurs
# =================================================================
"""
Cette section contient les tableaux de bord principaux :
- Dashboard vendeur : interface de vente simplifiée
- Dashboard admin : gestion complète (produits, stocks, stats)
"""

@login_required
def seller_dashboard(request):
    """Dashboard vendeur avec liste des produits et historique récent"""
    # @login_required already protège cette vue
    # rediriger vers la page de login si besoin (nom d'URL : "login")

    if request.user.is_staff:
        return redirect("admin_dashboard")  # admin ne peut pas aller sur seller

    drinks = Drink.objects.all()
    sales = Sale.objects.order_by("-created_at")[:10]
    # total peut être calculé côté BD si besoin, ici on garde le calcul simple
    total = sum(s.total for s in sales)
    return render(request, "seller_dashboard.html", {"drinks": drinks, "sales": sales, "total": total})


# -------- Tableau de bord admin ----------
@login_required
def admin_dashboard(request):
    if not request.user.is_staff:
        return redirect("seller_dashboard")

    today = timezone.now().date()

    drinks = Drink.objects.all()
    last_sales = Sale.objects.order_by('-created_at')[:10]
    sales = Sale.objects.filter(created_at__date=today)
    total_sales = sales.aggregate(Sum('total'))['total__sum'] or 0
    total_benefice = sales.aggregate(Sum('benefice_total'))['benefice_total__sum'] or 0
    total_today = sales.count()
    total_drinks = drinks.count()

    # ✅ Dépenses du jour
    depenses = Depense.objects.filter(date=today)
    total_depenses = depenses.aggregate(Sum('montant'))['montant__sum'] or 0
    # Liste des personnes connues (pour le select du formulaire)
    personnes = Personne.objects.order_by('name')
    
    # ✅ Bénéfice net
    benefice_net = total_benefice - total_depenses

    # ✅ Statistiques par boisson (pour la journée)
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

    context = {
        "drinks": drinks,
        "last_sales": last_sales,
        "stats": stats,
        "total_sales": total_sales,
        "total_benefice": total_benefice,
        "total_depenses": total_depenses,
        "benefice_net": benefice_net,
        "depenses": depenses,
        "personnes": personnes,
        "total_today": total_today,
        "total_drinks": total_drinks,
    }
    return render(request, "admin_dashboard.html", context)


# =================================================================
# API Endpoints (AJAX)
# =================================================================
"""
Cette section contient tous les endpoints API/AJAX :
- Enregistrement des ventes
- Génération de résumés
- CRUD des boissons (create, read, update, delete)
- Gestion des stocks

Tous ces endpoints :
- Requièrent une authentification
- Retournent du JSON
- Utilisent CSRF
"""

@login_required
def api_record_sale(request):
    """Enregistre une nouvelle vente et met à jour le stock
    
    Requête attendue:
    {
        "drink_id": int,
        "quantity": int
    }
    """
    if request.method != "POST":
        return JsonResponse({"error": "Méthode non autorisée"}, status=405)

    try:
        data = json.loads(request.body)
        drink_id = data.get("drink_id")
        qty = int(data.get("quantity", 1))
        drink = Drink.objects.get(pk=drink_id)
        # Utiliser le prix de vente pour le calcul en production
        total = drink.prix_vente * qty

        # Vérifier le stock avant toute modification
        if drink.stock < qty:
            return JsonResponse({"ok": False, "warning": "Stock insuffisant pour cette vente."}, status=409)

        # Décrémenter une seule fois
        drink.stock = max(drink.stock - qty, 0)
        drink.save()

        sale = Sale.objects.create(drink=drink, quantity=qty, total=total, seller=request.user)

        return JsonResponse({
            "ok": True,
            "name": drink.name,
            "price": float(drink.prix_vente),
            "quantity": qty,
            "remaining_stock": drink.stock,
            "total": float(total),
            "sale_id": sale.id,
            "created_at": sale.created_at.isoformat(),
        }, status=201)

    except Drink.DoesNotExist:
        return JsonResponse({"error": "Boisson introuvable"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

# -------- API: générer résumé quotidien manuellement ----------
@login_required
def generer_resume_ajax(request):
    """Génère le résumé quotidien manuellement (via le bouton)."""
    if request.method == "POST":
        # Appeler la commande management en-process (plus sûr que subprocess)
        management.call_command("generer_resume_de_vente")
        return JsonResponse({"ok": True, "message": "Résumé du jour généré avec succès ✅"})
    return JsonResponse({"ok": False, "error": "Requête invalide."})

# =================================================================
# Vues CRUD pour les produits
# =================================================================
"""
Cette section contient les vues de base pour le CRUD des produits.
Note : Ces vues sont principalement utilisées comme fallback,
la majorité des opérations se font via AJAX dans le dashboard admin.

Structure :
- StaffRequiredMixin : Restriction d'accès aux admins
- DrinkCreateView : Création de produit
- DrinkUpdateView : Modification de produit
- DrinkDeleteView : Suppression de produit
"""

class StaffRequiredMixin(UserPassesTestMixin):
    """Mixin pour restreindre l'accès aux utilisateurs staff uniquement"""
    def test_func(self):
        return self.request.user.is_staff

# Note: la liste est intégrée dans `admin_dashboard.html` (modals utilisés pour add/edit/delete).
# Si quelqu'un visite /drinks/ on le redirige vers le dashboard admin.

class DrinkCreateView(LoginRequiredMixin, StaffRequiredMixin, CreateView):
    model = Drink
    form_class = DrinkForm
    # Le formulaire est présenté dans un modal sur admin_dashboard;
    # pour toute requête GET on redirige vers le dashboard.
    template_name = None
    success_url = reverse_lazy('admin_dashboard')

    def form_valid(self, form):
        messages.success(self.request, f"La boisson {form.instance.name} a été ajoutée avec succès.")
        return super().form_valid(form)

    def get(self, request, *args, **kwargs):
        # Les modals affichent le formulaire sur admin_dashboard. Ne pas exposer
        # une page standalone: rediriger vers le dashboard.
        return redirect('admin_dashboard')

class DrinkUpdateView(LoginRequiredMixin, StaffRequiredMixin, UpdateView):
    model = Drink
    form_class = DrinkForm
    template_name = None
    success_url = reverse_lazy('admin_dashboard')

    def form_valid(self, form):
        messages.success(self.request, f"La boisson {form.instance.name} a été mise à jour.")
        return super().form_valid(form)

    def get(self, request, *args, **kwargs):
        return redirect('admin_dashboard')

class DrinkDeleteView(LoginRequiredMixin, StaffRequiredMixin, DeleteView):
    model = Drink
    # La confirmation est gérée par un modal sur admin_dashboard
    template_name = None
    success_url = reverse_lazy('admin_dashboard')
    
    def delete(self, request, *args, **kwargs):
        drink = self.get_object()
        messages.success(request, f"La boisson {drink.name} a été supprimée.")
        return super().delete(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return redirect('admin_dashboard')

# @login_required
# def update_stock(request, pk):
#     if not request.user.is_staff:
#         messages.error(request, "Accès refusé.")
#         return redirect('drink_list')
        
#     drink = get_object_or_404(Drink, pk=pk)
#     action = request.POST.get('action')
    
#     try:
#         if action == 'add':
#             drink.stock += 1
#         elif action == 'remove':
#             drink.stock = max(0, drink.stock - 1)
#         drink.save()
#         messages.success(request, f"Stock de {drink.name} mis à jour : {drink.stock}")
#     except Exception as e:
#         messages.error(request, f"Erreur lors de la mise à jour du stock : {str(e)}")
    
#     return redirect('admin_dashboard')


# =================================================================
# Endpoints AJAX pour CRUD Boissons
# =================================================================
"""
Cette section contient les endpoints AJAX spécifiques aux opérations CRUD
sur les boissons. Ces endpoints sont utilisés par le dashboard admin
pour les opérations asynchrones.

Endpoints disponibles :
- create_drink_ajax : Création d'une nouvelle boisson
- edit_drink_ajax : Modification d'une boisson existante
- delete_drink_ajax : Suppression d'une boisson
- update_stock_ajax : Mise à jour du stock

Sécurité :
- Requiert authentification (@login_required)
- Requiert méthode POST (@require_POST)
- Vérifie les permissions staff
- Validation des données via DrinkForm
"""

@login_required
@require_POST
def create_depense_ajax(request):
    """Création d'une dépense occasionnelle via AJAX"""
    if not request.user.is_staff:
        return JsonResponse({"ok": False, "error": "Accès refusé."}, status=403)

    # Supporter deux modes d'envoi pour 'responsable':
    # - soit l'id d'une Personne existante
    # - soit un nom en texte libre (créera ou récupérera la Personne si valide)
    post = request.POST.copy()
    responsable_val = post.get('responsable')
    if responsable_val:
        # si c'est un entier, on laisse tel quel (id)
        try:
            responsable_id = int(responsable_val)
            post['responsable'] = responsable_id
        except (ValueError, TypeError):
            # sinon on cherche/crée la personne par nom
            nom = responsable_val.strip()
            if nom:
                personne = None
                try:
                    personne = Personne.objects.get(name=nom)
                except Personne.DoesNotExist:
                    # créer après validation via form
                    p = Personne(name=nom)
                    try:
                        p.full_clean()
                        p.save()
                        personne = p
                    except Exception:
                        # nom invalide -> laisser tel quel et laisser le form reporter l'erreur
                        personne = None
                if personne:
                    post['responsable'] = personne.id

    form = DepenseForm(post)
    if form.is_valid():
        depense = form.save()
        return JsonResponse({
            "ok": True,
            "message": f"Dépense '{depense.motif}' enregistrée.",
            "depense": {
                "id": depense.id,
                "motif": depense.motif,
                "montant": float(depense.montant),
                "responsable": depense.responsable.name if depense.responsable else None,
                "date": depense.date.strftime("%d/%m")
            }
        }, status=201)
    else:
        return JsonResponse({"ok": False, "errors": form.errors}, status=400)


@login_required
@require_POST
def delete_depense_ajax(request, pk):
    """Suppression d'une dépense via AJAX"""
    if not request.user.is_staff:
        return JsonResponse({"ok": False, "error": "Accès refusé."}, status=403)

    try:
        depense = Depense.objects.get(pk=pk)
        depense.delete()
        return JsonResponse({"ok": True, "message": "Dépense supprimée."}, status=200)
    except Depense.DoesNotExist:
        return JsonResponse({"ok": False, "error": "Dépense introuvable."}, status=404)

@login_required
@require_POST
def create_drink_ajax(request):
    """Création d'une nouvelle boisson via AJAX"""
    if not request.user.is_staff:
        return JsonResponse({"ok": False, "error": "Accès refusé."}, status=403)

    form = DrinkForm(request.POST)
    if form.is_valid():
        drink = form.save()
        return JsonResponse({
            "ok": True,
            "message": f"Boisson '{drink.name}' ajoutée.",
            "drink": model_to_dict(drink)
        }, status=201)
    else:
        return JsonResponse({"ok": False, "errors": form.errors}, status=400)


@login_required
@require_POST
def edit_drink_ajax(request, pk):
    if not request.user.is_staff:
        return JsonResponse({"ok": False, "error": "Accès refusé."}, status=403)

    drink = get_object_or_404(Drink, pk=pk)
    form = DrinkForm(request.POST, instance=drink)
    if form.is_valid():
        drink = form.save()
        return JsonResponse({"ok": True, "message": f"{drink.name} mis à jour.", "drink": model_to_dict(drink)}, status=200)
    else:
        return JsonResponse({"ok": False, "errors": form.errors}, status=400)


@login_required
@require_POST
def delete_drink_ajax(request, pk):
    if not request.user.is_staff:
        return JsonResponse({"ok": False, "error": "Accès refusé."}, status=403)

    try:
        drink = Drink.objects.get(pk=pk)
        drink.delete()
        return JsonResponse({"ok": True, "message": "Boisson supprimée."}, status=200)
    except Drink.DoesNotExist:
        return JsonResponse({"ok": False, "error": "Boisson introuvable."}, status=404)


@login_required
@require_POST
def update_stock_ajax(request, pk):
    if not request.user.is_staff:
        return JsonResponse({"ok": False, "error": "Accès refusé."}, status=403)

    try:
        drink = Drink.objects.get(pk=pk)
        action = request.POST.get('action')
        qty = int(request.POST.get('quantity', 1))

        if action == 'add':
            drink.stock += qty
        elif action == 'remove':
            drink.stock = max(0, drink.stock - qty)
        else:
            return JsonResponse({"ok": False, "error": "Action invalide."}, status=400)

        drink.save()
        return JsonResponse({"ok": True, "message": "Stock mis à jour.", "new_stock": drink.stock}, status=200)
    except Drink.DoesNotExist:
        return JsonResponse({"ok": False, "error": "Boisson introuvable."}, status=404)


# ----------------- Page historique des ventes -----------------
@login_required
def sales_history(request):
    if not request.user.is_staff:
        return redirect('seller_dashboard')

    sales = Sale.objects.order_by('-created_at')
    drinks = Drink.objects.order_by('name')

    # Filtres
    drink_id = request.GET.get('drink')
    date_debut = request.GET.get('date_debut')
    date_fin = request.GET.get('date_fin')

    if drink_id:
        sales = sales.filter(drink_id=drink_id)
    
    if date_debut:
        sales = sales.filter(created_at__date__gte=date_debut)
    
    if date_fin:
        sales = sales.filter(created_at__date__lte=date_fin)

    # Calcul du total filtré
    total_filtre = sales.aggregate(Sum('total'))['total__sum'] or 0

    context = {
        'sales': sales,
        'drinks': drinks,
        'selected_drink': drink_id,
        'date_debut': date_debut,
        'date_fin': date_fin,
        'total_filtre': total_filtre
    }
    return render(request, 'sales_history.html', context)

# ------------- Page historique des dépenses ------------------


@login_required
def depense_history(request):
    """Page historique des dépenses avec filtres par date et par personne."""
    if not request.user.is_staff:
        return redirect('seller_dashboard')

    depenses = Depense.objects.order_by('-date', '-id')
    personnes = Personne.objects.order_by('name')

    # Filtres
    personne_id = request.GET.get('personne')
    date_debut = request.GET.get('date_debut')
    date_fin = request.GET.get('date_fin')

    if personne_id:
        depenses = depenses.filter(responsable_id=personne_id)

    if date_debut:
        depenses = depenses.filter(date__gte=date_debut)

    if date_fin:
        depenses = depenses.filter(date__lte=date_fin)

    total_filtre = depenses.aggregate(Sum('montant'))['montant__sum'] or 0

    context = {
        'depenses': depenses,
        'personnes': personnes,
        'selected_personne': personne_id,
        'date_debut': date_debut,
        'date_fin': date_fin,
        'total_filtre': total_filtre,
    }
    return render(request, 'depense_history.html', context)