/**
 * Normalize gamers_info equipment columns to exact equipment_info.key values.
 * NO fuzzy matching — only exact catalog keys or explicit EQUIPMENT_ALIASES.
 *
 * Usage:
 *   node scripts/normalize_gamers_equipment.mjs           # dry run
 *   node scripts/normalize_gamers_equipment.mjs --execute # apply + recalc rankings
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { recalcEquipmentRankings } from "./recalcEquipmentRankings.mjs";
import { findCatalogKey, labelsMatch } from "./equipmentMatchUtils.mjs";

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
const shouldExecute = process.argv.includes("--execute");

const EQUIPMENT_ALIASES = {
  "로지텍 g pro x 기계식 키보드": "Logitech G PRO X Mechanical Keyboard",
  "logitech g pro x mechanical keyboard": "Logitech G PRO X Mechanical Keyboard",
  "logitech g pro x keyboard": "Logitech G PRO X Mechanical Keyboard",
  "로지텍 g pro x tkl": "Logitech G PRO X TKL",
  "logitech g pro x tkl keyboard black": "Logitech G PRO X TKL",
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
  "로지텍 g pro x 2": "Logitech G PRO X 2",
  "레이저 바이퍼 v3 pro": "Razer Viper V3 Pro",
  "레이저 데스에더 v3 pro": "Razer DeathAdder V3 Pro",
  "바이퍼 미니 무선 시그니처 마우스": "Razer Viper Mini Signature Edition",
  "레이저 헌츠맨 v3 pro": "Razer Huntsman V3 Pro",
  "레이저 헌츠맨 v3 pro tkl": "Razer Huntsman V3 Pro TKL",
  "레이저 블랙샤크 v2": "Razer BlackShark V2",
  "레이저 기간투스 v2": "Razer Goliathus V2",
  "레이저 스트라이더": "Razer Strider",
  "조위 ec2-cw": "Zowie EC2-CW",
  "조위기어 미코": "Zowie MiCO",
  "조위기어 미코 마우스 kt": "Zowie MiCO",
  "조위 g-sr ii": "Zowie G-SR II",
  "조위 g-sr-se": "Zowie G-SR-SE",
  "엑스트리파이": "Xtrfy M8 Wireless",
};

const EQUIP_FIELDS = ["mouse", "keyboard", "headset", "monitor", "mousepad", "chair", "desk"];

function resolveCanonicalEquipmentKey(input, catalogKeys) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const direct = findCatalogKey(trimmed, catalogKeys);
  if (direct) return direct;

  const aliasTarget = EQUIPMENT_ALIASES[trimmed.toLowerCase()];
  if (!aliasTarget) return null;

  return findCatalogKey(aliasTarget, catalogKeys);
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

  const catalogKeys = equipmentRows.map((row) => row.key).filter(Boolean);
  const { data: gamers, error: gErr } = await supabase
    .from("gamers_info")
    .select("id, name, ign, mouse, keyboard, headset, monitor, mousepad, chair, desk");
  if (gErr) {
    console.error(gErr);
    process.exit(1);
  }

  const fixes = [];
  const unresolved = [];

  for (const gamer of gamers) {
    for (const field of EQUIP_FIELDS) {
      const value = gamer[field];
      if (!value?.trim()) continue;

      const canonical = resolveCanonicalEquipmentKey(value, catalogKeys);
      if (!canonical) {
        unresolved.push({ id: gamer.id, name: gamer.name, ign: gamer.ign, field, value });
        continue;
      }

      if (value.trim().toLowerCase() !== canonical.toLowerCase()) {
        fixes.push({
          id: gamer.id,
          name: gamer.name,
          ign: gamer.ign,
          field,
          from: value,
          to: canonical,
        });
      }
    }
  }

  console.log(`Players: ${gamers.length}, catalog keys: ${catalogKeys.length}`);
  console.log(`To normalize: ${fixes.length}, unresolved: ${unresolved.length}\n`);

  for (const fix of fixes) {
    console.log(`[FIX] ${fix.name} (${fix.ign}) ${fix.field}: "${fix.from}" -> "${fix.to}"`);
  }

  for (const item of unresolved) {
    console.log(`[MISS] ${item.name} (${item.ign}) ${item.field}: "${item.value}"`);
  }

  if (!shouldExecute) {
    if (fixes.length > 0) {
      console.log("\nRe-run with --execute to update gamers_info and recalculate equipment rankings.");
    }
    return;
  }

  console.log(`\nApplying ${fixes.length} updates...`);
  for (const fix of fixes) {
    const { error } = await supabase
      .from("gamers_info")
      .update({ [fix.field]: fix.to })
      .eq("id", fix.id);
    if (error) console.error(`FAIL ${fix.id} ${fix.field}:`, error.message);
  }

  console.log("Recalculating equipment currently_used + rankings...");
  const result = await recalcEquipmentRankings(supabase);
  if (result.method === "rpc") {
    console.log("Equipment rankings recalculated.");
  } else {
    console.log("Equipment rankings recalculated (client fallback).");
  }
}

main().catch(console.error);
