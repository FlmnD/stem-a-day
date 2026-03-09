import { NextResponse } from "next/server";

export async function GET() {
    const r = await fetch(`${process.env.FASTAPI_INTERNAL_URL}/plants/catalog`, { cache: "no-store" });
    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, { status: r.status });
}