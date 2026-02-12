import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const r = await fetch(`${process.env.FASTAPI_INTERNAL_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
        return NextResponse.json(
            { message: data?.detail ?? data?.message ?? "Login failed" },
            { status: r.status }
        );
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // maxAge: 60 * 60 * 24 * 7,
    });

    return res;
}
