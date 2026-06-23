/**
 * Sync Supabase equipment_info with the CSV catalog.
 * Usage: node scripts/sync_equipment_catalog.mjs [--execute]
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseAnonKey = envContent.match(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)/)?.[1]?.trim();
let supabaseServiceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();
if (supabaseServiceKey) supabaseServiceKey = supabaseServiceKey.replace(/^"|"$/g, '');
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) { console.error('Missing Supabase env vars'); process.exit(1); }

// Use service role key for inserts (bypasses RLS), anon key for reads/updates
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const imageDir = path.resolve(__dirname, '..', 'public', 'images', 'equipments');
const csvPath = '/Users/imac/Desktop/lilly data/06_equipment_master/01_equipment_catalog_2026-05-30_233805.csv';
const shouldExecute = process.argv.includes('--execute');

// ── 1. Parse CSV ──
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const records = parse(csvContent, { columns: true, skip_empty_lines: true, relax_column_count: true });
console.log(`CSV records: ${records.length}`);
const csvById = {};
for (const r of records) csvById[r.id] = r;

// ── 2. Fetch current Supabase equipment_info ──
const { data: dbRows } = await supabase.from('equipment_info').select('*');
console.log(`Supabase rows: ${dbRows.length}`);
const dbById = {};
for (const r of dbRows) dbById[r.id] = r;

// ── 3. Compare & build operations (skip 101046) ──
const allIds = new Set([...Object.keys(csvById), ...Object.keys(dbById).map(String)]);
const toInsert = [];
const toUpdate = [];

for (const idStr of allIds) {
  const csv = csvById[idStr];
  const db = dbById[idStr];
  if (idStr === '101046') { console.log(`SKIP 101046 (G Pro X SL 2)`); continue; }
  if (csv && !db) {
    // Clean empty values — set empty strings to null for Supabase
    const cleaned = {};
    for (const [k, v] of Object.entries(csv)) {
      if (v === '' || v === undefined || v === null) {
        cleaned[k] = null;
      } else if (k === 'id') {
        cleaned[k] = parseInt(String(v), 10);
      } else {
        cleaned[k] = v;
      }
    }
    toInsert.push(cleaned);
  }
  else if (csv && db) {
    const csvKeys = ['category','key','brand','model','availability','size','weight','connection',
      'buttons','sensor','dpi','maXAccel','maXSpeed','layout','switchType','RGB',
      'driver','freqResponse','impedance','sensitivity','resolution','panelType',
      'refreshRate','material','features','officialUrl'];
    let changed = false;
    for (const k of csvKeys) { if ((csv[k]||'').trim() !== (db[k]||'').trim()) { changed = true; break; } }
    if (changed) toUpdate.push(csv);
  }
}
console.log(`\nTo insert: ${toInsert.length}\nTo update: ${toUpdate.length}`);

// ── 4. Update 4 players' mouse ──
const { data: players } = await supabase.from('gamers_info').select('id, name, ign, mouse').in('id', [102030, 102028, 102023, 102026]);
console.log(`\n=== Players to fix (G Pro X SL 2 → Logitech G PRO X SUPERLIGHT 2) ===`);
for (const p of players || []) console.log(`  ${p.name} (${p.ign}) — mouse: "${p.mouse}"`);

if (!shouldExecute) { console.log('\n=== DRY RUN — re-run with --execute to apply ==='); process.exit(0); }

// 5a. Insert (using service role key to bypass RLS)
console.log('\n=== INSERTING ===');
for (const r of toInsert) {
  const { error } = await supabaseAdmin.from('equipment_info').insert([r]);
  if (error) console.error(`  FAIL ${r.id}: ${error.message}`); else console.log(`  OK ${r.id}`);
}

// 5b. Update
console.log('\n=== UPDATING ===');
for (const r of toUpdate) {
  const { error } = await supabase.from('equipment_info').update(r).eq('id', r.id);
  if (error) console.error(`  FAIL ${r.id}: ${error.message}`); else console.log(`  OK ${r.id}`);
}

// 5c. Fix players
console.log('\n=== FIXING PLAYER MOUSE ===');
for (const p of players || []) {
  const { error } = await supabase.from('gamers_info').update({ mouse: 'Logitech G PRO X SUPERLIGHT 2' }).eq('id', p.id);
  if (error) console.error(`  FAIL ${p.name}: ${error.message}`); else console.log(`  OK ${p.name} (${p.ign})`);
}

// 5d. Update equipmentImages
console.log('\n=== UPDATING equipmentImages ===');
const dataPath = path.resolve(__dirname, '..', 'lib', 'equipmentData.ts');
let content = fs.readFileSync(dataPath, 'utf-8');
const ms = content.indexOf('export const equipmentImages: Record<string, string> = {');
const me = content.lastIndexOf('};');
const before = content.substring(0, ms);
const after = content.substring(me + 2);
const existingMap = {};
for (const line of content.substring(ms, me + 2).split('\n')) {
  const m = line.match(/\s*"(.+?)":\s*"(.+?)",?\s*/);
  if (m) existingMap[m[1]] = m[2];
}
const allFiles = fs.readdirSync(imageDir);
let added = 0;
for (const [idStr, csvRec] of Object.entries(csvById)) {
  const imgFile = allFiles.find(f => f.startsWith(`${idStr}_`) && f.endsWith('.webp'));
  if (imgFile && !existingMap[csvRec.key]) { existingMap[csvRec.key] = `/images/equipments/${imgFile}`; added++; console.log(`  ADD: "${csvRec.key}"`); }
}
let mapStr = 'export const equipmentImages: Record<string, string> = {\n';
for (const [k, v] of Object.entries(existingMap)) mapStr += `  "${k}": "${v}",\n`;
mapStr += '};\n';
fs.writeFileSync(dataPath, before + mapStr + after, 'utf-8');
console.log(`Added ${added} new image entries`);

console.log('\n=== DONE ===');
