import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) return NextResponse.json({ message: "Not logged in" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const amount = body?.amount;

    if (typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0) {
        return NextResponse.json({ message: "amount must be a positive integer" }, { status: 400 });
    }

    const r = await fetch(`${process.env.FASTAPI_INTERNAL_URL}/users/me/glucose/add`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
        cache: "no-store",
    });

    const text = await r.text();
    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }

    return NextResponse.json(data, { status: r.status });
}
