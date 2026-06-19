from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.sales.models import Sale
from .models import AuditLog

@receiver(post_save, sender=Sale)
def create_audit_log(sender, instance, created, **kwargs):
    if created:
        AuditLog.objects.create(
            action='SALE',
            model_name='Sale',
            object_id=instance.id,
            details=f'Sale ID: {instance.id}, Total Price: {instance.total_price}, Quantity: {instance.quantity}',
            user=instance.served_by
        )