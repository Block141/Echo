from django.http import JsonResponse
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from users.models import UserProfile
import requests

NEWS_API_URL = 'https://newsapi.org/v2/everything'

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def fetch_articles(request):
    user = request.user
    user_profile = UserProfile.objects.get(user=user)
    interests = user_profile.interests.all()

    if not interests.exists():
        return JsonResponse({'error': 'No interests found for the user.'}, status=400)

    print(f"DEBUG: User interests: {[interest.name for interest in interests]}")

    all_articles = []

    for interest in interests:
        print(f"DEBUG: Requesting articles for interest: {interest.name}")
        response = requests.get(NEWS_API_URL, params={
            'q': interest.name,
            'apiKey': settings.NEWS_API_KEY,
            'pageSize': 20  # Fetch more articles to increase chances of valid ones
        })
        print("DEBUG: Raw response data:", response.text)  # Log the raw response data
        if response.status_code == 200:
            articles = response.json().get('articles', [])
            valid_articles = []
            for article in articles:
                if article['title'] not in ['[Removed]', 'test-section'] and article['content'] and not any(tag in article['content'] for tag in ['<li>', '<ul>']):
                    content = article['content']
                    if '...' in content:
                        content = content.split('...')[0] + '...'
                    if '[+' in content:
                        content = content.split('[+')[0]
                    valid_articles.append({
                        'title': article['title'],
                        'content': content,
                        'url': article['url'],
                        'urlToImage': article['urlToImage'],
                        'publishedAt': article['publishedAt'],
                        'source': article['source']['name']
                    })
            all_articles.extend(valid_articles[:3])  # 3 articles per interest

    if any(article.get('status') == 'error' and article.get('code') == 'rateLimited' for article in all_articles):
        return JsonResponse({'error': 'API rate limit exceeded. Please try again later.'}, status=429)

    return JsonResponse({'articles': all_articles}, safe=False)