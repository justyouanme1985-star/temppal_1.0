/**
 * Equipment name resolution — deterministic matching with label normalization.
 * Normalizes case, whitespace, Korean↔English brand words, and "x2"/"x 2" glue.
 * Does NOT merge different models (e.g. superlight 2 vs superlight 2s).
 */

import type { RawPlayer } from "../playerMapping";

const BRAND_TRANSLATIONS: Record<string, string> = {
  로지텍: "logitech",
  레이저: "razer",
  스틸시리즈: "steelseries",
  코sair: "corsair",
  corsair: "corsair",
  조위: "zowie",
  조위기어: "zowie",
  엑스트리파이: "xtrfy",
  하이퍼엑스: "hyperx",
  아티isan: "artisan",
  아티zan: "artisan",
  제닉스: "genesis",
  필co: "filco",
  덱: "deck",
  레오폴드: "leopold",
  벤큐: "benq",
  에이수스: "asus",
  lg: "lg",
  삼성: "samsung",
  앱코: "abko",
  우크루즈: "wooting",
  카카: "vaxee",
  자오핀: "zaopin",
  시디즈: "sidiz",
};

const WORD_TRANSLATIONS: Record<string, string> = {
  기계식: "mechanical",
  키보드: "keyboard",
  마우스: "mouse",
  헤드셋: "headset",
  모니터: "monitor",
  마우스패드: "mousepad",
  패드: "pad",
  의자: "chair",
  책상: "desk",
  무선: "wireless",
  유선: "wired",
  블랙: "black",
  화이트: "white",
  검정: "black",
  검정색: "black",
  흰색: "white",
  게이밍: "gaming",
  슈퍼라이트: "superlight",
  바이퍼: "viper",
  데스에더: "deathadder",
  헌츠맨: "huntsman",
  블랙샤크: "blackshark",
  기간투스: "goliathus",
  스트라이더: "strider",
  클라우드: "cloud",
};

/** Extra tokens allowed when matching product name prefixes (e.g. Faker Edition, size L). */
const SAFE_EXTRA_TOKENS = new Set([
  "faker",
  "edition",
  "black",
  "white",
  "original",
  "pro",
  "max",
  "mini",
  "l",
  "m",
  "s",
  "xl",
  "xxl",
  "full",
  "size",
  "speed",
  "balance",
  "wireless",
  "wired",
  "gaming",
  "rgb",
  "carbon",
  "cloth",
  "clotch",
  "tenkeyless",
  "tkl",
  "se",
  "dex",
  "hyperspeed",
  "signature",
]);

/** Decorative tokens stripped for variant matching (never strip l/m/xxl — different SKUs). */
const VARIANT_TOKENS = new Set([
  "black",
  "white",
  "original",
  "gaming",
  "mousepad",
  "pad",
  "cloth",
  "clotch",
  "mechanical",
  "keyboard",
  "headset",
  "wireless",
  "wired",
  "edition",
  "large",
  "extended",
]);

