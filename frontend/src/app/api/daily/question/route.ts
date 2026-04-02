import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) {
        return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }

    const response = await fetch(`${process.env.FASTAPI_INTERNAL_URL}/daily/question`, {
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, {
        status: response.status,
        headers: { "Cache-Control": "no-store" },
    });
}
