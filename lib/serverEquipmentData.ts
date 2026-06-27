import { createClient } from "@supabase/supabase-js";
import {
  equipmentImages,
  formatEquipmentSpec,
  getEquipmentSpec,
  findStaticImage,
} from "./equipmentData";
import { getEquipmentTypeLabel } from "./equipmentLabels";
import type { Player } from "./playerMapping";
import { getServerPlayersByEquipmentName } from "./serverPlayerData";

function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export type EquipmentSpec = Record<string, unknown> & {
  _type?: string;
  brand?: string;
  model?: string;
  image?: string;
  officialUrl?: string;
  affiliate_url?: string | null;
};

export type EquipmentPageData = {
  typeKey: string;
  typeLabel: string;
  equipmentName: string;
  spec: EquipmentSpec | null;
  players: Player[];
};

async function fetchEquipmentRow(typeKey: string, equipmentName: string) {
  const supabase = createServerSupabase();
  // 1) Exact ilike match first
  const { data, error } = await supabase
    .from("equipment_info")
    .select("*")
    .eq("category", typeKey)
    .ilike("key", equipmentName)
    .maybeSingle();

  if (error) {
    console.error("Server: failed to fetch equipment_info", error);
    return null;
  }

  if (data) return data;

  // 2) Fuzzy fallback — fetch all rows for this category and match client-side
  const { data: allRows, error: allErr } = await supabase
    .from("equipment_info")
    .select("*")
    .eq("category", typeKey)
    .order("id");

  if (allErr || !allRows || allRows.length === 0) return null;

  return fuzzyMatchEquipment(allRows, equipmentName);
}

/**
 * Same 4-tier fuzzy matching as getSupabaseEquipmentSpec() on the browser.
 * Returns the best-match row or null.
 */
function fuzzyMatchEquipment(
  rows: Record<string, unknown>[],
  searchKey: string,
): Record<string, unknown> | null {
  // 1) Exact match
  for (const r of rows) {
    if ((r.key as string) === searchKey) return r;
  }

  // 2) Case-insensitive exact match
  const lower = searchKey.toLowerCase();
  for (const r of rows) {
    if ((r.key as string).toLowerCase() === lower) return r;
  }

  // 3) Substring: search contains canonical key (safe direction).
  const normKey = searchKey.replace(/[-_\s]+/g, ' ').toLowerCase().trim();
  for (const r of rows) {
    const normDbKey = (r.key as string).replace(/[-_\s]+/g, ' ').toLowerCase().trim();
    if (normKey.includes(normDbKey)) return r;
  }

  // 4) Token match (>= 50% tokens overlap).
  const keyTokens = normKey.split(' ').filter(t => t.length > 1);
  if (keyTokens.length > 0) {
    let bestScore = 0;
    let bestRow: Record<string, unknown> | null = null;
    for (const r of rows) {
      const dbTokens = (r.key as string)
        .replace(/[-_\s]+/g, ' ')
        .toLowerCase().trim()
        .split(' ')
        .filter(t => t.length > 1);
      let matchCount = 0;
      for (const t of keyTokens) {
        if (dbTokens.includes(t)) matchCount++;
      }
      const score = matchCount / Math.max(dbTokens.length, keyTokens.length);
      if (score > bestScore) {
        bestScore = score;
        bestRow = r;
      }
    }
    if (bestScore >= 0.5) return bestRow;
  }

  return null;
}

function resolveSpec(
  typeKey: string,
  typeLabel: string,
  equipmentName: string,
  row: Record<string, unknown> | null,
): EquipmentSpec | null {
  if (row) {
    const formatted = formatEquipmentSpec(row, typeKey);
    if (!formatted) return null;
    const key = (row.key as string) || equipmentName;
    const img = findStaticImage(typeKey, key);
    if (img) {
      formatted.image = img;
    }
    return formatted as EquipmentSpec;
  }

  const staticSpec = getEquipmentSpec(typeLabel, equipmentName);
  if (!staticSpec) return null;

  const spec: EquipmentSpec = {
    ...(staticSpec as unknown as Record<string, unknown>),
    _type: typeKey,
  };
  const image = findStaticImage(typeKey, equipmentName);
  if (image) spec.image = image;
  return spec;
}

