/**
 * Rename equipment images to {id}_{model}.webp and update equipmentImages map.
 * Usage: node scripts/rename_equipment_images.mjs
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env
const envPath = path.resolve(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseKey = envContent.match(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)/)?.[1]?.trim();
if (!supabaseUrl || !supabaseKey) { console.error('Missing Supabase env vars'); process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);
const imageDir = path.resolve(__dirname, '..', 'public', 'images', 'equipments');
const dataPath = path.resolve(__dirname, '..', 'lib', 'equipmentData.ts');
const content = fs.readFileSync(dataPath, 'utf-8');

// Parse existing equipmentImages map
const ms = content.indexOf('export const equipmentImages: Record<string, string> = {');
const me = content.lastIndexOf('};');
const existing = {};
for (const line of content.substring(ms, me + 2).split('\n')) {
  const m = line.match(/\s*"(.+?)":\s*"(.+?)",?\s*/);
  if (m) existing[m[1]] = m[2];
}
console.log(`Map entries: ${Object.keys(existing).length}`);

// Fetch Supabase data
const { data: rows } = await supabase.from('equipment_info').select('id, key, model, category');
if (!rows) { console.error('Supabase query failed'); process.exit(1); }
console.log(`Supabase rows: ${rows.length}`);

// Build lookups
const byKey = {};
const byLower = {};
for (const r of rows) {
  byKey[r.key] = r;
  byLower[r.key.toLowerCase()] = r;
}
function findRow(mapKey) {
  if (byKey[mapKey]) return byKey[mapKey];
  if (byLower[mapKey.toLowerCase()]) return byLower[mapKey.toLowerCase()];
  const norm = mapKey.replace(/[-_\s]+/g, ' ').toLowerCase().trim();
  for (const [k, v] of Object.entries(byKey)) {
    const nk = k.replace(/[-_\s]+/g, ' ').toLowerCase().trim();
    if (norm === nk || norm.includes(nk) || nk.includes(norm)) return v;
  }
  return null;
}

// Group map entries by source filename (handle duplicates)
const groups = {};
for (const [mk, op] of Object.entries(existing)) {
  if (!op) continue;
  const fn = path.basename(op);
  if (!groups[fn]) groups[fn] = { keys: [], row: null, newFn: null };
  groups[fn].keys.push(mk);
}

// Find Supabase match per unique file
for (const [fn, g] of Object.entries(groups)) {
  for (const mk of g.keys) { g.row = findRow(mk); if (g.row) break; }
  if (!g.row) { console.warn(`No Supabase match for file "${fn}"`); continue; }
  const model = g.row.model.replace(/[\/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_');
  g.newFn = `${g.row.id}_${model}.webp`;
}

// Rename files
console.log('\nRenaming files:');
for (const [fn, g] of Object.entries(groups)) {
  if (!g.newFn || fn === g.newFn) continue;
  const oldPath = path.join(imageDir, fn);
  const newPath = path.join(imageDir, g.newFn);
  if (!fs.existsSync(oldPath)) { console.warn(`  MISSING: ${fn}`); continue; }
  if (fs.existsSync(newPath)) {
    console.log(`  DUPLICATE TARGET, deleting source: ${fn} → ${g.newFn}`);
    fs.unlinkSync(oldPath);
  } else {
    console.log(`  ${fn} → ${g.newFn}`);
    fs.renameSync(oldPath, newPath);
  }
}

// Build new map
const newMap = {};
for (const [mk, op] of Object.entries(existing)) {
  if (!op) { newMap[mk] = op; continue; }
  const g = groups[path.basename(op)];
  newMap[mk] = g?.newFn ? `/images/equipments/${g.newFn}` : op;
}

// Report unmapped
const allFiles = fs.readdirSync(imageDir);
const mapped = new Set(Object.values(newMap).filter(Boolean).map(p => path.basename(p)));
const unmapped = allFiles.filter(f => !mapped.has(f) && f.endsWith('.webp'));
if (unmapped.length) {
  console.log(`\nUnmapped files (${unmapped.length}):`);
  unmapped.forEach(f => console.log(`  ${f}`));
}

// Write back
const before = content.substring(0, ms);
const after = content.substring(me + 2);
let mapStr = 'export const equipmentImages: Record<string, string> = {\n';
for (const [k, v] of Object.entries(newMap)) mapStr += `  "${k}": "${v}",\n`;
mapStr += '};\n';
fs.writeFileSync(dataPath, before + mapStr + after, 'utf-8');

console.log(`\nDone. ${Object.keys(groups).filter(f => groups[f].newFn && f !== groups[f].newFn).length} files renamed.`);
