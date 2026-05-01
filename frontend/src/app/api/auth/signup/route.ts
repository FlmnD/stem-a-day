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

    const response = await fetch(`${process.env.FASTAPI_INTERNAL_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        return NextResponse.json(
            { message: extractMessage(data, "Signup failed") },
            { status: response.status }
        );
    }

    return NextResponse.json(
        {
            message: extractMessage(
                data,
                "Account created. Check your email for the verification link."
            ),
            email: asRecord(data)?.email ?? body?.email,
            verification_email_sent: Boolean(asRecord(data)?.verification_email_sent),
            dev_verification_url: asRecord(data)?.dev_verification_url ?? null,
        },
        { status: 201 }
    );
}
