from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Create a test user for development'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        if not User.objects.filter(username='testuser').exists():
            User.objects.create_user(username='testuser', password='testpassword')
            self.stdout.write(self.style.SUCCESS('Test user created successfully'))
        else:
            self.stdout.write(self.style.SUCCESS('Test user already exists'))
