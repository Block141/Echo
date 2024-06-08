# users/api_views.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile
from .serializers import UserSerializer
import logging

logger = logging.getLogger(__name__)

@ensure_csrf_cookie
@api_view(['POST'])
def signup(request):
    logger.debug("Signup endpoint called")
    data = request.data
    logger.debug(f"Request data: {data}")
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    logger.debug(f"Received data: username={username}, email={email}, password={password}")

    if not username or not email or not password:
        logger.error("Required fields are missing")
        return Response({'error': 'Please provide all required fields.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        logger.error("Username already exists")
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        logger.error("Email already exists")
        return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        logger.debug(f"User created: {user}")

        if not UserProfile.objects.filter(user=user).exists():
            UserProfile.objects.create(user=user)
            logger.debug(f"UserProfile created for user: {user}")

        user_serializer = UserSerializer(user)
        logger.debug(f"User serialized: {user_serializer.data}")

        response_data = {
            'user': user_serializer.data,
            'message': 'Account created successfully!'
        }
        logger.debug(f"Response data: {response_data}")

        return Response(response_data, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        return Response({'error': 'Error creating account. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@ensure_csrf_cookie
@api_view(['GET'])
def set_csrf_token(request):
    return Response({"message": "CSRF cookie set"})

@api_view(['POST'])
def login(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        user_profile = UserProfile.objects.get(user=user)
        user_serializer = UserSerializer(user)
        return Response({
            'user': user_serializer.data,
            'initial_setup_complete': user_profile.initial_setup_complete
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def mark_setup_complete(request):
    user = request.user
    try:
        user_profile = UserProfile.objects.get(user=user)
        user_profile.initial_setup_complete = True
        user_profile.save()
        return Response({'message': 'Initial setup marked as complete'}, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=status.HTTP_400_BAD_REQUEST)
