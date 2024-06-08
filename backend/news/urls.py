# news/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Assuming you have an 'index' view
]
