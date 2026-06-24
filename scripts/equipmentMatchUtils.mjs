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
