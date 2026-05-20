import { NextResponse } from "next/server";

import {
    applySessionCookies,
    clearSessionCookies,
    fetchBackendWithSession,
} from "@/lib/server-session";

export async function POST(req: Request) {
    const body = await req.json().catch(() => null);
    const gameId = body?.game_id;

    if (typeof gameId !== "string" || gameId.trim() === "") {
        return NextResponse.json(
            { message: "game_id must be a non-empty string" },
            { status: 400 }
        );
    }

    const result = await fetchBackendWithSession("/users/me/games/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_id: gameId }),
    });

    if (!result.response) {
        const res = NextResponse.json(result.data, { status: 401 });
        if (result.refreshAttempted && !result.refreshedTokens) {
            clearSessionCookies(res);
        }
        return res;
    }

    const res = NextResponse.json(result.data, {
        status: result.response.status,
    });
    if (result.refreshedTokens) {
        applySessionCookies(res, result.refreshedTokens);
    } else if (result.response.status === 401) {
        clearSessionCookies(res);
    }

    return res;
}
