from django.urls import path
from .views import fetch_articles

urlpatterns = [
    path('fetch_articles/', fetch_articles, name='fetch_articles'),
]
