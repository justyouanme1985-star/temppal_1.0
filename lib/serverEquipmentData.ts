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
