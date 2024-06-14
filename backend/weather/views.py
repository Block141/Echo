import requests
from django.http import JsonResponse

def get_weather(api_key, city):
    api_key = 'e034bb0455bc73715ce8bb452391ee65'
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
            # Add more fields as needed
        }
        return JsonResponse(response_data)



    url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        return response.json()
    except requests.RequestException as e:
        # Log the error for debugging purposes
        print(f"Request to OpenWeatherMap API failed: {e}")
        return {'error': 'Failed to fetch weather data'}