/**
 * Upsert admin_power_ranking table from CSV files
 *
 * Usage: node scripts/upsert_power_ranking.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ──────────────────────────────────────────────────────────
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
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
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

// ── Parse CSV ────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      currentRow.push(current);
      current = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      currentRow.push(current);
      current = '';
      if (currentRow.length > 0 && currentRow.some((f) => f !== '')) rows.push(currentRow);
      currentRow = [];
      if (ch === '\r' && next === '\n') i++;
    } else {
      current += ch;
    }
  }
  if (current !== '' || currentRow.length > 0) {
    currentRow.push(current);
    if (currentRow.some((f) => f !== '')) rows.push(currentRow);
  }
  if (rows.length === 0) return { headers: [], dataRows: [] };
  return { headers: rows[0], dataRows: rows.slice(1) };
}

// ── Game mapping from filename ───────────────────────────────────────────────
const GAME_MAP = {
  'power_ranking_lol_rows.csv': 'lol',
  'power_ranking_valorant_rows.csv': 'valorant',
  'power_ranking_battlegrounds_rows.csv': 'battlegrounds',
  'power_ranking_starcraft_rows.csv': 'starcraft',
};

const CSV_FILES = Object.keys(GAME_MAP);

async function main() {
  let allRecords = [];

  for (const filename of CSV_FILES) {
    const game = GAME_MAP[filename];
    const csvPath = resolve(__dirname, filename);
    const text = readFileSync(csvPath, 'utf-8');
    const { headers, dataRows } = parseCSV(text);
    console.log(`${filename}: ${dataRows.length} rows`);

    for (const row of dataRows) {
      const record = {
        id: parseInt(row[1], 10) || 0,       // id
        ranking: parseInt(row[0], 10) || 0,   // ranking
        game: game,
        name: row[2] || '',
        ign: row[3] || '',
        team: row[4] || '',
        nationality: row[5] || '',
        total_point: parseInt(row[6], 10) || 0,
        a_point: parseInt(row[7], 10) || 0,
        b_point: parseInt(row[8], 10) || 0,
        c_point: parseInt(row[9], 10) || 0,
        d_point: parseInt(row[10], 10) || 0,
      };
      allRecords.push(record);
    }
  }

  console.log(`\nTotal records: ${allRecords.length}`);

  // Upsert in batches
  const BATCH = 100;
  let totalUpserted = 0;

  for (let i = 0; i < allRecords.length; i += BATCH) {
    const batch = allRecords.slice(i, i + BATCH);
    console.log(`Upserting batch ${Math.floor(i / BATCH) + 1} (${batch.length} rows)...`);

    const url = `${SUPABASE_URL}/rest/v1/admin_power_ranking`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=merge-duplicates',
    };
    const upsertUrl = `${url}?on_conflict=id`;

    const res = await fetch(upsertUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`Batch error: HTTP ${res.status}: ${text}`);
      console.error('First record:', JSON.stringify(batch[0]));
    } else {
      totalUpserted += batch.length;
      console.log(`  ✓ ${batch.length} upserted`);
    }
  }

  console.log(`\nDone. ${totalUpserted} / ${allRecords.length} records processed.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
