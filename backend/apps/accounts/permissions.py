from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminUserCustom(BasePermission):
    """
    Custom permission to only allow admin users to access certain views.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class IsSellerOrAdmin(BasePermission):
    """
    Custom permission to only allow sellers or admins to access certain views.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Ajoute ta logique de vendeur ici plus tard (ex: hasattr(request.user, 'seller_profile'))
        # Pour l'instant, on laisse passer si c'est un admin ou un utilisateur connecté (selon ton test actuel)
        return request.user.is_staff or request.user.is_authenticated


class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any request (vrai Read-Only)
        if request.method in SAFE_METHODS:
            return True
            
        # Écriture : restriction stricte aux admins connectés
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)