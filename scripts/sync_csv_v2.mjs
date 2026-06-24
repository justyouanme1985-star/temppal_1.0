/**
 * Sync all fields from CSV v2 to Supabase equipment_info.
 * Compares every field and updates where different.
 * Skips 101046 (duplicate of 101005).
 *
 * Usage: node scripts/sync_csv_v2.mjs [--execute]
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseServiceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim().replace(/^"|"$/g, '');
if (!supabaseUrl || !supabaseServiceKey) { console.error('Missing env vars'); process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const csvPath = '/Users/imac/Desktop/01_equipment_catalog_v2_2026-06-24.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const records = parse(csvContent, { columns: true, skip_empty_lines: true, relax_column_count: true });
const csvById = {};

// Fields to sync from CSV to DB (excluding id, updated, count columns, and ranking columns)
const syncFields = ['category','key','brand','model','availability','size','weight','connection',
  'buttons','sensor','dpi','maXAccel','maXSpeed','layout','switchType','RGB',
  'driver','freqResponse','impedance','sensitivity','resolution','panelType',
  'refreshRate','material','features','officialUrl','affiliate_url'];

for (const r of records) csvById[r.id] = r;

const shouldExecute = process.argv.includes('--execute');

const { data: dbRows } = await supabase.from('equipment_info').select('*');
const dbById = {};
for (const r of dbRows || []) dbById[r.id] = r;

const allIds = new Set([...Object.keys(csvById), ...Object.keys(dbById).map(String)]);
const toUpdate = [];

for (const idStr of allIds) {
  const csv = csvById[idStr];
  const db = dbById[idStr];

  // Skip 101046
  if (idStr === '101046') { console.log(`SKIP 101046 (duplicate)`); continue; }

  // New item? Insert
  if (csv && !db) {
    const cleaned = {};
    for (const [k, v] of Object.entries(csv)) {
      if (v === '' || v === undefined || v === null) cleaned[k] = null;
      else if (k === 'id') cleaned[k] = parseInt(String(v), 10);
      else cleaned[k] = v;
    }
    toUpdate.push({ id: parseInt(idStr), insert: true, data: cleaned });
    continue;
  }

  // Existing item — check each field
  if (csv && db) {
    const changes = {};
    for (const k of syncFields) {
      const csvVal = (csv[k] || '').trim();
      const dbVal = (db[k] || '').trim();
      if (csvVal !== dbVal) changes[k] = csvVal === '' ? null : csvVal;
    }
    if (Object.keys(changes).length > 0) {
      toUpdate.push({ id: parseInt(idStr), insert: false, data: changes, fields: Object.keys(changes) });
    }
  }
}

console.log(`CSV v2: ${records.length} | DB: ${dbRows?.length || 0}`);
console.log(`To update/insert: ${toUpdate.length}`);

if (!shouldExecute) {
  console.log('\n=== DRY RUN — changes preview ===');
  for (const item of toUpdate) {
    if (item.insert) {
      console.log(`  INSERT [${item.id}] ${item.data.category} | ${item.data.key}`);
    } else {
      const csv = csvById[String(item.id)];
      console.log(`  UPDATE [${item.id}] ${csv?.key || item.id} — ${item.fields.length} fields`);
    }
  }
  console.log('\nPass --execute to apply');
  process.exit(0);
}

// Apply
console.log('\n=== APPLYING ===');
let ok = 0, fail = 0;
for (const item of toUpdate) {
  if (item.insert) {
    const { error } = await supabase.from('equipment_info').insert([item.data]);
    if (error) { console.error(`  FAIL INSERT [${item.id}]: ${error.message}`); fail++; }
    else { console.log(`  OK INSERT [${item.id}]`); ok++; }
  } else {
    const { error } = await supabase.from('equipment_info').update(item.data).eq('id', item.id);
    if (error) { console.error(`  FAIL UPDATE [${item.id}]: ${error.message}`); fail++; }
    else { ok++; }
  }
}

console.log(`\n✅ Done: ${ok} OK, ${fail} FAIL`);
