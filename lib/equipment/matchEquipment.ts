/**
 * Equipment name resolution — exact match with label normalization.
 * Normalizes case + whitespace + "x2"/"x 2" glue only.
 * Does NOT merge different models (e.g. superlight 2 vs superlight 2s).
 */

/** Alternate spellings / Korean labels → canonical equipment_info.key */
export const EQUIPMENT_ALIASES: Record<string, string> = {
  // Logitech keyboards
  "로지텍 g pro x 기계식 키보드": "Logitech G PRO X Mechanical Keyboard",
  "logitech g pro x mechanical keyboard": "Logitech G PRO X Mechanical Keyboard",
  "logitech g pro x keyboard": "Logitech G Pro X Keyboard",
  "로지텍 g pro x tkl": "Logitech G PRO X TKL",
  "logitech g pro x tkl keyboard black": "Logitech G PRO X TKL",

  // Logitech mice
  "로지텍 g pro x superlight 2": "Logitech G PRO X SUPERLIGHT 2",
  "로지텍 g pro x 슈퍼라이트 2": "Logitech G PRO X SUPERLIGHT 2",
  "로지텍 g x superlight2": "Logitech G PRO X SUPERLIGHT 2",
  "로지텍 g x superlight3 / 로지텍 g pro x superlight2": "Logitech G PRO X SUPERLIGHT 2",
  "로지텍 g x superlight4": "Logitech G PRO X SUPERLIGHT 2",
  "logitech g pro x2 superlight": "Logitech G PRO X SUPERLIGHT 2",
  "superlight x2": "Logitech G PRO X SUPERLIGHT 2",
  "superlight x 2": "Logitech G PRO X SUPERLIGHT 2",
  "로지텍 g102": "Logitech G102",
  "로지텍 g640": "Logitech G640",
  "로지텍 미니옵": "Logitech G Pro",
  "로지텍 g pro (검정색)": "Logitech G Pro Gaming Mouse",

  // Logitech headset
  "로지텍 g pro x 2": "Logitech G PRO X 2",

  // Razer mice
  "레이저 바이퍼 v3 pro": "Razer Viper V3 Pro",
  "레이저 데스에더 v3 pro": "Razer DeathAdder V3 Pro",
  "바이퍼 미니 무선 시그니처 마우스": "Razer Viper Mini Signature Edition",

  // Razer keyboards
  "레이저 헌츠맨 v3 pro": "Razer Huntsman V3 Pro",
  "레이저 헌츠맨 v3 pro tkl": "Razer Huntsman V3 Pro TKL",

  // Razer headset / mousepad
  "레이저 블랙샤크 v2": "Razer BlackShark V2",
  "레이저 기간투스 v2": "Razer Goliathus V2",
  "레이저 스트라이더": "Razer Strider",

  // Zowie
  "조위 ec2-cw": "Zowie EC2-CW",
  "조위기어 미코": "Zowie MiCO",
  "조위기어 미코 마우스 kt": "Zowie MiCO",
  "조위 g-sr ii": "Zowie G-SR II",
  "조위 g-sr-se": "Zowie G-SR-SE",

  // Other mice
  "카카 fk mini3": "VAXEE XE Wireless Yellow",
  "카카 fk mini3 / fkmini 러비공 마우스": "VAXEE XE Wireless Yellow",
  "자오핀 z1 pro": "Zaopin Z1 Pro",
  "엑스트리파이": "Xtrfy M8 Wireless",

  // Headsets
  "하이퍼엑스 클라우드 ii": "HyperX Cloud II",
  "로지텍 g pro wireless": "Logitech G Pro X Wireless Lightspeed",
  "astro a50": "Logitech ASTRO A50",

  // Mousepads
  "스틸시리즈 qck heavy": "SteelSeries QcK Heavy",
  "아티산 제로 soft": "Artisan Zero Soft",
  "아티zan 제로 xsoft": "Artisan Zero XSoft",
  "아티zan 하야테 오츠": "Artisan Hayate Otsu",
  "스틸 단패드": "SteelSeries QcK",
  "스틸 장패드": "SteelSeries QcK Heavy",

  // Monitors / misc (keep exact known variants)
  "필co 마제스터치 텐키리스 갈축": "Filco Majestouch Tenkeyless",
};

export const GAMER_EQUIPMENT_FIELDS = [
  "mouse",
  "keyboard",
  "headset",
  "monitor",
  "mousepad",
  "chair",
  "desk",
] as const;

export type GamerEquipmentField = (typeof GAMER_EQUIPMENT_FIELDS)[number];

/** gamers_info column → equipment_info.category slug */
export const EQUIPMENT_FIELD_TO_CATEGORY: Record<GamerEquipmentField, string> = {
  mouse: "mouse",
  keyboard: "keyboard",
  headset: "headset",
  monitor: "monitor",
  mousepad: "mousepad",
  chair: "chair",
  desk: "desk",
};