async function buildEquipmentPageData(
  typeKey: string,
  encodedName: string,
): Promise<EquipmentPageData | null> {
  const equipmentName = decodeURIComponent(encodedName).trim();
  if (!equipmentName) return null;

  const typeLabel = getEquipmentTypeLabel(typeKey);
  const row = await fetchEquipmentRow(typeKey, equipmentName);
  const canonicalKey = (row?.key as string | undefined) || equipmentName;
  const spec = resolveSpec(typeKey, typeLabel, equipmentName, row);
  const players = await getServerPlayersByEquipmentName(canonicalKey);

  if (!spec && players.length === 0) return null;

  return {
    typeKey,
    typeLabel,
    equipmentName: canonicalKey,
    spec,
    players,
  };
}

/** Server-side equipment page payload — spec + players using this gear. */
export async function getServerEquipmentPageData(
  typeKey: string,
  encodedName: string,
): Promise<EquipmentPageData | null> {
  return buildEquipmentPageData(typeKey, encodedName);
}

export type EquipmentRankItem = {
  id: number;
  key: string;
  brand: string;
  model: string;
  category: string;
  officialUrl?: string;
  affiliate_url?: string | null;
  weight?: string;
  connection?: string;
  size?: string;
  maxSpeed?: string;
  dpi?: string;
  count_items_recent: number;
  count_items_cumulative: number;
  apoint: number;
  bpoint: number;
  cpoint: number;
  total_points: number;
  popularity_rank: number;
  currently_used: number;
};

/**
 * Korean → English brand mapping for equipment normalisation.
 * Players may write brands in Korean; we convert to English for matching.
 */
const KOREAN_BRAND_MAP: Record<string, string> = {
  로지텍: "Logitech",
  레이저: "Razer",
  커세어: "Corsair",
  조위: "Zowie",
  조위기어: "Zowie",
  카마: "Commatech",
  바이퍼: "Razer",
  엑스트리파이: "Xtrfy",
  자오핀: "Zaopin",
  커머텍: "Commatech",
  제닉스: "Xenics",
};

/** Colour / decorative suffix words to strip before matching. */
const COLOR_WORDS = [
  "black", "white", "magenta", "red", "blue", "green",
  "pink", "cyan", "yellow", "purple", "orange", "gray", "grey", "lilac",
  "faker edition", "edition",
];

/**
 * Normalise an equipment name string for comparison:
 *   1. Map Korean brand names → English
 *   2. Lowercase
 *   3. Remove colour suffix words
 *   4. Collapse whitespace
 */
