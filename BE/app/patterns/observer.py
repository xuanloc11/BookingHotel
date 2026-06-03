from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol


@dataclass
class BookingEventContext:
    event_name: str
    payload: dict = field(default_factory=dict)


class BookingObserver(Protocol):
    def update(self, context: BookingEventContext) -> None:
        ...


class BookingEventSubject:
    def __init__(self) -> None:
        self._observers: list[BookingObserver] = []

    def attach(self, observer: BookingObserver) -> None:
        self._observers.append(observer)

    def notify(self, context: BookingEventContext) -> BookingEventContext:
        for observer in self._observers:
            observer.update(context)

        return context


class BookingConfirmationObserver:
    def update(self, context: BookingEventContext) -> None:
        if context.event_name != 'booking.created':
            return

        context.payload.setdefault('confirmation_message', 'Your booking has been created successfully.')


class BookingAuditObserver:
    def update(self, context: BookingEventContext) -> None:
        if context.event_name != 'booking.created':
            return

        context.payload.setdefault('audit_trail', []).append(
            {
                'event': context.event_name,
                'booking_id': context.payload.get('booking_id'),
            }
        )