/** Alternate spellings / Korean labels → canonical equipment_info.key */
export const EQUIPMENT_ALIASES: Record<string, string> = {
  // Logitech keyboards
  "로지텍 g pro x 기계식 키보드": "Logitech G PRO X Mechanical Keyboard",
  "logitech g pro x mechanical keyboard": "Logitech G PRO X Mechanical Keyboard",
  "logitech g pro x keyboard": "Logitech G PRO X Mechanical Keyboard",
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
  "logitech g640 black": "Logitech G640",
  "logitech g640 original": "Logitech G640",
  "로지텍 미니옵": "Logitech G Pro",
  "로지텍 g pro (검정색)": "Logitech G Pro Gaming Mouse",

  // Logitech headset
  "로지텍 g pro x 2": "Logitech G PRO X 2",
  "logitech g pro wireless": "Logitech G Pro X Wireless Lightspeed",

  // Razer mice
  "레이저 바이퍼 v3 pro": "Razer Viper V3 Pro",
  "레이저 데스에더 v3 pro": "Razer DeathAdder V3 Pro",
  "razer deathadder v3 pro faker edition": "Razer DeathAdder V3 PRO",
  "바이퍼 미니 무선 시그니처 마우스": "Razer Viper Mini Signature Edition",

  // Razer keyboards
  "레이저 헌츠맨 v3 pro": "Razer Huntsman V3 Pro",
  "레이저 헌츠맨 v3 pro tkl": "Razer Huntsman V3 Pro TKL",

  // Razer headset / mousepad
  "레이저 블랙샤크 v2": "Razer BlackShark V2",
  "레이저 기간투스 v2": "Razer Gigantus V2 L",
  "레이저 스트라이더": "Razer Strider L",
  "razer 단패드": "Razer Gigantus V2 M",
  "razer 장패드": "Razer Gigantus V2 XXL",

  // Zowie
  "조위 ec2-cw": "Zowie EC2-CW",
  "조위기어 미코": "Zowie MiCO",
  "조위기어 미코 마우스 kt": "Zowie MiCO",
  "조위 g-sr ii": "Zowie G-SR II",
  "조위 g-sr-se": "Zowie G-SR-SE",
  "benq 중패드": "Zowie P-SR",

  // Other mice
  "카카 fk mini3": "VAXEE XE Wireless Yellow",
  "카카 fk mini3 / fkmini 러비공 마우스": "VAXEE XE Wireless Yellow",
  "자오핀 z1 pro": "Zaopin Z1 Pro",
  "엑스트리파이": "Xtrfy M8 Wireless",

  // Headsets
  "하이퍼엑스 클라우드 ii": "HyperX Cloud II",
  "astro a50": "Logitech ASTRO A50",

  // Mousepads
  "스틸시리즈 qck heavy": "SteelSeries QcK Heavy",
  "아티isan 제로 soft": "Artisan Zero Soft",
  "아티zan 제로 xsoft": "Artisan Zero XSoft",
  "아티zan 하야테 오츠": "Artisan Hayate Otsu",
  "스틸 단패드": "SteelSeries QcK",
  "스틸 장패드": "SteelSeries QcK Heavy",

  // Monitors / misc (keep exact known variants)
  "필co 마제스터치 텐키리스 갈축": "Filco Majestouch Tenkeyless",
};

/** Same physical product, different catalog key spellings. Never mix 2 vs 2s. */
const CATALOG_KEY_EQUIVALENTS: string[][] = [
  ["Logitech G Pro X Keyboard", "Logitech G PRO X Mechanical Keyboard"],
  ["Logitech G Pro X Wireless Headset", "Logitech G Pro X Wireless Lightspeed"],
  ["ASTRO A50", "Logitech ASTRO A50"],
  ["Logitech G Pro X Superlight 2", "Logitech G PRO X SUPERLIGHT 2"],
  ["Logitech G Pro X2 Superlight", "Logitech G PRO X SUPERLIGHT 2"],
  ["Logitech G640", "Logitech G640 Black", "Logitech G640 Original", "로지텍 G640"],
  ["Logitech G Pro X TKL Keyboard Black", "Logitech G PRO X TKL", "Logitech G Pro X TKL"],
  ["Logitech G Pro Wireless", "Logitech G Pro X Wireless Lightspeed"],
  ["Razer DeathAdder V3 PRO", "Razer DeathAdder V3 Pro", "Razer DeathAdder V3 Pro Faker Edition"],
  ["Razer Deathadder V3 Pro", "Razer DeathAdder V3 PRO"],
  ["Razer BlackShark V2 PRO", "Razer BlackShark V2 Pro", "Razer BlackShark V2 Pro Black"],
  ["Razer Gigantus V2", "Razer Gigantus V2 L", "Razer Gigantus V2 M", "Razer Gigantus V2 XXL"],
  ["Razer Huntsman V3 PRO", "Razer Huntsman V3 Pro", "Razer Huntsman V3 Pro Full Size"],
  ["Razer Huntsman V3 PRO TKL", "Razer Huntsman V3 Pro TKL"],
  ["Secretlab TITAN Evo", "Secretlab TITAN Evo T1 Edition", "Secretlab X T1 Gaming Chair"],
];

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

