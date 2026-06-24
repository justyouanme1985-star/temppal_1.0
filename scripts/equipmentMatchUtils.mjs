/**
 * Shared equipment matching helpers for Node scripts.
 * Keep in sync with lib/equipment/matchEquipment.ts
 */

export function normalizeEquipmentLabel(input) {
  let s = input.trim().toLowerCase();
  s = s.replace(/\s+/g, " ");
  s = s.replace(/\bx\s*(\d+)([a-z]*)\b/g, "x $1$2");
  s = s.replace(/\bsuperlight\s+(?:x\s+)?(\d+)([a-z]*)\b/g, "superlight x $1$2");
  return s.trim();
}

export function labelsMatch(a, b) {
  return normalizeEquipmentLabel(a) === normalizeEquipmentLabel(b);
}

export function findCatalogKey(input, catalogKeys) {
  const lower = input.trim().toLowerCase();
  const direct = catalogKeys.find((key) => key.toLowerCase() === lower);
  if (direct) return direct;

  const normalized = normalizeEquipmentLabel(input);
  return catalogKeys.find((key) => normalizeEquipmentLabel(key) === normalized) ?? null;
}

/** Keep in sync with lib/equipment/matchEquipment.ts EQUIPMENT_ALIASES */
export const EQUIPMENT_ALIASES = {
  "로지텍 g pro x 기계식 키보드": "Logitech G PRO X Mechanical Keyboard",
  "logitech g pro x mechanical keyboard": "Logitech G PRO X Mechanical Keyboard",
  "logitech g pro x keyboard": "Logitech G Pro X Keyboard",
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
};

export function resolveCanonicalEquipmentKey(input, catalogKeys) {
  const trimmed = input.trim();
  if (!trimmed || catalogKeys.length === 0) return null;

  const direct = findCatalogKey(trimmed, catalogKeys);
  if (direct) return direct;

  const aliasTarget = EQUIPMENT_ALIASES[trimmed.toLowerCase()];
  if (!aliasTarget) return null;

  return findCatalogKey(aliasTarget, catalogKeys);
}
