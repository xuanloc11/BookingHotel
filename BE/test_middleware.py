import urllib.request
import json

try:
    req = urllib.request.Request('http://127.0.0.1:8000/api/hotels/')
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        if 'results' in data and len(data['results']) > 0:
            hotel = data['results'][0]
            print(f"Default Price: {hotel.get('price_per_night')} {hotel.get('currency', 'VND')}")
            
    req = urllib.request.Request('http://127.0.0.1:8000/api/hotels/', headers={'X-Currency': 'USD', 'Accept-Language': 'en'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        if 'results' in data and len(data['results']) > 0:
            hotel = data['results'][0]
            print(f"USD Price: {hotel.get('price_per_night')} {hotel.get('currency', 'VND')}")
except Exception as e:
    print("Error:", e)
