from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminUserCustom(BasePermission):
    """
    Custom permission to only allow admin users to access certain views.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff

class IsSellerOrAdmin(BasePermission):
    """
    Custom permission to only allow sellers or admins to access certain views.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated

class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return (
                request.user 
                and request.user.is_authenticated
            )
        return (
            request.user and request.user.is_authenticated and request.user.is_staff
        )