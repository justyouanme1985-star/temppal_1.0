/**
 * Upsert equipment_info table from CSV
 *
 * Prerequisite: Run scripts/create_equipment_table.sql in Supabase SQL Editor first.
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY='...' node scripts/upsert_equipment.mjs
 */

import { createClient } from '@supabase/supabase-js';
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
  } catch { /* ignore */ }
}
loadEnv(resolve(__dirname, '..', '.env.local'));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── CSV Parser (same as upsert_gamers.mjs) ──────────────────────────────────
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      currentRow.push(current);
      current = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      currentRow.push(current);
      current = '';
      if (currentRow.length > 0 && currentRow.some((f) => f !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      if (ch === '\r' && next === '\n') i++;
    } else {
      current += ch;
    }
  }
  if (current !== '' || currentRow.length > 0) {
    currentRow.push(current);
    if (currentRow.some((f) => f !== '')) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return { headers: [], dataRows: [] };
  return { headers: rows[0], dataRows: rows.slice(1) };
}

function buildRecords(headers, dataRows) {
  // CSV column → DB column mapping (CSV uses mixed case, DB uses lowercase)
  const COLUMN_MAP = {
    'key': 'key',
    'RGB': 'rgb',
    'maXAccel': 'maxaccel',
    'maXSpeed': 'maxspeed',
    'switchType': 'switchtype',
    'freqResponse': 'freqresponse',
    'panelType': 'paneltype',
    'refreshRate': 'refreshrate',
    'officialUrl': 'officialurl',
    'coupangUrl': 'coupangurl',
    'alternative-shoppingurl': 'alternativeshoppingurl',
  };

  // CSV headers that already match DB column names (all lowercase) are used as-is:
  // id, updated, category, brand, model, availability, size, weight,
  // connection, buttons, sensor, dpi, layout, driver, impedance,
  // sensitivity, resolution, material, features

  // Fields that should be integers
  const INTEGER_FIELDS = new Set(['count_items_recent', 'count_items_cumulative']);

  const records = [];

  for (const row of dataRows) {
    const record = {};
    for (let i = 0; i < headers.length && i < row.length; i++) {
      const csvCol = headers[i].trim();
      const dbCol = COLUMN_MAP[csvCol] || csvCol;
      let val = row[i].trim();

      // Remove surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      val = val.replace(/""/g, '"');

      // Convert integers
      if (INTEGER_FIELDS.has(dbCol)) {
        record[dbCol] = parseInt(val, 10) || 0;
        continue;
      }

      // Empty → null
      if (val === '') {
        record[dbCol] = null;
        continue;
      }

      record[dbCol] = val;
    }
    records.push(record);
  }

  return records;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const csvPath = resolve(__dirname, 'equipment_data.csv');
  const text = readFileSync(csvPath, 'utf-8');

  const { headers, dataRows } = parseCSV(text);
  console.log(`Parsed ${headers.length} columns, ${dataRows.length} data rows.`);

  const records = buildRecords(headers, dataRows);

  // Upsert in batches of 100
  const BATCH = 100;
  let totalUpserted = 0;

  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    console.log(`Upserting batch ${Math.floor(i / BATCH) + 1} (rows ${i + 1}–${i + batch.length})...`);

    const { data, error } = await supabase
      .from('equipment_info')
      .upsert(batch, { onConflict: 'id', ignoreDuplicates: false });

    if (error) {
      console.error('Batch error:', error.message);
      console.error('First record:', JSON.stringify(batch[0], null, 2));
    } else {
      totalUpserted += batch.length;
      console.log(`  ✓ ${batch.length} upserted`);
    }
  }

  console.log(`\nDone. ${totalUpserted} / ${records.length} records processed.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
