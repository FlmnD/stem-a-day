from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_, update
from sqlalchemy.orm import Session

from app.daily_questions import DAILY_GLUCOSE_REWARD, DAILY_QUESTIONS
from app.database import get_db
from app.deps import get_current_verified_user
from app.models import User
from app.schemas.daily import DailyAnswerIn, DailyAnswerOut, DailyQuestionOut

router = APIRouter(prefix="/daily", tags=["daily"])


def get_effective_date(user: User):
    base_date = datetime.now(timezone.utc).date()
    return base_date + timedelta(days=user.daily_debug_offset_days)


def get_question_for_date(target_date):
    index = target_date.toordinal() % len(DAILY_QUESTIONS)
    return index, DAILY_QUESTIONS[index]


def build_daily_question_out(user: User) -> DailyQuestionOut:
    effective_date = get_effective_date(user)
    question_index, question = get_question_for_date(effective_date)
    answered_today = user.daily_question_answered_on == effective_date

    return DailyQuestionOut(
        question_number=question_index + 1,
        total_questions=len(DAILY_QUESTIONS),
        effective_date=effective_date,
        reward_glucose=DAILY_GLUCOSE_REWARD,
        prompt=question["prompt"],
        options=question["options"],
        can_answer_today=not answered_today,
        answered_today=answered_today,
        glucose_balance=user.glucose,
        debug_offset_days=user.daily_debug_offset_days,
    )


@router.get("/question", response_model=DailyQuestionOut)
def get_daily_question(current_user: User = Depends(get_current_verified_user)):
    return build_daily_question_out(current_user)


@router.post("/answer", response_model=DailyAnswerOut)
def answer_daily_question(
    payload: DailyAnswerIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
):
    effective_date = get_effective_date(current_user)
    if current_user.daily_question_answered_on == effective_date:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already answered today's daily question.",
        )

    question_index, question = get_question_for_date(effective_date)
    if payload.selected_option_index >= len(question["options"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected option is out of range for this question.",
        )

    correct = payload.selected_option_index == question["correct_option_index"]
    glucose_earned = DAILY_GLUCOSE_REWARD if correct else 0

    values = {"daily_question_answered_on": effective_date}
    if correct:
        values["glucose"] = User.glucose + DAILY_GLUCOSE_REWARD

    stmt = (
        update(User)
        .where(User.id == current_user.id)
        .where(
            or_(
                User.daily_question_answered_on.is_(None),
                User.daily_question_answered_on != effective_date,
            )
        )
        .values(**values)
        .returning(User.glucose)
    )
    updated_glucose = db.execute(stmt).scalar_one_or_none()

    if updated_glucose is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already answered today's daily question.",
        )

    db.commit()

    return DailyAnswerOut(
        question_number=question_index + 1,
        effective_date=effective_date,
        correct=correct,
        selected_option_index=payload.selected_option_index,
        correct_option_index=question["correct_option_index"],
        explanation=question["explanation"],
        reward_glucose=DAILY_GLUCOSE_REWARD,
        glucose_earned=glucose_earned,
        glucose_balance=updated_glucose,
        can_answer_today=False,
        answered_today=True,
    )


@router.post("/debug/advance", response_model=DailyQuestionOut)
def advance_daily_question_debug(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
):
    current_user.daily_debug_offset_days += 1
    db.commit()
    db.refresh(current_user)
    return build_daily_question_out(current_user)
