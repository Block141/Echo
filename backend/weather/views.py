import requests
from django.http import JsonResponse
from django.conf import settings

def get_weather(request, city=None):
    api_key = settings.WEATHER_API_KEY
    default_city = "Chicago"
    city = city or default_city 

    url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
    response = requests.get(url)
    response.raise_for_status()
    
    weather_data = response.json()
    
    if 'error' in weather_data:
        return JsonResponse(weather_data, status=400)
    else:
        response_data = {
            'city': weather_data['name'],
            'country': weather_data['sys']['country'],
            'description': weather_data['weather'][0]['description'],
            'temperature': weather_data['main']['temp'],
            'humidity': weather_data['main']['humidity'],
            'wind_speed': weather_data['wind']['speed'],
        }
        return JsonResponse(response_data)
