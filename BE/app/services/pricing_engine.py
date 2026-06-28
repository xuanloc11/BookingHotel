from abc import ABC, abstractmethod
from datetime import date

class PricingStrategy(ABC):
    @abstractmethod
    def calculate_price(self, base_price: float, current_date: date, capacity: int, booked: int, user_role: str = 'guest') -> float:
        pass

class WeekendPricingStrategy(PricingStrategy):
    def calculate_price(self, base_price: float, current_date: date, capacity: int, booked: int, user_role: str = 'guest') -> float:
        if current_date.weekday() in [4, 5, 6]:
            return base_price * 1.2
        return base_price

class OccupancyPricingStrategy(PricingStrategy):
    def calculate_price(self, base_price: float, current_date: date, capacity: int, booked: int, user_role: str = 'guest') -> float:
        if capacity <= 0:
            return base_price
            
        occupancy_rate = booked / capacity
        
        if occupancy_rate >= 0.8:
            return base_price * 1.3
            
        if occupancy_rate <= 0.2:
            return base_price * 0.85
            
        return base_price

class MemberPricingStrategy(PricingStrategy):
    def calculate_price(self, base_price: float, current_date: date, capacity: int, booked: int, user_role: str = 'guest') -> float:
        if user_role == 'member':
            return base_price * 0.9  # 10% discount for members
        return base_price

class DynamicPricingEngine:
    def __init__(self):
        self.strategies: list[PricingStrategy] = [
            WeekendPricingStrategy(),
            OccupancyPricingStrategy(),
            MemberPricingStrategy(),
        ]

    def calculate_price(self, base_price: float, current_date: date, capacity: int, booked: int, user_role: str = 'guest') -> int:
        current_price = float(base_price)
        for strategy in self.strategies:
            current_price = strategy.calculate_price(current_price, current_date, capacity, booked, user_role)
        
        return int(round(current_price))

# Singleton instance for easy import
pricing_engine = DynamicPricingEngine()
