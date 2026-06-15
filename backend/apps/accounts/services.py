from apps.finance.models import (
    Depense
)

class DashboardService:
    @staticmethod
    def get_dashboard_data():
        # Placeholder for actual dashboard data retrieval logic
        return {
            "total_users": 100,
            "active_sessions": 5,
            "recent_activities": [
                {"user": "Alice", "action": "Logged in"},
                {"user": "Bob", "action": "Updated profile"},
            ],
        }