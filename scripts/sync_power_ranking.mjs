/**
 * Sync points from gamers_info → admin_power_ranking and ranking back.
 *
 * Mapping:
 *   count_player_recent    → a_point
 *   count_player_cumulative → b_point
 *   count_items_recent     → c_point
 *   count_items_cumulative → d_point
 *   total_point = a + b + c + d
 *
 * Then writes admin_power_ranking.ranking back to gamers_info.admin_power_ranking.
 *
 * Usage: node scripts/sync_power_ranking.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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

async function main() {
  const url = `${SUPABASE_URL}/rest/v1`;
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
  };

  // 1. Fetch all gamers_info counts
  const gamersRes = await fetch(`${url}/gamers_info?select=id,game,count_player_recent,count_player_cumulative,count_items_recent,count_items_cumulative`, { headers });
  const gamers = await gamersRes.json();

  // 2. Calculate points and upsert
  //
  // Formula:
  //   a_point = count_player_recent   × 5
  //   b_point = count_player_cumulative × 1
  //   c_point = count_items_recent    × 2
  //   d_point = count_items_cumulative  × 1
  //   total_point = a + b + c + d
  //
  // Calculate points per player
  const playersWithPoints = [];
  for (const g of gamers) {
    const a = (g.count_player_recent ?? 0) * 5;
    const b = (g.count_player_cumulative ?? 0) * 1;
    const c = (g.count_items_recent ?? 0) * 2;
    const d = (g.count_items_cumulative ?? 0) * 1;
    playersWithPoints.push({
      id: g.id,
      game: g.game,
      a_point: a, b_point: b, c_point: c, d_point: d,
      total_point: a + b + c + d,
    });
  }

  // Group by game, sort by total_point DESC, assign ranking
  const GAME_TABLES = {
    lol: 'admin_power_ranking_lol',
    valorant: 'admin_power_ranking_valorant',
    battlegrounds: 'admin_power_ranking_battlegrounds',
    starcraft: 'admin_power_ranking_starcraft',
  };

  for (const [game, table] of Object.entries(GAME_TABLES)) {
    const gamePlayers = playersWithPoints
      .filter((p) => p.game === game)
      .sort((a, b) => b.total_point - a.total_point);

    // Assign ranking (ties get same rank)
    let currentRank = 0;
    let prevTotal = Infinity;
    for (let i = 0; i < gamePlayers.length; i++) {
      if (gamePlayers[i].total_point < prevTotal) {
        currentRank = i + 1;
        prevTotal = gamePlayers[i].total_point;
      }
      gamePlayers[i].ranking = gamePlayers[i].total_point > 0 ? currentRank : 0;
    }

    // Fetch names for the records
    const ids = gamePlayers.map((p) => p.id);
    const nameRes = await fetch(`${url}/gamers_info?id=in.(${ids.join(',')})&select=id,name,ign,team,nationality`, { headers });
    const nameData = await nameRes.json();
    const nameMap = {};
    for (const n of nameData) nameMap[n.id] = n;

    const records = gamePlayers.map((p) => ({
      id: p.id,
      ranking: p.ranking,
      name: nameMap[p.id]?.name || '',
      ign: nameMap[p.id]?.ign || '',
      team: nameMap[p.id]?.team || '',
      nationality: nameMap[p.id]?.nationality || '',
      total_point: p.total_point,
      a_point: p.a_point,
      b_point: p.b_point,
      c_point: p.c_point,
      d_point: p.d_point,
    }));

    // Delete old data for this game and insert new
    console.log(`Syncing ${table} (${records.length} players)...`);
    await fetch(`${url}/${table}`, { method: 'DELETE', headers });
    for (let i = 0; i < records.length; i += 100) {
      const batch = records.slice(i, i + 100);
      const res = await fetch(`${url}/${table}`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify(batch),
      });
      if (!res.ok) console.error(`  Error: ${await res.text()}`);
    }

    // Push ranking back to gamers_info
    for (const p of gamePlayers) {
      if (p.ranking > 0) {
        await fetch(`${url}/gamers_info?id=eq.${p.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ admin_power_ranking: p.ranking }),
        }).catch(() => {});
      }
    }
  }

  console.log('Done.');
  console.log('Done.');
}

main().catch((err) => { console.error(err); process.exit(1); });
