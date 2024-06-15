from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.middleware.csrf import CsrfViewMiddleware
from django.utils.crypto import get_random_string

class CustomCsrfMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if settings.DEBUG:
            request.META['CSRF_COOKIE'] = 'static-csrf-token'
            request.META['CSRF_COOKIE_USED'] = True
        else:
            csrf_middleware = CsrfViewMiddleware()
            csrf_middleware.process_request(request)

    def process_response(self, request, response):
        if settings.DEBUG:
            response.set_cookie('csrftoken', 'static-csrf-token')
        return response
