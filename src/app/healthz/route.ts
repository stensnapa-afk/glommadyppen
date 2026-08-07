import { NextResponse } from "next/server";

// AAPEN liveness-probe — bekrefter at appen svarer. Ingen DB i denne appen, saa ren liveness.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
