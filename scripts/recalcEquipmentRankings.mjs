/**
 * Recalculate equipment points + popularity_rank (client-side fallback when RPC fails).
 */

const WEIGHT_A = 3;
const WEIGHT_B = 1;
const WEIGHT_C = 100;
const EQUIP_FIELDS = ["mouse", "keyboard", "headset", "monitor", "mousepad", "chair", "desk"];

function exactMatch(playerValue, equipKey) {
  if (!playerValue || !equipKey) return false;
  return playerValue.trim().toLowerCase() === equipKey.trim().toLowerCase();
}

export async function syncCurrentlyUsedExact(supabase) {
  const { data: equipment, error: eqErr } = await supabase
    .from("equipment_info")
    .select("id, key");

  if (eqErr) throw eqErr;

  const { data: gamers, error: gErr } = await supabase
    .from("gamers_info")
    .select(`id, ${EQUIP_FIELDS.join(", ")}`);

  if (gErr) throw gErr;

  for (const equip of equipment ?? []) {
    const matchedIds = new Set();

    for (const g of gamers ?? []) {
      for (const field of EQUIP_FIELDS) {
        if (exactMatch(g[field], equip.key)) {
          matchedIds.add(g.id);
          break;
        }
      }
    }

    const { error } = await supabase
      .from("equipment_info")
      .update({ currently_used: matchedIds.size })
      .eq("id", equip.id);

    if (error) throw error;
  }
}

export async function recalcEquipmentRankingsClient(supabase) {
  const { data: equipment, error: fetchErr } = await supabase
    .from("equipment_info")
    .select("id, category, count_items_recent, count_items_cumulative, currently_used");

  if (fetchErr) throw fetchErr;
  if (!equipment?.length) return;

  const withPoints = equipment.map((eq) => {
    const recent = Number(eq.count_items_recent) || 0;
    const cumulative = Number(eq.count_items_cumulative) || 0;
    const used = Number(eq.currently_used) || 0;
    const apoint = recent * WEIGHT_A;
    const bpoint = cumulative * WEIGHT_B;
    const total_points = apoint + bpoint + used * WEIGHT_C;
    return { ...eq, apoint, bpoint, total_points };
  });

  for (const eq of withPoints) {
    const { error } = await supabase
      .from("equipment_info")
      .update({
        apoint: eq.apoint,
        bpoint: eq.bpoint,
        total_points: eq.total_points,
      })
      .eq("id", eq.id);

    if (error) throw error;
  }

  const byCategory = new Map();
  for (const eq of withPoints) {
    const list = byCategory.get(eq.category) ?? [];
    list.push(eq);
    byCategory.set(eq.category, list);
  }

  for (const items of byCategory.values()) {
    items.sort(
      (a, b) =>
        b.total_points - a.total_points ||
        String(a.id).localeCompare(String(b.id)),
    );

    for (let i = 0; i < items.length; i++) {
      const { error } = await supabase
        .from("equipment_info")
        .update({ popularity_rank: i + 1 })
        .eq("id", items[i].id);

      if (error) throw error;
    }
  }
}

export async function recalcEquipmentRankings(supabase) {
  const { error: rpcErr } = await supabase.rpc("recalc_all_equip_rankings");
  if (!rpcErr) return { method: "rpc" };

  console.warn("recalc_all_equip_rankings RPC failed:", rpcErr.message);
  console.warn("Using client-side fallback (run fix_recalc_equip_rankings_where.sql in Supabase to fix RPC).");
  await syncCurrentlyUsedExact(supabase);
  await recalcEquipmentRankingsClient(supabase);
  return { method: "client", rpcError: rpcErr.message };
}
