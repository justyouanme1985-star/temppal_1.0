import { NextRequest, NextResponse } from "next/server";
import { getServerPlayersByEquipmentName } from "@/lib/serverPlayerData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "name 파라미터가 필요합니다." }, { status: 400 });
  }

  try {
    const players = await getServerPlayersByEquipmentName(name);
    return NextResponse.json(players, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "선수 데이터를 불러오지 못했습니다." }, { status: 500 });
  }
}
