/**
 * Shared equipment matching helpers for Node scripts.
 * Keep in sync with lib/equipment/matchEquipment.ts
 */

const BRAND_TRANSLATIONS = {
  로지텍: "logitech",
  레이저: "razer",
  스틸시리즈: "steelseries",
  조위: "zowie",
  조위기어: "zowie",
  엑스트리파이: "xtrfy",
  하이퍼엑스: "hyperx",
  아티zan: "artisan",
  필co: "filco",
  카카: "vaxee",
  자오핀: "zaopin",
};

const WORD_TRANSLATIONS = {
  기계식: "mechanical",
  키보드: "keyboard",
  마우스: "mouse",
  헤드셋: "headset",
  모니터: "monitor",
  마우스패드: "mousepad",
  무선: "wireless",
  게이밍: "gaming",
  슈퍼라이트: "superlight",
  바이퍼: "viper",
  데스에더: "deathadder",
  헌츠맨: "huntsman",
  블랙샤크: "blackshark",
  클라우드: "cloud",
};

export function normalizeEquipmentLabel(input) {
  let s = input.trim().toLowerCase();
  s = s.replace(/\s+/g, " ");
  s = s.replace(/\bx\s*(\d+)([a-z]*)\b/g, "x $1$2");
  s = s.replace(/\bsuperlight\s+(?:x\s+)?(\d+)([a-z]*)\b/g, "superlight x $1$2");
  return s.trim();
}

export function normalizeEquipmentName(input) {
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

export function labelsMatch(a, b) {
  return normalizeEquipmentLabel(a) === normalizeEquipmentLabel(b)
    || normalizeEquipmentName(a) === normalizeEquipmentName(b);
}

export function findCatalogKey(input, catalogKeys) {
  const lower = input.trim().toLowerCase();
  const direct = catalogKeys.find((key) => key.toLowerCase() === lower);
  if (direct) return direct;

  const normalized = normalizeEquipmentLabel(input);
  const labelMatch = catalogKeys.find((key) => normalizeEquipmentLabel(key) === normalized);
  if (labelMatch) return labelMatch;

  const deep = normalizeEquipmentName(input);
  return catalogKeys.find((key) => normalizeEquipmentName(key) === deep) ?? null;
}

/** Keep in sync with lib/equipment/matchEquipment.ts EQUIPMENT_ALIASES */
export const EQUIPMENT_ALIASES = {
  "로지텍 g pro x 기계식 키보드": "Logitech G PRO X Mechanical Keyboard",
  "logitech g pro x mechanical keyboard": "Logitech G PRO X Mechanical Keyboard",
  "logitech g pro x keyboard": "Logitech G PRO X Mechanical Keyboard",
  "로지텍 g pro x tkl": "Logitech G PRO X TKL",
  "logitech g pro x tkl keyboard black": "Logitech G PRO X TKL",
  "로지텍 g pro x superlight 2": "Logitech G PRO X SUPERLIGHT 2",
  "로지텍 g pro x 슈퍼라이트 2": "Logitech G PRO X SUPERLIGHT 2",
  "로지텍 g x superlight2": "Logitech G PRO X SUPERLIGHT 2",
  "logitech g pro x2 superlight": "Logitech G PRO X SUPERLIGHT 2",
  "superlight x2": "Logitech G PRO X SUPERLIGHT 2",
  "superlight x 2": "Logitech G PRO X SUPERLIGHT 2",
  "로지텍 g102": "Logitech G102",
  "레이저 바이퍼 v3 pro": "Razer Viper V3 Pro",
  "하이퍼엑스 클라우드 ii": "HyperX Cloud II",
  "astro a50": "Logitech ASTRO A50",
};

function lookupAlias(input) {
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  return EQUIPMENT_ALIASES[trimmed.toLowerCase()] ?? EQUIPMENT_ALIASES[normalizeEquipmentName(trimmed)];
}

export function resolveCanonicalEquipmentKey(input, catalogKeys) {
  const trimmed = input.trim();
  if (!trimmed || catalogKeys.length === 0) return null;

  const direct = findCatalogKey(trimmed, catalogKeys);
  if (direct) return direct;

  const aliasTarget = lookupAlias(trimmed);
  if (!aliasTarget) return null;

  return findCatalogKey(aliasTarget, catalogKeys);
}
