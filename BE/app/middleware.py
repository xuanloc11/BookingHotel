import json
from django.http import JsonResponse
from app.utils.formatters import convert_currency, translate_status

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
