from datetime import date

from pydantic import BaseModel, Field


class DailyQuestionOut(BaseModel):
    question_number: int
    total_questions: int
    effective_date: date
    reward_glucose: int
    prompt: str
    options: list[str]
    can_answer_today: bool
    answered_today: bool
    glucose_balance: int
    debug_offset_days: int


class DailyAnswerIn(BaseModel):
    selected_option_index: int = Field(ge=0, le=3)


class DailyAnswerOut(BaseModel):
    question_number: int
    effective_date: date
    correct: bool
    selected_option_index: int
    correct_option_index: int
    explanation: str
    reward_glucose: int
    glucose_earned: int
    glucose_balance: int
    can_answer_today: bool
    answered_today: bool

