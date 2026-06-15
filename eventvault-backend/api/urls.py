from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from api.views import (
    UserRegistrationViewSet,
    EventViewSet,
    TicketViewSet,
    AgentInvitationViewSet,
    AgentVerificationView,
    AgentSyncView
)

router = DefaultRouter()
router.register(r'auth/register', UserRegistrationViewSet, basename='register')
router.register(r'events', EventViewSet, basename='event')
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'invitations', AgentInvitationViewSet, basename='invitation')

urlpatterns = [
    # Router endpoints
    path('', include(router.urls)),
    
    # JWT authentication endpoints
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Custom agent endpoints
    path('agent/verify/', AgentVerificationView.as_view(), name='agent-verify'),
    path('agent/events/<int:event_id>/sync/', AgentSyncView.as_view(), name='agent-sync'),
]
