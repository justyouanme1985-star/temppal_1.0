import { createClient } from "@supabase/supabase-js";
import {
  equipmentImages,
  formatEquipmentSpec,
  getEquipmentSpec,
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

  return data;
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
    if (equipmentImages[key]) {
      formatted.image = equipmentImages[key];
    }
    return formatted as EquipmentSpec;
  }

  const staticSpec = getEquipmentSpec(typeLabel, equipmentName);
  if (!staticSpec) return null;

  const spec: EquipmentSpec = {
    ...(staticSpec as unknown as Record<string, unknown>),
    _type: typeKey,
  };
  const image = equipmentImages[equipmentName];
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

  return (data ?? []).map((d: Record<string, unknown>) => ({
    id: d.id as number,
    key: d.key as string,
    brand: d.brand as string,
    model: d.model as string,
    category: d.category as string,
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
    currently_used: (d.currently_used as number) ?? 0,
  }));
}
