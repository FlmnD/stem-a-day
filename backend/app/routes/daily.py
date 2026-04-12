import random
from datetime import date, datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_, update
from sqlalchemy.orm import Session

from app.daily_questions import DAILY_GLUCOSE_REWARD, DAILY_QUESTIONS
from app.database import get_db
from app.deps import get_current_verified_user
from app.models import DailyQuestionState, User
from app.schemas.daily import DailyAnswerIn, DailyAnswerOut, DailyQuestionOut

router = APIRouter(prefix="/daily", tags=["daily"])

QUESTION_QUEUE_LENGTH = 10
GLOBAL_DAILY_STATE_ID = 1


def get_base_date() -> date:
    return datetime.now(timezone.utc).date()


def choose_question_index(target_date: date, recent_question_indexes: list[int]) -> int:
    recent_queue = recent_question_indexes[-QUESTION_QUEUE_LENGTH:]
    recent_set = set(recent_queue)
    available_indexes = [
        index for index in range(len(DAILY_QUESTIONS)) if index not in recent_set
    ]
    if not available_indexes:
        available_indexes = list(range(len(DAILY_QUESTIONS)))

    rng = random.Random(
        f"{target_date.isoformat()}|{','.join(str(index) for index in recent_queue)}"
    )
    return rng.choice(available_indexes)


def get_daily_state(db: Session) -> DailyQuestionState:
    state = db.get(DailyQuestionState, GLOBAL_DAILY_STATE_ID)
    if state is None:
        state = DailyQuestionState(id=GLOBAL_DAILY_STATE_ID)
        db.add(state)
        db.flush()
    return state


def sync_daily_state(db: Session) -> DailyQuestionState:
    state = get_daily_state(db)
    target_date = get_base_date() + timedelta(days=state.debug_offset_days)
    recent_queue = list(state.recent_question_indexes or [])

    if state.effective_date is None or state.current_question_index is None:
        next_index = choose_question_index(target_date, recent_queue)
        state.effective_date = target_date
        state.current_question_index = next_index
        state.recent_question_indexes = (recent_queue + [next_index])[-QUESTION_QUEUE_LENGTH:]
        db.commit()
        db.refresh(state)
        return state

    while state.effective_date < target_date:
        next_date = state.effective_date + timedelta(days=1)
        recent_queue = list(state.recent_question_indexes or [])
        next_index = choose_question_index(next_date, recent_queue)
        state.effective_date = next_date
        state.current_question_index = next_index
        state.recent_question_indexes = (recent_queue + [next_index])[-QUESTION_QUEUE_LENGTH:]

    db.commit()
    db.refresh(state)
    return state


def build_daily_question_out(user: User, state: DailyQuestionState) -> DailyQuestionOut:
    if state.current_question_index is None or state.effective_date is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Daily question state is unavailable.",
        )

    question = DAILY_QUESTIONS[state.current_question_index]
    answered_today = user.daily_question_answered_on == state.effective_date

    return DailyQuestionOut(
        question_number=state.current_question_index + 1,
        total_questions=len(DAILY_QUESTIONS),
        effective_date=state.effective_date,
        reward_glucose=DAILY_GLUCOSE_REWARD,
        prompt=question["prompt"],
        options=question["options"],
        can_answer_today=not answered_today,
        answered_today=answered_today,
        glucose_balance=user.glucose,
        debug_offset_days=state.debug_offset_days,
    )


@router.get("/question", response_model=DailyQuestionOut)
def get_daily_question(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
):
    state = sync_daily_state(db)
    return build_daily_question_out(current_user, state)


@router.post("/answer", response_model=DailyAnswerOut)
def answer_daily_question(
    payload: DailyAnswerIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_verified_user),
):
    state = sync_daily_state(db)
    if state.current_question_index is None or state.effective_date is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Daily question state is unavailable.",
        )

    if current_user.daily_question_answered_on == state.effective_date:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already answered today's daily question.",
        )

    question = DAILY_QUESTIONS[state.current_question_index]
    if payload.selected_option_index >= len(question["options"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected option is out of range for this question.",
        )

    correct = payload.selected_option_index == question["correct_option_index"]
    glucose_earned = DAILY_GLUCOSE_REWARD if correct else 0

    values = {"daily_question_answered_on": state.effective_date}
    if correct:
        values["glucose"] = User.glucose + DAILY_GLUCOSE_REWARD

    stmt = (
        update(User)
        .where(User.id == current_user.id)
        .where(
            or_(
                User.daily_question_answered_on.is_(None),
                User.daily_question_answered_on != state.effective_date,
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
        question_number=state.current_question_index + 1,
        effective_date=state.effective_date,
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
    state = get_daily_state(db)
    state.debug_offset_days += 1
    db.commit()

    state = sync_daily_state(db)
    db.refresh(current_user)
    return build_daily_question_out(current_user, state)
