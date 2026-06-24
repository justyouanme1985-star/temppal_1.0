/**
 * Find gamers_info equipment strings that don't resolve to equipment_info keys.
 * Optionally normalize them to canonical keys.
 *
 * Usage:
 *   node scripts/find_equipment_mismatches.mjs
 *   node scripts/find_equipment_mismatches.mjs --fix
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv(filePath) {
  try {
    const text = readFileSync(filePath, "utf-8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  } catch {}
}

loadEnv(resolve(__dirname, "..", ".env.local"));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const shouldFix = process.argv.includes("--fix");

const BRAND_TRANSLATIONS = {
  로지텍: "logitech",
  레이저: "razer",
  스틸시리즈: "steelseries",
  조위: "zowie",
  조위기어: "zowie",
  하이퍼엑스: "hyperx",
};

const WORD_TRANSLATIONS = {
  기계식: "mechanical",
  키보드: "keyboard",
  마우스: "mouse",
  헤드셋: "headset",
  모니터: "monitor",
  마우스패드: "mousepad",
  무선: "wireless",
  유선: "wired",
};

const EQUIPMENT_EXACT_ALIASES = {
  "로지텍 g pro x 기계식 키보드": "Logitech G PRO X Mechanical Keyboard",
};

const GENERIC_TOKENS = new Set([
  "keyboard", "mouse", "headset", "monitor", "mousepad", "pad", "mechanical",
  "gaming", "wireless", "wired", "black", "white", "pro", "x", "2", "ii",
]);

const EQUIP_FIELDS = ["mouse", "keyboard", "headset", "monitor", "mousepad", "chair", "desk"];

function normalizeEquipmentName(name) {
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

function significantTokens(normalized) {
  return normalized.split(" ").filter((token) => token.length > 1 && !GENERIC_TOKENS.has(token));
}

function tokenOverlapScore(a, b) {
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

function equipmentNamesMatch(a, b) {
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

function findBestEquipmentKey(input, keys) {
  const normalizedInput = normalizeEquipmentName(input);
  const alias = EQUIPMENT_EXACT_ALIASES[normalizedInput];
  if (alias && keys.includes(alias)) return alias;

  let bestKey = null;
  let bestScore = 0;
  for (const key of keys) {
    if (!equipmentNamesMatch(input, key)) continue;
    const normalizedKey = normalizeEquipmentName(key);
    let score = tokenOverlapScore(normalizedInput, normalizedKey);
    if (normalizedInput === normalizedKey) score = 1;
    else if (normalizedInput.includes(normalizedKey) || normalizedKey.includes(normalizedInput)) score = 0.9;
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }
  return bestKey;
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: equipmentRows, error: eqErr } = await supabase.from("equipment_info").select("key");
  if (eqErr) {
    console.error(eqErr);
    process.exit(1);
  }

  const keys = equipmentRows.map((row) => row.key);
  const { data: gamers, error: gErr } = await supabase
    .from("gamers_info")
    .select("id, name, ign, mouse, keyboard, headset, monitor, mousepad, chair, desk");
  if (gErr) {
    console.error(gErr);
    process.exit(1);
  }

  const mismatches = [];
  const fixes = [];

  for (const gamer of gamers) {
    for (const field of EQUIP_FIELDS) {
      const value = gamer[field];
      if (!value?.trim()) continue;

      const exact = keys.find((key) => key.toLowerCase() === value.toLowerCase());
      if (exact) continue;

      const canonical = findBestEquipmentKey(value, keys);
      if (!canonical) {
        mismatches.push({
          playerId: gamer.id,
          name: gamer.name,
          ign: gamer.ign,
          field,
          value,
          canonical: null,
        });
        continue;
      }

      if (canonical !== value) {
        mismatches.push({
          playerId: gamer.id,
          name: gamer.name,
          ign: gamer.ign,
          field,
          value,
          canonical,
        });
        fixes.push({ playerId: gamer.id, field, canonical, value });
      }
    }
  }

  console.log(`Scanned ${gamers.length} players, ${keys.length} equipment keys`);
  console.log(`Found ${mismatches.length} mismatched equipment strings\n`);

  for (const item of mismatches) {
    if (item.canonical) {
      console.log(`[LINK] ${item.name} (${item.ign}) ${item.field}: "${item.value}" -> "${item.canonical}"`);
    } else {
      console.log(`[MISS] ${item.name} (${item.ign}) ${item.field}: "${item.value}" (no catalog match)`);
    }
  }

  if (!shouldFix) {
    if (fixes.length > 0) {
      console.log(`\n${fixes.length} rows can be normalized. Re-run with --fix to update gamers_info.`);
    }
    return;
  }

  console.log(`\nApplying ${fixes.length} fixes...`);
  for (const fix of fixes) {
    const { error } = await supabase
      .from("gamers_info")
      .update({ [fix.field]: fix.canonical })
      .eq("id", fix.playerId);
    if (error) {
      console.error(`FAIL ${fix.playerId} ${fix.field}:`, error.message);
    } else {
      console.log(`OK ${fix.playerId} ${fix.field}: "${fix.value}" -> "${fix.canonical}"`);
    }
  }
}

main().catch(console.error);
