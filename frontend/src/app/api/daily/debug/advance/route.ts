import { NextResponse } from "next/server";

import {
    applySessionCookies,
    clearSessionCookies,
    fetchBackendWithSession,
} from "@/lib/server-session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
    const result = await fetchBackendWithSession("/daily/debug/advance", {
        method: "POST",
        headers: { Accept: "application/json" },
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
        headers: { "Cache-Control": "no-store" },
    });
    if (result.refreshedTokens) {
        applySessionCookies(res, result.refreshedTokens);
    } else if (result.response.status === 401) {
        clearSessionCookies(res);
    }

    return res;
}
