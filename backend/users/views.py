# users/views.py
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.middleware.csrf import get_token
from users.models import Interest, UserProfile
import json

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        if not email or not username or not password:
            return JsonResponse({'error': 'Missing fields'}, status=400)
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        return JsonResponse({'success': 'User created successfully'}, status=201)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            user_profile = user.userprofile
            refresh = RefreshToken.for_user(user)
            response = JsonResponse({
                'success': True,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'initial_setup_complete': user_profile.initial_setup_complete
            })
            response.set_cookie('csrftoken', get_token(request))  # Always set the real CSRF token
            return response
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_interests(request):
    user = request.user
    data = request.data
    interests = data.get('interests', [])

    if not interests:
        return Response({'error': 'No interests provided'}, status=status.HTTP_400_BAD_REQUEST)

    user_profile = UserProfile.objects.get(user=user)
    user_profile.interests.clear()

    for interest_name in interests:
        interest, created = Interest.objects.get_or_create(name=interest_name)
        user_profile.interests.add(interest)

    user_profile.initial_setup_complete = True
    user_profile.save()

    return Response({'success': 'Interests saved successfully'}, status=status.HTTP_200_OK)


@csrf_exempt
def set_csrf_token(request):
    response = JsonResponse({'success': True})
    response.set_cookie('csrftoken', get_token(request))  # Always set the real CSRF token
    return response
