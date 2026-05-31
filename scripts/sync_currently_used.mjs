/**
 * Update currently_used in equipment_info and set weight_c = 100
 *
 * This script:
 * 1. Counts how many gamers_info players reference each equipment key
 * 2. Updates equipment_info.currently_used
 * 3. Sets weight_c = 100 in admin_power_ranking (equipment system)
 * 4. Recalculates equipment rankings considering currently_used
 *
 * Usage: node scripts/sync_currently_used.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ──────────────────────────────────────────────────────
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

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials.');
  process.exit(1);
}

// ── Normalize helper ─────────────────────────────────────────────────────
function norm(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[\s-]+/g, ' ')
    .replace(/[®™©]/g, '')
    .trim();
}

// ── Fuzzy match ──────────────────────────────────────────────────────────
function fuzzyMatch(query, target) {
  const nq = norm(query);
  const nt = norm(target);
  if (!nq || !nt) return false;
  if (nq === nt) return true;
  if (nt.includes(nq)) return true;
  if (nq.includes(nt)) return true;
  return false;
}

async function main() {
  console.log('🔧 Syncing currently_used and weight_c...\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // ── 1. Fetch all equipment keys ──────────────────────────────────────
  const { data: equipment, error: eqErr } = await supabase
    .from('equipment_info')
    .select('id, key');

  if (eqErr) { console.error('Failed to fetch equipment_info:', eqErr); process.exit(1); }
  console.log(`📦 Equipment items: ${equipment.length}`);

  // ── 2. Fetch all gamers_info equipment fields ────────────────────────
  const { data: gamers, error: gErr } = await supabase
    .from('gamers_info')
    .select('mouse, keyboard, headset, monitor, mousepad, chair, desk, previous_mouse, previous_keyboard, previous_mousepad');

  if (gErr) { console.error('Failed to fetch gamers_info:', gErr); process.exit(1); }
  console.log(`👤 Gamers: ${gamers.length}`);

  // ── 3. Count unique players per equipment key (fuzzy) ────────────────
  const equipFields = ['mouse', 'keyboard', 'headset', 'monitor', 'mousepad', 'chair', 'desk', 'previous_mouse', 'previous_keyboard', 'previous_mousepad'];

  const counts = new Map(); // equipment_id → Set of player identifiers

  for (const equip of equipment) {
    const matchedPlayers = new Set();

    for (const g of gamers) {
      for (const field of equipFields) {
        const val = g[field];
        if (!val) continue;
        if (fuzzyMatch(val, equip.key)) {
          matchedPlayers.add(`${g.mouse}-${g.keyboard}-${g.headset}-${g.monitor}-${g.mousepad}-${g.chair}-${g.desk}`);
          break;
        }
      }
    }

    counts.set(equip.id, matchedPlayers.size);
  }

  // ── 4. Update equipment_info.currently_used ──────────────────────────
  let updated = 0;
  for (const equip of equipment) {
    const count = counts.get(equip.id) || 0;
    const { error } = await supabase
      .from('equipment_info')
      .update({ currently_used: count })
      .eq('id', equip.id);

    if (error) {
      console.error(`  ❌ Failed to update ${equip.key}:`, error);
    } else {
      updated++;
    }
  }
  console.log(`\n✅ Updated currently_used for ${updated}/${equipment.length} items`);

  // ── 5. Set weight_c = 100 for equipment system ───────────────────────
  const { error: wErr } = await supabase
    .from('admin_power_ranking')
    .update({ weight_c: 100 })
    .eq('system', 'equipment');

  if (wErr) {
    console.error('❌ Failed to update weight_c:', wErr);
  } else {
    console.log('✅ Set weight_c = 100 for equipment system');
  }

  // ── 6. Recalculate equipment rankings ────────────────────────────────
  // Fetch all equipment with their current counts
  const { data: allEquip, error: allErr } = await supabase
    .from('equipment_info')
    .select('id, category, count_items_recent, count_items_cumulative, currently_used');

  if (allErr) {
    console.error('❌ Failed to fetch equipment for ranking:', allErr);
  } else {
    // Group by category and rank
    const categories = {};
    for (const e of allEquip) {
      const points = (e.count_items_recent || 0) * 3
                   + (e.count_items_cumulative || 0) * 1
                   + (e.currently_used || 0) * 100;
      if (!categories[e.category]) categories[e.category] = [];
      categories[e.category].push({ id: e.id, points });
    }

    let ranked = 0;
    for (const [cat, items] of Object.entries(categories)) {
      items.sort((a, b) => b.points - a.points || a.id - b.id);
      for (let i = 0; i < items.length; i++) {
        const { error: rErr } = await supabase
          .from('equipment_info')
          .update({
            apoint: items[i].points, // temp, will be corrected
            total_points: items[i].points,
            popularity_rank: i + 1,
          })
          .eq('id', items[i].id);
        if (!rErr) ranked++;
      }
    }
    console.log(`✅ Updated rankings for ${ranked}/${allEquip.length} items`);
  }

  console.log('\n🎉 Done!');
}

main().catch(console.error);
