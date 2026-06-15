from django.test import TestCase
from django.utils import timezone
from django.contrib.auth.models import User
from .models import TimeStampedModel, AuditLog


class TimeStampedModelTest(TestCase):
    """Tests pour le modèle abstrait TimeStampedModel"""

    def setUp(self):
        """Créer un objet de test"""
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )

    def test_created_at_is_set_automatically(self):
        """Vérifier que created_at est défini automatiquement"""
        audit_log = AuditLog.objects.create(
            user=self.user,
            action='CREATE',
            model_name='TestModel',
            object_id=1
        )
        self.assertIsNotNone(audit_log.created_at)
        self.assertTrue(
            (timezone.now() - audit_log.created_at).total_seconds() < 5
        )

    def test_updated_at_is_set_automatically(self):
        """Vérifier que updated_at est défini automatiquement"""
        audit_log = AuditLog.objects.create(
            user=self.user,
            action='CREATE',
            model_name='TestModel',
            object_id=1
        )
        self.assertIsNotNone(audit_log.updated_at)

    def test_updated_at_changes_on_save(self):
        """Vérifier que updated_at se met à jour lors de la sauvegarde"""
        audit_log = AuditLog.objects.create(
            user=self.user,
            action='CREATE',
            model_name='TestModel',
            object_id=1
        )
        original_updated_at = audit_log.updated_at
        
        # Attendre un moment et mettre à jour
        import time
        time.sleep(1)
        
        audit_log.description = "Updated description"
        audit_log.save()
        
        self.assertGreater(audit_log.updated_at, original_updated_at)


class AuditLogTest(TestCase):
    """Tests pour le modèle AuditLog"""

    def setUp(self):
        """Créer un utilisateur de test"""
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )

    def test_create_audit_log(self):
        """Vérifier la création d'un journal d'audit"""
        audit_log = AuditLog.objects.create(
            user=self.user,
            action='CREATE',
            model_name='Drink',
            object_id=1,
            description='Created new drink'
        )
        self.assertEqual(audit_log.user, self.user)
        self.assertEqual(audit_log.action, 'CREATE')
        self.assertEqual(audit_log.model_name, 'Drink')
        self.assertEqual(audit_log.object_id, 1)
        self.assertEqual(audit_log.description, 'Created new drink')

    def test_audit_log_without_user(self):
        """Vérifier la création d'un journal d'audit sans utilisateur"""
        audit_log = AuditLog.objects.create(
            action='SALE',
            model_name='Sale',
            object_id=1,
            description='Sale without user'
        )
        self.assertIsNone(audit_log.user)
        self.assertEqual(audit_log.action, 'SALE')

    def test_audit_log_str_representation(self):
        """Vérifier la représentation en string du journal d'audit"""
        audit_log = AuditLog.objects.create(
            user=self.user,
            action='UPDATE',
            model_name='Drink',
            object_id=1
        )
        expected_str = f"{self.user} - UPDATE - Drink - 1"
        self.assertEqual(str(audit_log), expected_str)

    def test_audit_log_action_choices(self):
        """Vérifier que les actions disponibles sont valides"""
        valid_actions = ['CREATE', 'UPDATE', 'DELETE', 'SALE', 'EXPENSE', 'STOCK_UPDATE', 'LOGIN']
        
        for action in valid_actions:
            audit_log = AuditLog.objects.create(
                user=self.user,
                action=action,
                model_name='TestModel'
            )
            self.assertEqual(audit_log.action, action)

    def test_audit_log_ordering_by_created_at(self):
        """Vérifier que les journaux d'audit sont ordonnés par created_at"""
        AuditLog.objects.create(action='CREATE', model_name='Test')
        AuditLog.objects.create(action='UPDATE', model_name='Test')
        
        # Les journaux les plus récents sont à la fin
        logs = list(AuditLog.objects.all())
        self.assertTrue(logs[0].created_at <= logs[1].created_at)
