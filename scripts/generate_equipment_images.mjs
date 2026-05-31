// Run: node scripts/generate_equipment_images.mjs
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const text = readFileSync(resolve(__dirname, '..', 'lib', 'equipmentData.ts'), 'utf-8');

function extractAll() {
  const dbs = ['mouseDb', 'keyboardDb', 'headsetDb', 'monitorDb', 'mousepadDb', 'chairDb', 'deskDb'];
  const result = {};
  for (const db of dbs) {
    const re = new RegExp('export const ' + db + ': Record<string, [^>]+> = \\{(.+?)\\};', 's');
    const section = text.match(re);
    const body = section?.[1] || '';
    const entryRegex = /"([^"]+)"\s*:\s*\{([^}]+)\}/g;
    let match;
    while ((match = entryRegex.exec(body)) !== null) {
      const imgMatch = match[2].match(/image\s*:\s*"([^"]+)"/);
      if (imgMatch) result[match[1]] = imgMatch[1];
    }
  }
  return result;
}

const oldMap = extractAll();

const envText = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf-8');
const url = envText.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const key = envText.match(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)/)?.[1]?.trim();
const supabase = createClient(url, key);

const { data: equip } = await supabase.from('equipment_info').select('key');

let matched = 0;
let unmatched = 0;
let output = '// Auto-generated equipment image mappings\n';
output += 'export const equipmentImages: Record<string, string> = {\n';
for (const e of equip) {
  const sk = e.key;
  let img = oldMap[sk] || '';
  if (!img) {
    const found = Object.keys(oldMap).find(k => k.toLowerCase() === sk.toLowerCase());
    if (found) img = oldMap[found];
  }
  if (img) matched++;
  else unmatched++;
  const escapedKey = sk.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  output += '  "' + escapedKey + '": "' + img + '",\n';
}
output += '};\n';

writeFileSync(resolve(__dirname, '..', 'scripts', 'equipment_images_map.txt'), output, 'utf-8');
console.log('Matched:', matched, 'Unmatched:', unmatched);
console.log('Written to scripts/equipment_images_map.txt');
