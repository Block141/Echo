from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import requests
from .models import Article
from users.models import UserProfile, Interest  # Ensure Interest is imported

NEWS_API_KEY = '31cfe4cb326c4943af5583bc5d45fdba'
NEWS_API_URL = 'https://newsapi.org/v2/everything'

@csrf_exempt
def fetch_articles(request):
    if request.method == 'POST':
        # In development, use a dummy user profile
        if settings.DEBUG:
            user_profile = UserProfile.objects.first()
            print(f"DEBUG: Using dummy user profile: {user_profile}")
            if not user_profile.interests.exists():
                print("DEBUG: Dummy user profile has no interests. Adding default interests.")
                interest1, _ = Interest.objects.get_or_create(name='Technology')
                interest2, _ = Interest.objects.get_or_create(name='Automotive')
                user_profile.interests.add(interest1, interest2)
                user_profile.save()
                print(f"DEBUG: Added interests: {[interest1.name, interest2.name]}")
        else:
            user = request.user
            if user.is_authenticated:
                user_profile = UserProfile.objects.get(user=user)
                print(f"DEBUG: Authenticated user profile: {user_profile}")
            else:
                print("DEBUG: User not authenticated")
                return JsonResponse({'error': 'User not authenticated'}, status=401)

        interests = user_profile.interests.all()
        print(f"DEBUG: User interests: {[interest.name for interest in interests]}")

        all_articles = []

        for interest in interests:
            print(f"DEBUG: Requesting articles for interest: {interest.name}")
            response = requests.get(NEWS_API_URL, params={
                'q': interest.name,
                'apiKey': NEWS_API_KEY,
                'pageSize': 20  # Fetch more articles to increase chances of valid ones
            })
            print("DEBUG: Raw response data:", response.text)  # Log the raw response data
            if response.status_code == 200:
                articles = response.json().get('articles', [])
                valid_articles = [
                    {
                        'title': article['title'],
                        'content': article['content'],
                        'url': article['url'],
                        'urlToImage': article['urlToImage'],
                        'publishedAt': article['publishedAt'],
                        'source': article['source']['name']
                    }
                    #'</n>'
                    for article in articles if article['title'] != '[Removed]' and article['title'] != 'test-setcion' and not any(tag in article['content'] for tag in ['<li>', '<ul>'])
                ]
                all_articles.extend(valid_articles[:3])  # 3 articles per interest

        if any(article.get('status') == 'error' and article.get('code') == 'rateLimited' for article in all_articles):
            return JsonResponse({'error': 'API rate limit exceeded. Please try again later.'}, status=429)

        return JsonResponse({'articles': all_articles}, safe=False)
    return JsonResponse({'error': 'Invalid request method'}, status=400)