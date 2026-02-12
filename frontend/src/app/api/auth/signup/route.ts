import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const r = await fetch(`${process.env.FASTAPI_INTERNAL_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
        return NextResponse.json(
            { message: data?.detail ?? data?.message ?? "Signup failed" },
            { status: r.status }
        );
    }

    const res = NextResponse.json({ ok: true }, { status: 201 });
    res.cookies.set("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    return res;
}
