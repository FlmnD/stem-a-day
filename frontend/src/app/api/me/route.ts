import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const r = await fetch(`${process.env.FASTAPI_INTERNAL_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, { status: r.status });
}
