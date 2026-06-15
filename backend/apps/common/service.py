from .models import AuditLog

class AuditLogService:
    @staticmethod
    def log_action(*, user, action, model_name, object_id=None, description=""):
        AuditLog.objects.create(
            user=user,
            action=action,
            model_name=model_name,
            object_id=object_id,
            description=description
        )