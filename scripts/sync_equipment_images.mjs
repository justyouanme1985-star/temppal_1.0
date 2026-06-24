/**
 * Sync equipment images from the /public/images/equipments directory
 * into lib/equipmentData.ts based on ID-prefixed filenames.
 *
 * Usage: node scripts/sync_equipment_images.mjs
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── 1. Load env ──
const envPath = path.resolve(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseServiceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim().replace(/^"|"$/g, '');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ── 2. Parse CSV for id→key mapping ──
const csvPath = '/Users/imac/Desktop/01_equipment_catalog_with_links_2026-06-24.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const records = parse(csvContent, { columns: true, skip_empty_lines: true, relax_column_count: true });
const csvById = {};
for (const r of records) csvById[r.id] = r;

// ── 3. Read image directory ──
const imageDir = path.resolve(__dirname, '..', 'public', 'images', 'equipments');
const allFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.webp'));
console.log(`Total image files: ${allFiles.length}`);

// ── 4. Build mapping by ID ──
const idFileMap = {};
for (const f of allFiles) {
  const match = f.match(/^(\d+)_/);
  if (match) {
    const id = parseInt(match[1]);
    if (!idFileMap[id]) idFileMap[id] = [];
    idFileMap[id].push(f);
  }
}

// ── 5. Fetch Supabase equipment ──
const { data: equip } = await supabase.from('equipment_info').select('id, key, category');
const equipById = {};
for (const e of equip || []) equipById[e.id] = e;

// ── 6. Build new entries ──
const newEntries = {};
let matched = 0;
let skipped = 0;
for (const [idStr, files] of Object.entries(idFileMap)) {
  const id = parseInt(idStr);
  const csvRow = csvById[idStr];
  const eq = equipById[id];

  // Use the CSV key if available, otherwise DB key
  const key = csvRow?.key || eq?.key;
  if (!key) { skipped++; continue; }

  newEntries[key] = '/images/equipments/' + files[0];
  matched++;
}

console.log(`ID-based matches: ${matched}, skipped (no key): ${skipped}`);

// ── 7. Update equipmentData.ts ──
const dataPath = path.resolve(__dirname, '..', 'lib', 'equipmentData.ts');
let content = fs.readFileSync(dataPath, 'utf-8');

const start = content.indexOf('export const equipmentImages: Record<string, string> = {');
const end = content.indexOf('};', start);
if (start === -1 || end === -1) {
  console.error('❌ Could not find equipmentImages in equipmentData.ts');
  process.exit(1);
}

// Parse existing entries
const existingBlock = content.substring(start, end + 2);
const existingEntries = {};
for (const line of existingBlock.split('\n')) {
  const m = line.match(/\s*"(.+?)":\s*"(.+?)",?\s*/);
  if (m) existingEntries[m[1]] = m[2];
}

// Merge: keep existing, add new ones
let addedCount = 0;
let updatedCount = 0;
for (const [key, img] of Object.entries(newEntries)) {
  if (!existingEntries[key]) {
    existingEntries[key] = img;
    addedCount++;
  } else if (existingEntries[key] !== img) {
    // Update if better image exists (prefer ID-based filenames)
    const oldIsIdBased = existingEntries[key].match(/\d+_/);
    const newIsIdBased = img.match(/\d+_/);
    if (newIsIdBased && !oldIsIdBased) {
      existingEntries[key] = img;
      updatedCount++;
    }
  }
}

// Rebuild sorted
let mapStr = 'export const equipmentImages: Record<string, string> = {\n';
const sortedKeys = Object.keys(existingEntries).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
for (const k of sortedKeys) {
  mapStr += `  "${k}": "${existingEntries[k]}",\n`;
}
mapStr += '};\n';

const before = content.substring(0, start);
const after = content.substring(end + 2);
fs.writeFileSync(dataPath, before + mapStr + after, 'utf-8');

console.log(`\n📊 Results:`);
console.log(`  Existing entries kept: ${Object.keys(existingEntries).length - addedCount - updatedCount}`);
console.log(`  New entries added: ${addedCount}`);
console.log(`  Entries updated: ${updatedCount}`);
console.log(`  Total: ${Object.keys(existingEntries).length}`);
console.log('\n✅ Done!');
