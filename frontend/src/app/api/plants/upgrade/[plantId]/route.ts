import { NextResponse } from "next/server";

import {
    applySessionCookies,
    clearSessionCookies,
    fetchBackendWithSession,
} from "@/lib/server-session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Ctx = { params: Promise<{ plantId: string }> };

export async function POST(req: Request, ctx: Ctx) {
    const { plantId } = await ctx.params;
    const payload = await req.json().catch(() => ({}));

    const result = await fetchBackendWithSession(
        `/plants/upgrade/${encodeURIComponent(plantId)}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

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
