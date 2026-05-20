from enum import Enum


class GameRewardId(str, Enum):
    CARBLE_EASY = "carble_easy"
    CARBLE_HARD = "carble_hard"
    PIPS_EASY = "pips_easy"
    PIPS_HARD = "pips_hard"
    RAILBOUND_EASY = "railbound_easy"
    RAILBOUND_HARD = "railbound_hard"
    SNAKE_EASY = "snake_easy"
    SNAKE_HARD = "snake_hard"
    WHERESMYWATER_EASY = "wheresmywater_easy"
    WHERESMYWATER_HARD = "wheresmywater_hard"


EASY_GAME_GLUCOSE_REWARD = 15
HARD_GAME_GLUCOSE_REWARD = 35


GAME_REWARD_GLUCOSE: dict[GameRewardId, int] = {
    GameRewardId.CARBLE_EASY: EASY_GAME_GLUCOSE_REWARD,
    GameRewardId.CARBLE_HARD: HARD_GAME_GLUCOSE_REWARD,
    GameRewardId.PIPS_EASY: EASY_GAME_GLUCOSE_REWARD,
    GameRewardId.PIPS_HARD: HARD_GAME_GLUCOSE_REWARD,
    GameRewardId.RAILBOUND_EASY: EASY_GAME_GLUCOSE_REWARD,
    GameRewardId.RAILBOUND_HARD: HARD_GAME_GLUCOSE_REWARD,
    GameRewardId.SNAKE_EASY: EASY_GAME_GLUCOSE_REWARD,
    GameRewardId.SNAKE_HARD: HARD_GAME_GLUCOSE_REWARD,
    GameRewardId.WHERESMYWATER_EASY: EASY_GAME_GLUCOSE_REWARD,
    GameRewardId.WHERESMYWATER_HARD: HARD_GAME_GLUCOSE_REWARD,
}
