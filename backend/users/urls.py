from django.urls import path
from . import api_views
from .views import login, set_csrf_token

urlpatterns = [
    path('auth/signup/', api_views.signup, name='signup'),
    path('auth/login/', login, name='login'),
    path('auth/csrf/', set_csrf_token, name='set-csrf-token'),
    path('auth/mark-setup-complete/', api_views.mark_setup_complete, name='mark-setup-complete'),
]
