# users/urls.py
from django.urls import path
from . import api_views

urlpatterns = [
    path('auth/signup/', api_views.signup, name='signup'),
    path('auth/csrf/', api_views.set_csrf_token, name='set_csrf_token'),
]
