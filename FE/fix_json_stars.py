import json
import random
from pathlib import Path

json_file = Path(r"c:\Users\Laptop\Documents\GitHub\BookingHotel\FE\public\data\hotels_vietnam.json")
with json_file.open('r', encoding='utf-8') as f:
    hotels = json.load(f)

for hotel in hotels:
    if 'stars' not in hotel:
        hotel['stars'] = random.choice([3, 4, 5])

with json_file.open('w', encoding='utf-8') as f:
    json.dump(hotels, f, indent=2, ensure_ascii=False)

print("Updated hotels_vietnam.json with stars!")
