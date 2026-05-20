from pydantic import BaseModel

from app.game_rewards import GameRewardId


class GameRewardClaimIn(BaseModel):
    game_id: GameRewardId


class GameRewardClaimOut(BaseModel):
    game_id: GameRewardId
    reward_glucose: int
    glucose_balance: int
    streak: int
    streak_incremented: bool
