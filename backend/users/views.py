# users/views.py

from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.middleware.csrf import get_token
from django.contrib import messages
from .forms import SignUpForm
import json

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            user.refresh_from_db()  # Load the profile instance created by the signal
            user.userprofile.location = form.cleaned_data.get('location')
            user.save()
            messages.success(request, 'Account created successfully!')
            return redirect('login')
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            response = JsonResponse({'success': True})
            if settings.DEBUG:
                response.set_cookie('csrftoken', 'static-csrf-token')
            else:
                response.set_cookie('csrftoken', get_token(request))
            return response
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def set_csrf_token(request):
    response = JsonResponse({'success': True})
    if settings.DEBUG:
        response.set_cookie('csrftoken', 'static-csrf-token')
    else:
        response.set_cookie('csrftoken', get_token(request))
    return response
