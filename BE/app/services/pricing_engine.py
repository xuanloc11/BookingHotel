from abc import ABC, abstractmethod
from datetime import date

class PricingStrategy(ABC):
    @abstractmethod
    def calculate_price(self, base_price: float, current_date: date, capacity: int, booked: int) -> float:
        pass

class WeekendPricingStrategy(PricingStrategy):
    def calculate_price(self, base_price: float, current_date: date, capacity: int, booked: int) -> float:
        # Weekend bump: +20% on Friday, Saturday, Sunday
        # In Python, weekday() returns 0 for Monday, 6 for Sunday.
        if current_date.weekday() in [4, 5, 6]:
            return base_price * 1.2
        return base_price

class OccupancyPricingStrategy(PricingStrategy):
    def calculate_price(self, base_price: float, current_date: date, capacity: int, booked: int) -> float:
        if capacity <= 0:
            return base_price
            
        occupancy_rate = booked / capacity
        
        # High demand bump: >= 80% booked => +30%
        if occupancy_rate >= 0.8:
            return base_price * 1.3
            
        # Low demand drop: <= 20% booked => -15%
        if occupancy_rate <= 0.2:
            return base_price * 0.85
            
        return base_price

class DynamicPricingEngine:
    def __init__(self):
        # The order of strategies matters. We apply Weekend first, then Occupancy.
        self.strategies: list[PricingStrategy] = [
            WeekendPricingStrategy(),
            OccupancyPricingStrategy(),
        ]

    def calculate_price(self, base_price: float, current_date: date, capacity: int, booked: int) -> int:
        current_price = float(base_price)
        for strategy in self.strategies:
            current_price = strategy.calculate_price(current_price, current_date, capacity, booked)
        
        # Round to nearest integer (assuming VND or similar currency)
        return int(round(current_price))

# Singleton instance for easy import
pricing_engine = DynamicPricingEngine()
