/**
 * Backfill gamers_info equipment *_id columns from text fields + equipment_info catalog.
 *
 * Prerequisites: run utils/supabase/functions/add_gamers_equipment_ids.sql
 *
 * Usage:
 *   node scripts/sync_equipment_ids.mjs           # dry run
 *   node scripts/sync_equipment_ids.mjs --execute # apply
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { resolveCanonicalEquipmentKey } from "./equipmentMatchUtils.mjs";

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

const FIELD_PAIRS = [
  ["mouse", "mouse_id"],
  ["keyboard", "keyboard_id"],
  ["headset", "headset_id"],
  ["monitor", "monitor_id"],
  ["mousepad", "mousepad_id"],
  ["chair", "chair_id"],
  ["desk", "desk_id"],
];

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: equipmentRows, error: eqErr } = await supabase
    .from("equipment_info")
    .select("id, key, category");

  if (eqErr) {
    console.error("Failed to fetch equipment_info:", eqErr.message);
    process.exit(1);
  }

  const catalogKeys = (equipmentRows ?? []).map((r) => r.key).filter(Boolean);
  const keyToId = new Map();
  for (const row of equipmentRows ?? []) {
    if (row.key) keyToId.set(row.key, row.id);
  }

  const { data: gamers, error: gErr } = await supabase
    .from("gamers_info")
    .select(
      "id, ign, name, mouse, keyboard, headset, monitor, mousepad, chair, desk, mouse_id, keyboard_id, headset_id, monitor_id, mousepad_id, chair_id, desk_id",
    );

  if (gErr) {
    console.error("Failed to fetch gamers_info:", gErr.message);
    process.exit(1);
  }

  const updates = [];

  for (const gamer of gamers ?? []) {
    const patch = {};

    for (const [textField, idField] of FIELD_PAIRS) {
      const textValue = gamer[textField];
      if (!textValue || !String(textValue).trim()) {
        if (gamer[idField] != null) patch[idField] = null;
        continue;
      }

      const canonical = resolveCanonicalEquipmentKey(String(textValue), catalogKeys);
      const targetId = canonical ? (keyToId.get(canonical) ?? null) : null;

      if (gamer[idField] !== targetId) {
        patch[idField] = targetId;
      }
    }

    if (Object.keys(patch).length > 0) {
      updates.push({ id: gamer.id, ign: gamer.ign, name: gamer.name, patch });
    }
  }

  console.log(`Players needing equipment_id update: ${updates.length}`);
  for (const u of updates.slice(0, 20)) {
    console.log(`  ${u.name} (${u.ign}):`, u.patch);
  }
  if (updates.length > 20) console.log(`  ... and ${updates.length - 20} more`);

  if (!shouldExecute) {
    console.log("\nRe-run with --execute to apply.");
    return;
  }

  let ok = 0;
  for (const u of updates) {
    const { error } = await supabase.from("gamers_info").update(u.patch).eq("id", u.id);
    if (error) console.error(`FAIL ${u.ign}:`, error.message);
    else ok++;
  }
  console.log(`Updated ${ok}/${updates.length} players.`);
}

main().catch(console.error);
