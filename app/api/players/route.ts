import { NextResponse } from "next/server";
import { getServerAllPlayers } from "@/lib/serverPlayerData";

// Runs at request time (server-side) instead of forcing every browser to query
// the entire gamers_info table. The response is CDN-cached via Cache-Control.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const players = await getServerAllPlayers();
    return NextResponse.json(players, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "선수 데이터를 불러오지 못했습니다." }, { status: 500 });
  }
}
