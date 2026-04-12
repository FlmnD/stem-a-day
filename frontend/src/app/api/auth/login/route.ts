import { NextResponse } from "next/server";

import { applySessionCookies } from "@/lib/server-session";

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

export async function POST(req: Request) {
    const body = await req.json();

    const response = await fetch(`${process.env.FASTAPI_INTERNAL_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        return NextResponse.json(
            {
                message: extractMessage(data, "Login failed"),
                requires_email_verification: Boolean(
                    asRecord(data)?.requires_email_verification ??
                        asRecord(asRecord(data)?.detail)?.requires_email_verification
                ),
            },
            { status: response.status }
        );
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
