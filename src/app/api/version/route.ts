import { NextResponse } from "next/server";

// AAPEN probe — kun versjon + build-sha, ingenting sensitivt. Dashboardet flagger stale build.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      version: process.env.APP_VERSION ?? "unknown",
      sha: process.env.BUILD_SHA ?? "unknown",
      tid: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
