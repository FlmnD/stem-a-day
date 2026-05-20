import { requestSessionUserRefresh } from "@/lib/session-events";

type GameRewardApiResponse = {
    glucose?: number;
    streak?: number;
    message?: string;
    detail?: string;
};

export type ClaimGameRewardResult =
    | {
          ok: true;
          rewardGlucose: number;
          glucoseBalance: number;
          streak: number;
          streakIncremented: boolean;
          message: string;
      }
    | {
          ok: false;
          message: string;
      };

function readErrorMessage(data: GameRewardApiResponse, fallback: string) {
    return data.message ?? data.detail ?? fallback;
}

export async function claimGameReward(
    rewardGlucose: number
): Promise<ClaimGameRewardResult> {
    try {
        const response = await fetch("/api/glucose/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: rewardGlucose }),
        });

        const data = (await response.json().catch(() => ({}))) as GameRewardApiResponse;

        if (!response.ok) {
            return {
                ok: false,
                message: readErrorMessage(
                    data,
                    "Failed to update glucose."
                ),
            };
        }

        requestSessionUserRefresh();

        return {
            ok: true,
            rewardGlucose,
            glucoseBalance:
                typeof data.glucose === "number" ? data.glucose : 0,
            streak: typeof data.streak === "number" ? data.streak : 0,
            streakIncremented: false,
            message: `You earned ${rewardGlucose} glucose.`,
        };
    } catch {
        return {
            ok: false,
            message: "Network error. Could not update glucose.",
        };
    }
}