function lookupAlias(input: string): string | undefined {
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  return (
    EQUIPMENT_ALIASES[aliasKey(trimmed)] ??
    EQUIPMENT_ALIASES[normalizeEquipmentName(trimmed)]
  );
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

/** Deep normalize: punctuation, Korean brand/model words → English, then label rules. */
export function normalizeEquipmentName(input: string): string {
  let s = input.trim().toLowerCase();
  s = s.replace(/[®™©]/g, "");
  s = s.replace(/[-_/\\]+/g, " ");
  s = s.replace(/\s+/g, " ");

  for (const [ko, en] of Object.entries(BRAND_TRANSLATIONS)) {
    s = s.replaceAll(ko.toLowerCase(), en);
  }
  for (const [ko, en] of Object.entries(WORD_TRANSLATIONS)) {
    s = s.replaceAll(ko.toLowerCase(), en);
  }

  return normalizeEquipmentLabel(s);
}

function findCatalogKey(input: string, catalogKeys: string[]): string | null {
  const lower = input.trim().toLowerCase();
  const direct = catalogKeys.find((key) => key.toLowerCase() === lower);
  if (direct) return direct;

  const normalized = normalizeEquipmentLabel(input);
  const labelMatch = catalogKeys.find((key) => normalizeEquipmentLabel(key) === normalized);
  if (labelMatch) return labelMatch;

  const deep = normalizeEquipmentName(input);
  return catalogKeys.find((key) => normalizeEquipmentName(key) === deep) ?? null;
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

  const aliasTarget = lookupAlias(trimmed);
  if (aliasTarget) {
    const resolved = findCatalogKey(aliasTarget, catalogKeys);
    if (resolved) return resolved;
  }

  return null;
}

/** Normalized label equality (case/whitespace/x-glue + Korean↔English). */
export function equipmentValueMatchesKey(value: string, canonicalKey: string): boolean {
  if (normalizeEquipmentLabel(value) === normalizeEquipmentLabel(canonicalKey)) return true;
  if (normalizeEquipmentName(value) === normalizeEquipmentName(canonicalKey)) return true;
  return false;
}

function variantCoreKey(name: string): string {
  return normalizeEquipmentName(name)
    .split(" ")
    .filter((token) => token && !VARIANT_TOKENS.has(token))
    .join(" ");
}

/** Token-prefix match for edition/size variants without merging 2 vs 2s. */
function familyPrefixMatch(a: string, b: string): boolean {
  const tokensA = variantCoreKey(a).split(" ").filter(Boolean);
  const tokensB = variantCoreKey(b).split(" ").filter(Boolean);
  if (tokensA.length === 0 || tokensB.length === 0) return false;

  const [shorter, longer] = tokensA.length <= tokensB.length ? [tokensA, tokensB] : [tokensB, tokensA];
  if (shorter.length < 3) return false;

  for (let i = 0; i < shorter.length; i++) {
    if (shorter[i] !== longer[i]) return false;
  }

  const extra = longer.slice(shorter.length);
  if (extra.length === 0) return true;
  return extra.every((token) => SAFE_EXTRA_TOKENS.has(token));
}

function labelsShareEquivalentGroup(
  a: string,
  b: string,
  catalogKeys: string[],
): boolean {
  for (const group of CATALOG_KEY_EQUIVALENTS) {
    const aInGroup = group.some((member) => equipmentValueMatchesKey(member, a));
    const bInGroup = group.some((member) => equipmentValueMatchesKey(member, b));
    if (aInGroup && bInGroup) return true;
  }

  const resolvedA = findCatalogKey(a, catalogKeys);
  const resolvedB = findCatalogKey(b, catalogKeys);
  if (resolvedA && resolvedB && equipmentValueMatchesKey(resolvedA, resolvedB)) return true;

  return false;
}

function collectLabelCandidates(label: string, catalogKeys: string[]): Set<string> {
  const out = new Set<string>([label.trim()]);
  const resolved = resolveCanonicalEquipmentKey(label, catalogKeys);
  if (resolved) out.add(resolved);
  const found = findCatalogKey(label, catalogKeys);
  if (found) out.add(found);
  return out;
}

/** Compare two equipment labels across normalization, aliases, variants, and catalog ids. */
export function equipmentLabelsMatch(
  a: string,
  b: string,
  catalogKeys: string[],
  keyToId?: Map<string, number>,
): boolean {
  const left = a.trim();
  const right = b.trim();
  if (!left || !right) return false;

  const leftCandidates = collectLabelCandidates(left, catalogKeys);
  const rightCandidates = collectLabelCandidates(right, catalogKeys);

  for (const l of leftCandidates) {
    for (const r of rightCandidates) {
      if (equipmentValueMatchesKey(l, r)) return true;

      const coreLeft = variantCoreKey(l);
      const coreRight = variantCoreKey(r);
      if (coreLeft.length >= 6 && coreLeft === coreRight) return true;
      if (familyPrefixMatch(l, r)) return true;

      if (labelsShareEquivalentGroup(l, r, catalogKeys)) return true;

      const resolvedLeft = resolveCanonicalEquipmentKey(l, catalogKeys) ?? findCatalogKey(l, catalogKeys);
      const resolvedRight = resolveCanonicalEquipmentKey(r, catalogKeys) ?? findCatalogKey(r, catalogKeys);
      if (
        resolvedLeft &&
        resolvedRight &&
        keyToId?.get(resolvedLeft) != null &&
        keyToId.get(resolvedLeft) === keyToId.get(resolvedRight)
      ) {
        return true;
      }
    }
  }

  return false;
}

function collectEquivalentKeys(
  targetKey: string,
  catalogKeys: string[],
  keyToId?: Map<string, number>,
): Set<string> {
  const equivalents = new Set<string>([targetKey]);
  const targetNorm = normalizeEquipmentName(targetKey);

  for (const key of catalogKeys) {
    if (normalizeEquipmentName(key) === targetNorm) equivalents.add(key);
    if (keyToId && keyToId.get(key) != null && keyToId.get(key) === keyToId.get(targetKey)) {
      equivalents.add(key);
    }
  }

  for (const group of CATALOG_KEY_EQUIVALENTS) {
    const inGroup = group.some((member) => equipmentValueMatchesKey(member, targetKey));
    if (!inGroup) continue;
    for (const member of group) {
      equivalents.add(member);
      const resolved = findCatalogKey(member, catalogKeys);
      if (resolved) equivalents.add(resolved);
    }
  }

  for (const key of catalogKeys) {
    if (equipmentLabelsMatch(key, targetKey, catalogKeys, keyToId)) {
      equivalents.add(key);
    }
  }

  return equivalents;
}

export function playerUsesEquipment(
  raw: RawPlayer,
  canonicalKey: string,
  catalogKeys: string[],
  equipmentId?: number | null,
  category?: string,
  keyToId?: Map<string, number>,
  searchNames: string[] = [],
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

  const targetResolved = resolveCanonicalEquipmentKey(canonicalKey, catalogKeys) ?? canonicalKey;
  const matchKeys = collectEquivalentKeys(targetResolved, catalogKeys, keyToId);
  for (const name of searchNames) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    matchKeys.add(trimmed);
    const resolved = resolveCanonicalEquipmentKey(trimmed, catalogKeys);
    if (resolved) matchKeys.add(resolved);
  }

  const fields = category
    ? GAMER_EQUIPMENT_FIELDS.filter((field) => EQUIPMENT_FIELD_TO_CATEGORY[field] === category)
    : GAMER_EQUIPMENT_FIELDS;

  for (const field of fields) {
    const value = raw[field];
    if (typeof value !== "string" || !value.trim()) continue;

    for (const matchKey of matchKeys) {
      if (equipmentLabelsMatch(value, matchKey, catalogKeys, keyToId)) return true;
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