function normaliseEquipmentName(raw: string): string {
  let s = raw;
  for (const [ko, en] of Object.entries(KOREAN_BRAND_MAP)) {
    // Case‑insensitive Korean replacement (Korean doesn't have case, but be safe)
    s = s.replace(new RegExp(ko, "gi"), en);
  }
  s = s.toLowerCase();
  for (const color of COLOR_WORDS) {
    s = s.replace(new RegExp("\\b" + color + "\\b", "gi"), "");
  }
  // Collapse multiple spaces
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

/**
 * Compute actual player counts for a given equipment category using EXACT
 * model matching (case-insensitive, Korean→English, colour words stripped).
 *
 * Each player's equipment value is normalised then compared against each
 * canonical key.  A player counts toward the key whose normalised form
 * matches the player's normalised value exactly.
 *
 * Returns a Map<canonicalKey, playerCount>.
 */
async function computeActualPlayerCounts(category: string): Promise<Map<string, number>> {
  const supabase = createServerSupabase();

  // Fetch all equipment keys for this category
  const { data: equipRows } = await supabase
    .from("equipment_info")
    .select("key")
    .eq("category", category);

  if (!equipRows || equipRows.length === 0) return new Map();

  const keys = (equipRows as { key: string }[]).map((r) => r.key);

  // Pre‑normalise all canonical keys
  const normalisedKeys = new Map<string, string>();
  for (const k of keys) {
    normalisedKeys.set(k, normaliseEquipmentName(k));
  }

  // Fetch all players’ equipment columns
  const { data: rawPlayers } = await supabase
    .from("gamers_info")
    .select("ign, mouse, keyboard, headset, monitor, mousepad, chair, desk");

  if (!rawPlayers || rawPlayers.length === 0) return new Map();

  const allPlayerRows = (rawPlayers ?? []) as Record<string, unknown>[];
  const eqCols = ["mouse", "keyboard", "headset", "monitor", "mousepad", "chair", "desk"];

  const counts = new Map<string, number>();
  for (const k of keys) {
    const target = normalisedKeys.get(k)!;
    const matchedIgns = new Set<string>();

    for (const player of allPlayerRows) {
      const ign = ((player.ign as string) || "").toLowerCase().trim();
      if (!ign) continue;

      const found = eqCols.some((col) => {
        const val = player[col] as string | undefined;
        if (!val) return false;
        return normaliseEquipmentName(val) === target;
      });

      if (found) matchedIgns.add(ign);
    }

    counts.set(k, matchedIgns.size);
  }

  return counts;
}

/** Convenience wrapper for mouse counts. */
async function computeMouseActualPlayerCounts(): Promise<Map<string, number>> {
  return computeActualPlayerCounts("mouse");
}

/** Convenience wrapper for keyboard counts. */
async function computeKeyboardActualPlayerCounts(): Promise<Map<string, number>> {
  return computeActualPlayerCounts("keyboard");
}

/** All equipment rows for the /equipment ranking page. */
export async function getServerEquipmentRanking(): Promise<EquipmentRankItem[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("equipment_info")
    .select(
      "id, key, brand, model, category, weight, connection, size, maXSpeed, dpi, count_items_recent, count_items_cumulative, officialUrl, affiliate_url, currently_used, apoint, bpoint, cpoint, total_points, popularity_rank",
    )
    .order("category", { ascending: true })
    .order("popularity_rank", { ascending: true });

  if (error) {
    console.error("Server: failed to fetch equipment ranking", error);
    return [];
  }

  // Compute actual player counts using the SAME logic as the equipment page
  let mouseCounts: Map<string, number> = new Map();
  let keyboardCounts: Map<string, number> = new Map();
  try {
    [mouseCounts, keyboardCounts] = await Promise.all([
      computeMouseActualPlayerCounts(),
      computeKeyboardActualPlayerCounts(),
    ]);
  } catch (e) {
    console.error("Server: failed to compute actual player counts, falling back to DB values", e);
  }

  // Build item list with overridden counts
  const items = (data ?? []).map((d: Record<string, unknown>) => {
    const key = d.key as string;
    const category = d.category as string;

    let actualCount: number;
    if (category === "mouse" && mouseCounts.has(key)) {
      actualCount = mouseCounts.get(key)!;
    } else if (category === "keyboard" && keyboardCounts.has(key)) {
      actualCount = keyboardCounts.get(key)!;
    } else {
      actualCount = (d.currently_used as number) ?? 0;
    }

    return {
      id: d.id as number,
      key,
      brand: d.brand as string,
      model: d.model as string,
      category,
      officialUrl: d.officialUrl as string | undefined,
      affiliate_url: d.affiliate_url as string | null | undefined,
      weight: d.weight as string | undefined,
      connection: d.connection as string | undefined,
      size: d.size as string | undefined,
      maxSpeed: d.maXSpeed as string | undefined,
      dpi: d.dpi as string | undefined,
      count_items_recent: (d.count_items_recent as number) ?? 0,
      count_items_cumulative: (d.count_items_cumulative as number) ?? 0,
      apoint: (d.apoint as number) ?? 0,
      bpoint: (d.bpoint as number) ?? 0,
      cpoint: (d.cpoint as number) ?? 0,
      total_points: (d.total_points as number) ?? 0,
      popularity_rank: (d.popularity_rank as number) ?? 0,
      currently_used: actualCount,
    } as EquipmentRankItem;
  });

  // Filter: only show equipment with at least 1 player,
  // and exclude generic "Custom [Type]" entries (e.g. "Custom Keyboard")
  // while keeping specific models like "Custom Keyboard Frog F12...".
  const filtered = items.filter((item) => {
    if (item.currently_used <= 0) return false;
    if (/^Custom\s+\w+$/i.test(item.key)) return false;
    return true;
  });

  // Recalculate popularity_rank within each category based on actual counts
  const grouped = new Map<string, EquipmentRankItem[]>();
  for (const item of filtered) {
    const cat = item.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(item);
  }

  const result: EquipmentRankItem[] = [];
  for (const [cat, catItems] of grouped) {
    // Sort by currently_used descending, then by total_points as tiebreaker
    catItems.sort((a, b) => {
      if (b.currently_used !== a.currently_used) return b.currently_used - a.currently_used;
      return b.total_points - a.total_points;
    });
    catItems.forEach((item, i) => {
      item.popularity_rank = i + 1;
    });
    result.push(...catItems);
  }

  return result;
}
