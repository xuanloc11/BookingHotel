import json
import logging
from django.http import JsonResponse, HttpResponseForbidden
from app.utils.formatters import convert_currency, translate_status

logger = logging.getLogger(__name__)

class AntiScrapingMiddleware:
    """
    Middleware to block common scraping bots based on User-Agent.
    """
    BLOCKED_USER_AGENTS = [
        'python-requests', 'scrapy', 'curl', 'wget', 'httpclient', 'libwww-perl','postman'
    ]

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        
        # Check if the user agent is empty or matches known bot patterns
        if not user_agent or any(bot in user_agent for bot in self.BLOCKED_USER_AGENTS):
            logger.warning(f"Blocked potential scraper with User-Agent: {user_agent} - IP: {request.META.get('REMOTE_ADDR')}")
            return HttpResponseForbidden("Access Denied: Suspected Bot/Scraping Activity")
            
        return self.get_response(request)

class FormattersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        if isinstance(response, JsonResponse) and 200 <= response.status_code < 300:
            currency = request.headers.get('X-Currency', 'VND')
            language = request.headers.get('Accept-Language', 'vi')
            if language.startswith('en'):
                language = 'en'
            else:
                language = 'vi'
                
            if currency != 'VND' or language != 'en':
                try:
                    content = json.loads(response.content.decode('utf-8'))
                    content = convert_currency(content, currency)
                    content = translate_status(content, language)
                    new_response = JsonResponse(content, status=response.status_code, safe=False)
                    # preserve cookies
                    new_response.cookies = response.cookies
                    return new_response
                except Exception:
                    pass

        return response
