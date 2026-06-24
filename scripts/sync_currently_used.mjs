/**
 * Update currently_used in equipment_info using EXACT key matches only.
 * Run normalize_gamers_equipment.mjs --execute first.
 *
 * Usage: node scripts/sync_currently_used.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { recalcEquipmentRankings } from './recalcEquipmentRankings.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv(filePath) {
  try {
    const text = readFileSync(filePath, 'utf-8');
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      process.env[key] = val;
    }
  } catch {}
}
loadEnv(resolve(__dirname, '..', '.env.local'));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const EQUIP_FIELDS = ['mouse', 'keyboard', 'headset', 'monitor', 'mousepad', 'chair', 'desk'];

function exactMatch(playerValue, equipKey) {
  if (!playerValue || !equipKey) return false;
  return playerValue.trim().toLowerCase() === equipKey.trim().toLowerCase();
}

async function main() {
  console.log('Syncing currently_used (exact match only)...\n');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: equipment, error: eqErr } = await supabase
    .from('equipment_info')
    .select('id, key');

  if (eqErr) { console.error('Failed to fetch equipment_info:', eqErr); process.exit(1); }

  const { data: gamers, error: gErr } = await supabase
    .from('gamers_info')
    .select('id, mouse, keyboard, headset, monitor, mousepad, chair, desk');

  if (gErr) { console.error('Failed to fetch gamers_info:', gErr); process.exit(1); }

  let updated = 0;
  for (const equip of equipment) {
    const matchedIds = new Set();

    for (const g of gamers) {
      for (const field of EQUIP_FIELDS) {
        const val = g[field];
        if (!val) continue;
        if (exactMatch(val, equip.key)) {
          matchedIds.add(g.id);
          break;
        }
      }
    }

    const { error } = await supabase
      .from('equipment_info')
      .update({ currently_used: matchedIds.size })
      .eq('id', equip.id);

    if (error) console.error(`  FAIL ${equip.key}:`, error);
    else updated++;
  }

  console.log(`Updated currently_used for ${updated}/${equipment.length} items`);

  const result = await recalcEquipmentRankings(supabase);
  if (result.method === "rpc") {
    console.log("Equipment rankings recalculated.");
  } else {
    console.log("Equipment rankings recalculated (client fallback).");
  }
}

main().catch(console.error);
