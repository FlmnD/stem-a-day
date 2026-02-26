import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Ctx = { params: Promise<{ plantId: string }> };

export async function POST(req: Request, ctx: Ctx) {
    const { plantId } = await ctx.params;

    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
        return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }

    const payload = await req.json().catch(() => ({}));

    const r = await fetch(
        `${process.env.FASTAPI_INTERNAL_URL}/plants/upgrade/${encodeURIComponent(plantId)}`,
        {
            method: "POST",
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, {
        status: r.status,
        headers: { "Cache-Control": "no-store" },
    });
}