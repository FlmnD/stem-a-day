import { NextResponse } from "next/server";

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

    const response = await fetch(`${process.env.FASTAPI_INTERNAL_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(
        {
            message: extractMessage(
                data,
                "If that account exists, a password reset email has been sent."
            ),
            dev_reset_url: asRecord(data)?.dev_reset_url ?? null,
        },
        { status: response.status }
    );
}
