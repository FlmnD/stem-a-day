import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Ctx = { params: Promise<{ plantId: string }> };

export async function POST(_req: Request, ctx: Ctx) {
    const { plantId } = await ctx.params;

    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
        return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }

    const r = await fetch(
        `${process.env.FASTAPI_INTERNAL_URL}/plants/buy/${encodeURIComponent(plantId)}`,
        {
            method: "POST",
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    );

    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, {
        status: r.status,
        headers: { "Cache-Control": "no-store" },
    });
}