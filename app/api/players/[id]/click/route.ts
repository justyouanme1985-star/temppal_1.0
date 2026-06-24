import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { recalculateGameRankings } from "@/lib/ranking/recalculateGameRankings";
import { PLAYERS_CACHE_TAG } from "@/lib/serverPlayerData";
import { getClientIp } from "@/lib/security/clientIp";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rateLimit";
import { getSupabaseAdmin } from "@/lib/security/supabaseAdmin";

const MIN_CLICK_INTERVAL_MS = 10_000;
const IP_CLICK_LIMIT = 120;
const IP_CLICK_WINDOW_MS = 60 * 60 * 1000;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = Number(id);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid player ID" }, { status: 400 });
  }

  let clickType = "player";
  let equipmentName: string | null = null;
  try {
    const body = await req.json();
    clickType = body.type === "equipment" ? "equipment" : "player";
    equipmentName = body.equipment_name || null;
  } catch {
    // no body = player click
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 503 });
  }

  const ip = getClientIp(req);
  const ipRate = checkRateLimit(
    `player-click:${ip}`,
    IP_CLICK_LIMIT,
    IP_CLICK_WINDOW_MS,
  );
  if (!ipRate.ok) {
    return NextResponse.json(
      rateLimitResponse("클릭 요청 한도를 초과했습니다.", ipRate.resetAfterMs),
      { status: 429 },
    );
  }

  const { data: player } = await supabase
    .from("gamers_info")
    .select("last_clicked, count_player_cumulative, count_items_cumulative")
    .eq("id", numericId)
    .single();

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  if (player.last_clicked) {
    const msSince = Date.now() - new Date(player.last_clicked).getTime();
    if (msSince < MIN_CLICK_INTERVAL_MS) {
      const sec = Math.ceil((MIN_CLICK_INTERVAL_MS - msSince) / 1000);
      return NextResponse.json(
        { error: `Too fast. Try again in ${sec}s` },
        { status: 429 },
      );
    }
  }

  const existingCum =
    clickType === "player"
      ? (player.count_player_cumulative ?? 0)
      : (player.count_items_cumulative ?? 0);

  const { data, error } = await supabase.rpc("log_click", {
    p_player_id: numericId,
    p_click_type: clickType,
    p_equipment_name: equipmentName,
    p_existing_cumulative: existingCum,
  });

  if (error) {
    console.error("log_click RPC error:", error);
    return NextResponse.json({ error: "Click failed" }, { status: 500 });
  }

  // Belt-and-suspenders: ensure throttle works even if DB function is stale
  const nowIso = new Date().toISOString();
  await supabase
    .from("gamers_info")
    .update({ last_clicked: nowIso })
    .eq("id", numericId);

  try {
    await recalculateGameRankings(supabase, numericId);
    revalidateTag(PLAYERS_CACHE_TAG, "max");
    revalidatePath("/api/players");
  } catch (recalcError) {
    console.error("rank recalculation error:", recalcError);
  }

  return NextResponse.json({ ok: true, ...(data as Record<string, unknown>) });
}