/** gamers_info equipment_id columns (nullable int FK → equipment_info.id) */
export const EQUIPMENT_FIELD_TO_ID_COLUMN: Record<GamerEquipmentField, string> = {
  mouse: "mouse_id",
  keyboard: "keyboard_id",
  headset: "headset_id",
  monitor: "monitor_id",
  mousepad: "mousepad_id",
  chair: "chair_id",
  desk: "desk_id",
};

export function categoryToIdColumn(category: string): string | null {
  const slug = category.trim().toLowerCase();
  for (const field of GAMER_EQUIPMENT_FIELDS) {
    if (EQUIPMENT_FIELD_TO_CATEGORY[field] === slug) {
      return EQUIPMENT_FIELD_TO_ID_COLUMN[field];
    }
  }
  return null;
}

function aliasKey(input: string): string {
  return input.trim().toLowerCase();
}

/**
 * Normalize for comparison: lowercase, collapsed whitespace,
 * "x2"/"X2"/"x 2" → "x 2", model suffix letters preserved (2 ≠ 2s).
 */
export function normalizeEquipmentLabel(input: string): string {
  let s = input.trim().toLowerCase();
  s = s.replace(/\s+/g, " ");
  s = s.replace(/\bx\s*(\d+)([a-z]*)\b/g, "x $1$2");
  s = s.replace(/\bsuperlight\s+(?:x\s+)?(\d+)([a-z]*)\b/g, "superlight x $1$2");
  return s.trim();
}

function findCatalogKey(input: string, catalogKeys: string[]): string | null {
  const lower = input.trim().toLowerCase();
  const direct = catalogKeys.find((key) => key.toLowerCase() === lower);
  if (direct) return direct;

  const normalized = normalizeEquipmentLabel(input);
  return catalogKeys.find((key) => normalizeEquipmentLabel(key) === normalized) ?? null;
}

/**
 * Resolve any equipment label to the canonical equipment_info.key.
 * Returns null if the value cannot be mapped exactly.
 */
export function resolveCanonicalEquipmentKey(
  input: string,
  catalogKeys: string[],
): string | null {
  const trimmed = input.trim();
  if (!trimmed || catalogKeys.length === 0) return null;

  const direct = findCatalogKey(trimmed, catalogKeys);
  if (direct) return direct;

  const aliasTarget = EQUIPMENT_ALIASES[aliasKey(trimmed)];
  if (!aliasTarget) return null;

  return findCatalogKey(aliasTarget, catalogKeys);
}

/** Normalized label equality (case/whitespace/x-glue only). */
export function equipmentValueMatchesKey(value: string, canonicalKey: string): boolean {
  return normalizeEquipmentLabel(value) === normalizeEquipmentLabel(canonicalKey);
}

import type { RawPlayer } from "../playerMapping";

export function playerUsesEquipment(
  raw: RawPlayer,
  canonicalKey: string,
  catalogKeys: string[],
  equipmentId?: number | null,
  category?: string,
): boolean {
  if (equipmentId != null) {
    const idColumn = category ? categoryToIdColumn(category) : null;
    if (idColumn) {
      const playerEquipId = raw[idColumn as keyof RawPlayer];
      if (typeof playerEquipId === "number" && playerEquipId === equipmentId) {
        return true;
      }
    } else {
      for (const field of GAMER_EQUIPMENT_FIELDS) {
        const idCol = EQUIPMENT_FIELD_TO_ID_COLUMN[field] as keyof RawPlayer;
        const playerEquipId = raw[idCol];
        if (typeof playerEquipId === "number" && playerEquipId === equipmentId) {
          return true;
        }
      }
    }
  }

  for (const field of GAMER_EQUIPMENT_FIELDS) {
    const value = raw[field];
    if (typeof value !== "string" || !value.trim()) continue;

    // gamers_info text as stored (case/space normalized)
    if (equipmentValueMatchesKey(value, canonicalKey)) {
      return true;
    }

    const resolved = resolveCanonicalEquipmentKey(value, catalogKeys);
    if (resolved && equipmentValueMatchesKey(resolved, canonicalKey)) {
      return true;
    }
  }
  return false;
}

/** Resolve a stored gamers_info value to canonical key for DB normalization. */
export function normalizeEquipmentValue(
  value: string,
  catalogKeys: string[],
): { canonical: string | null; needsFix: boolean } {
  const trimmed = value.trim();
  if (!trimmed) return { canonical: null, needsFix: false };

  const canonical = resolveCanonicalEquipmentKey(trimmed, catalogKeys);
  if (!canonical) return { canonical: null, needsFix: false };

  return {
    canonical,
    needsFix: !equipmentValueMatchesKey(trimmed, canonical),
  };
}
