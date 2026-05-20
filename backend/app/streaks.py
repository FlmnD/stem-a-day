from __future__ import annotations

from datetime import date, timedelta

from app.models import User


def get_last_streak_activity_on(user: User) -> date | None:
    return user.last_streak_activity_on or user.daily_question_answered_on


def get_effective_streak(user: User, reference_date: date) -> int:
    last_activity_on = get_last_streak_activity_on(user)
    if last_activity_on is None:
        return 0

    if last_activity_on > reference_date:
        return user.streak

    if last_activity_on >= reference_date - timedelta(days=1):
        return user.streak

    return 0


def get_next_streak_after_activity(user: User, activity_date: date) -> int:
    last_activity_on = get_last_streak_activity_on(user)

    if last_activity_on is None:
        return 1

    if last_activity_on == activity_date:
        return get_effective_streak(user, activity_date)

    if last_activity_on == activity_date - timedelta(days=1):
        return get_effective_streak(user, activity_date) + 1

    return 1
