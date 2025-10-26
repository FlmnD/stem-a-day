// frontend/src/app/games/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://neelpatel05.pythonanywhere.com/periodictablejson");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch elements:", error);
    return NextResponse.json({ error: "Failed to fetch elements" }, { status: 500 });
  }
}
