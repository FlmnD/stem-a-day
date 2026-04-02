import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
        return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }

    const payload = await req.json().catch(() => ({}));

    const response = await fetch(`${process.env.FASTAPI_INTERNAL_URL}/daily/answer`, {
        method: "POST",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, {
        status: response.status,
        headers: { "Cache-Control": "no-store" },
    });
}
