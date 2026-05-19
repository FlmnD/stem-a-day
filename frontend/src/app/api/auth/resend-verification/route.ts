import { NextResponse } from "next/server";

import { fetchApiJson } from "@/lib/api-proxy";

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

    const { response, data, errorMessage } = await fetchApiJson(
        "/auth/resend-verification",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            cache: "no-store",
        }
    );

    if (!response) {
        return NextResponse.json(
            { message: errorMessage ?? "Resend verification failed" },
            { status: 503 }
        );
    }

    return NextResponse.json(
        {
            message: extractMessage(
                data,
                "If that account exists and still needs verification, a fresh link has been sent."
            ),
        },
        { status: response.status }
    );
}
