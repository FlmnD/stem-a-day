from __future__ import annotations

from datetime import date, timedelta

from app.models import User


def get_effective_streak(user: User, reference_date: date) -> int:
    last_answered_on = user.daily_question_answered_on
    if last_answered_on is None:
        return 0

    if last_answered_on > reference_date:
        return user.streak

    if last_answered_on >= reference_date - timedelta(days=1):
        return user.streak

    return 0


def get_next_streak_after_daily_answer(user: User, answer_date: date) -> int:
    last_answered_on = user.daily_question_answered_on

    if last_answered_on is None:
        return 1

    if last_answered_on == answer_date:
        return user.streak

    if last_answered_on == answer_date - timedelta(days=1):
        return get_effective_streak(user, answer_date) + 1

    return 1
