import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { applySessionCookies, clearSessionCookies } from "@/lib/server-session";

function asRecord(data: unknown): Record<string, unknown> | null {
    return typeof data === "object" && data !== null ? (data as Record<string, unknown>) : null;
}

function extractMessage(data: unknown, fallback: string) {
    const record = asRecord(data);
    if (typeof record?.message === "string") return record.message;
    if (typeof record?.detail === "string") return record.detail;

    const detail = asRecord(record?.detail);
    if (typeof detail?.message === "string") return detail.message;
    return fallback;
}

export async function POST() {
    const refreshToken = (await cookies()).get("refresh_token")?.value;
    if (!refreshToken) {
        const res = NextResponse.json({ message: "Not logged in" }, { status: 401 });
        clearSessionCookies(res);
        return res;
    }

    const response = await fetch(`${process.env.FASTAPI_INTERNAL_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const res = NextResponse.json(
            { message: extractMessage(data, "Session refresh failed") },
            { status: response.status }
        );
        clearSessionCookies(res);
        return res;
    }

    const res = NextResponse.json({ ok: true });
    const record = asRecord(data);
    if (
        typeof record?.access_token === "string" &&
        typeof record?.refresh_token === "string"
    ) {
        applySessionCookies(res, {
            access_token: record.access_token,
            refresh_token: record.refresh_token,
        });
    }

    return res;
}
