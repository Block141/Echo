# users/serializers.py
from rest_framework import serializers
from .models import UserProfile, Interest

class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['id', 'name']

class UserProfileSerializer(serializers.ModelSerializer):
    interests = InterestSerializer(many=True)

    class Meta:
        model = UserProfile
        fields = ['user', 'interests', 'location']
