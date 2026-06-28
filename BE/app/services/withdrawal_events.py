from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol

@dataclass
class WithdrawalEventContext:
    event_name: str
    payload: dict = field(default_factory=dict)

class WithdrawalObserver(Protocol):
    def update(self, context: WithdrawalEventContext) -> None:
        ...

class WithdrawalEventSubject:
    def __init__(self) -> None:
        self._observers: list[WithdrawalObserver] = []

    def attach(self, observer: WithdrawalObserver) -> None:
        self._observers.append(observer)

    def notify(self, context: WithdrawalEventContext) -> WithdrawalEventContext:
        for observer in self._observers:
            observer.update(context)
        return context

class WithdrawalNotificationObserver:
    def update(self, context: WithdrawalEventContext) -> None:
        if context.event_name != 'withdrawal.processed':
            return
        from app.services.email_service import EmailService
        EmailService.send_withdrawal_notification(context.payload)
