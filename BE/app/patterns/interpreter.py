from __future__ import annotations

from dataclasses import dataclass


class HotelExpression:
    def interpret(self, hotel: dict) -> bool:
        raise NotImplementedError


@dataclass(frozen=True)
class LocationExpression(HotelExpression):
    location: str | None

    def interpret(self, hotel: dict) -> bool:
        if not self.location:
            return True

        normalized_location = self.location.strip().lower()
        hotel_location = f"{hotel.get('province', '')} {hotel.get('address', '')}".strip().lower()
        return normalized_location in hotel_location


@dataclass(frozen=True)
class PriceRangeExpression(HotelExpression):
    price_min: int | None = None
    price_max: int | None = None

    def interpret(self, hotel: dict) -> bool:
        price = int(hotel.get('price_per_night', 0))

        if self.price_min is not None and price < self.price_min:
            return False

        if self.price_max is not None and price > self.price_max:
            return False

        return True


@dataclass(frozen=True)
class StarRatingExpression(HotelExpression):
    stars: int | None

    def interpret(self, hotel: dict) -> bool:
        if self.stars is None:
            return True

        return int(hotel.get('stars', 5)) >= int(self.stars)


@dataclass(frozen=True)
class ReviewScoreExpression(HotelExpression):
    min_rating: float | None

    def interpret(self, hotel: dict) -> bool:
        if self.min_rating is None:
            return True

        return float(hotel.get('rating', 0)) >= float(self.min_rating)


@dataclass(frozen=True)
class AmenitiesExpression(HotelExpression):
    amenities: list[str] | None = None

    def interpret(self, hotel: dict) -> bool:
        if not self.amenities:
            return True

        hotel_amenities = [str(amenity).strip().lower() for amenity in hotel.get('amenities', [])]

        for amenity in self.amenities:
            normalized_amenity = amenity.strip().lower()
            if not any(normalized_amenity in hotel_amenity for hotel_amenity in hotel_amenities):
                return False

        return True


class AndExpression(HotelExpression):
    def __init__(self, *expressions: HotelExpression) -> None:
        self.expressions = expressions

    def interpret(self, hotel: dict) -> bool:
        return all(expression.interpret(hotel) for expression in self.expressions)
