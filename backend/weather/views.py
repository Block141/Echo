# weather/views.py
from django.http import HttpResponse

def index(request):
    return HttpResponse("This is the weather index page.")