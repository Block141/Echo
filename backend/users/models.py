# users/models.py
from django.contrib.auth.models import User
from django.db import models

class Interest(models.Model):
    name = models.CharField(max_length=100)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    interests = models.ManyToManyField(Interest)
    location = models.CharField(max_length=100)
