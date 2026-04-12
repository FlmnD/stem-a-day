import { NextResponse } from "next/server";

import {
    applySessionCookies,
    clearSessionCookies,
    fetchBackendWithSession,
} from "@/lib/server-session";

export async function POST(req: Request) {
    const body = await req.json().catch(() => null);
    const amount = body?.amount;

    if (typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0) {
        return NextResponse.json(
            { message: "amount must be a positive integer" },
            { status: 400 }
        );
    }

    const result = await fetchBackendWithSession("/users/me/glucose/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
    });

    if (!result.response) {
        const res = NextResponse.json(result.data, { status: 401 });
        if (result.refreshAttempted && !result.refreshedTokens) {
            clearSessionCookies(res);
        }
        return res;
    }

    const res = NextResponse.json(result.data, { status: result.response.status });
    if (result.refreshedTokens) {
        applySessionCookies(res, result.refreshedTokens);
    } else if (result.response.status === 401) {
        clearSessionCookies(res);
    }

    return res;
}
