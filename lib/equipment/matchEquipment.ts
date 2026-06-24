/**
 * Shared equipment name normalization and cross-language matching.
 * Used by reverse player lookup, spec resolution, and sync scripts.
 */

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
  아티산: "artisan",
  제닉스: "genesis",
  필co: "filco",
  덱: "deck",
  레오폴드: "leopold",
  벤큐: "benq",
  에이수스: "asus",
  LG: "lg",
  삼성: "samsung",
  앱코: "abko",
  우크루즈: "wooting",
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
};

/** Known player-side strings → canonical equipment_info.key */
export const EQUIPMENT_EXACT_ALIASES: Record<string, string> = {
  "로지텍 g pro x 기계식 키보드": "Logitech G PRO X Mechanical Keyboard",
  "로지텍 g pro x mechanical keyboard": "Logitech G PRO X Mechanical Keyboard",
  "logitech g pro x keyboard": "Logitech G Pro X Keyboard",
  "로지텍 g pro x tkl": "Logitech G PRO X TKL",
  "로지텍 g pro x 2": "Logitech G PRO X 2",
  "로지텍 g pro x superlight 2": "Logitech G PRO X SUPERLIGHT 2",
  "로지텍 g x superlight2": "Logitech G PRO X SUPERLIGHT 2",
  "로지텍 g102": "Logitech G102",
  "로지텍 g640": "Logitech G640",
  "레이저 바이퍼 v3 pro": "Razer Viper V3 Pro",
  "레이저 데스에더 v3 pro": "Razer DeathAdder V3 Pro",
  "레이저 헌츠맨 v3 pro": "Razer Huntsman V3 Pro",
  "레이저 헌츠맨 v3 pro tkl": "Razer Huntsman V3 Pro TKL",
};

const GENERIC_TOKENS = new Set([
  "keyboard",
  "mouse",
  "headset",
  "monitor",
  "mousepad",
  "pad",
  "mechanical",
  "gaming",
  "wireless",
  "wired",
  "black",
  "white",
  "pro",
  "x",
  "2",
  "ii",
  "the",
  "and",
]);

export function normalizeEquipmentName(name: string): string {
  let value = (name || "")
    .toLowerCase()
    .replace(/[®™©]/g, "")
    .replace(/[-_/\\]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  for (const [ko, en] of Object.entries(BRAND_TRANSLATIONS)) {
    value = value.replaceAll(ko.toLowerCase(), en);
  }
  for (const [ko, en] of Object.entries(WORD_TRANSLATIONS)) {
    value = value.replaceAll(ko.toLowerCase(), en);
  }

  return value.replace(/\s+/g, " ").trim();
}

function significantTokens(normalized: string): string[] {
  return normalized
    .split(" ")
    .filter((token) => token.length > 1 && !GENERIC_TOKENS.has(token));
}

function tokenOverlapScore(a: string, b: string): number {
  const tokensA = significantTokens(a);
  const tokensB = significantTokens(b);
  const sourceA = tokensA.length > 0 ? tokensA : a.split(" ").filter((t) => t.length > 1);
  const sourceB = tokensB.length > 0 ? tokensB : b.split(" ").filter((t) => t.length > 1);

  if (sourceA.length === 0 || sourceB.length === 0) return 0;

  let matches = 0;
  for (const token of sourceA) {
    if (sourceB.includes(token)) matches += 1;
  }
  return matches / Math.max(sourceA.length, sourceB.length);
}

export function equipmentNamesMatch(a: string, b: string): boolean {
  if (!a?.trim() || !b?.trim()) return false;

  const aliasA = EQUIPMENT_EXACT_ALIASES[normalizeEquipmentName(a)];
  const aliasB = EQUIPMENT_EXACT_ALIASES[normalizeEquipmentName(b)];
  const resolvedA = aliasA ?? a;
  const resolvedB = aliasB ?? b;

  const na = normalizeEquipmentName(resolvedA);
  const nb = normalizeEquipmentName(resolvedB);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;

  return tokenOverlapScore(na, nb) >= 0.5;
}

export function findBestEquipmentKey(
  input: string,
  keys: string[],
): string | null {
  if (!input?.trim() || keys.length === 0) return null;

  const normalizedInput = normalizeEquipmentName(input);
  const alias = EQUIPMENT_EXACT_ALIASES[normalizedInput];
  if (alias && keys.includes(alias)) return alias;

  let bestKey: string | null = null;
  let bestScore = 0;

  for (const key of keys) {
    if (!equipmentNamesMatch(input, key)) continue;

    const normalizedKey = normalizeEquipmentName(key);
    let score = 0.5;

    if (normalizedInput === normalizedKey) score = 1;
    else if (normalizedInput.includes(normalizedKey) || normalizedKey.includes(normalizedInput)) score = 0.9;
    else score = tokenOverlapScore(normalizedInput, normalizedKey);

    if (alias && key === alias) score += 0.05;
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  return bestKey;
}

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

import type { RawPlayer } from "../playerMapping";

export function playerUsesEquipment(
  raw: RawPlayer,
  equipmentName: string,
  canonicalKey: string,
): boolean {
  for (const field of GAMER_EQUIPMENT_FIELDS) {
    const value = raw[field];
    if (typeof value !== "string" || !value) continue;
    if (equipmentNamesMatch(value, canonicalKey) || equipmentNamesMatch(value, equipmentName)) {
      return true;
    }
  }
  return false;
}
