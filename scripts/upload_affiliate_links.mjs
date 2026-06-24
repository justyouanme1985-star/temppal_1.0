/**
 * Upload affiliate_url from the latest CSV to Supabase equipment_info.
 * Also fixes brand names: Lethal → Pulsar, Pulsa → Pulsar
 *
 * First run the SQL migration:
 *   node scripts/upload_affiliate_links.mjs --migrate
 *
 * Then run the data upload:
 *   node scripts/upload_affiliate_links.mjs --execute
 *
 * Or do both:
 *   node scripts/upload_affiliate_links.mjs --migrate --execute
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase env vars in .env.local');
  process.exit(1);
}

const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1];
console.log(`Project ref: ${projectRef}`);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ── 2. Parse CSV ──
const csvPath = '/Users/imac/Desktop/01_equipment_catalog_with_links_2026-06-24.csv';
if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV not found at: ${csvPath}`);
  process.exit(1);
}
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const records = parse(csvContent, { columns: true, skip_empty_lines: true, relax_column_count: true });
console.log(`\n📄 CSV records: ${records.length}`);

// Build lookup by id
const csvById = {};
for (const r of records) csvById[r.id] = r;

// ── 3. Check flags ──
const shouldMigrate = process.argv.includes('--migrate');
const shouldExecute = process.argv.includes('--execute');

if (!shouldMigrate && !shouldExecute) {
  console.log('\n=== DRY RUN ===');
  console.log('Available flags:');
  console.log('  --migrate    Add affiliate_url column and fix brand names');
  console.log('  --execute    Upload affiliate URLs and fix brand names');
  console.log('  (both)       Do both steps');
  process.exit(0);
}

// ── 4. Verify column exists ──
async function checkColumn() {
  const { error } = await supabase.from('equipment_info')
    .update({ affiliate_url: '__test__' })
    .eq('id', -1);
  if (error && error.message?.includes('Could not find the')) {
    return false;
  }
  // Clean up test value if it somehow worked
  await supabase.from('equipment_info')
    .update({ affiliate_url: null })
    .eq('affiliate_url', '__test__');
  return true;
}

async function addColumn() {
  console.log('\n🔧 Attempting to add affiliate_url column...');

  // Try direct SQL via pg (need to find working connection)
  const { Pool } = await import('pg');

  // Try known Supabase connection patterns
  const attempts = [
    {
      label: 'Session pooler (port 5432)',
      config: {
        connectionString: `postgresql://postgres.${projectRef}:postgres@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres`,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
      }
    },
    {
      label: 'Transaction pooler (port 6543)',
      config: {
        connectionString: `postgresql://postgres.${projectRef}:postgres@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres`,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
      }
    },
  ];

  for (const attempt of attempts) {
    const pool = new Pool(attempt.config);
    try {
      const sql = `
        ALTER TABLE public.equipment_info ADD COLUMN IF NOT EXISTS affiliate_url TEXT;
        UPDATE public.equipment_info SET brand = 'Pulsar' WHERE brand IN ('Lethal', 'Pulsa');
      `;
      await pool.query(sql);
      console.log(`  ✅ Column added via ${attempt.label}`);
      await pool.end();
      return true;
    } catch (err) {
      console.log(`  ❌ ${attempt.label}: ${err.message.substring(0, 100)}`);
      await pool.end().catch(() => {});
    }
  }

  console.log('\n⚠️  Could not connect to database directly.');
  console.log('   Please run this SQL in Supabase Dashboard → SQL Editor:');
  console.log('\n   ' + '─'.repeat(50));
  console.log('   ALTER TABLE public.equipment_info');
  console.log('   ADD COLUMN IF NOT EXISTS affiliate_url TEXT;');
  console.log('');
  console.log('   UPDATE public.equipment_info SET brand = \'Pulsar\'');
  console.log("   WHERE brand IN ('Lethal', 'Pulsa');");
  console.log('   ' + '─'.repeat(50));
  return false;
}

// ── 5. Upload affiliate URLs ──
async function uploadAffiliateUrls() {
  console.log('\n📤 Uploading affiliate_url values...');

  const { data: dbRows } = await supabase.from('equipment_info').select('id, key, affiliate_url');
  if (!dbRows) {
    console.log('  ⚠️  Could not fetch existing rows');
    return;
  }
  console.log(`  Fetched ${dbRows.length} existing rows`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const dbRow of dbRows) {
    const csvRow = csvById[String(dbRow.id)];
    if (!csvRow) {
      skipped++;
      continue;
    }

    const url = csvRow.affiliate_url?.trim() || null;

    // Skip if already set
    if (dbRow.affiliate_url === url) {
      skipped++;
      continue;
    }

    // Skip rows without URL
    if (!url) {
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('equipment_info')
      .update({ affiliate_url: url })
      .eq('id', dbRow.id);

    if (error) {
      console.error(`  ❌ ID ${dbRow.id} (${dbRow.key}): ${error.message}`);
      errors++;
    } else {
      updated++;
      if (updated <= 5 || updated % 20 === 0) {
        console.log(`  ✅ ID ${dbRow.id} → affiliate_url updated`);
      }
    }
  }

  console.log(`\n📊 Results: ${updated} updated, ${skipped} skipped, ${errors} errors`);
}

// ── 6. Fix brand names via JS (fallback if SQL didn't run) ──
async function fixBrandNames() {
  console.log('\n🏷️  Fixing brand names...');

  const fixes = [
    { from: 'Lethal', to: 'Pulsar' },
    { from: 'Pulsa', to: 'Pulsar' },
  ];

  for (const fix of fixes) {
    const { data, error } = await supabase
      .from('equipment_info')
      .select('id, key, brand')
      .eq('brand', fix.from);

    if (error) {
      console.error(`  ❌ Error querying brand="${fix.from}": ${error.message}`);
      continue;
    }

    if (!data || data.length === 0) {
      console.log(`  ✅ Brand "${fix.from}" → already fixed or not found`);
      continue;
    }

    console.log(`  Found ${data.length} rows with brand="${fix.from}":`);
    for (const row of data) {
      console.log(`    - ID ${row.id}: ${row.key}`);
    }

    const { error: updateErr } = await supabase
      .from('equipment_info')
      .update({ brand: fix.to })
      .eq('brand', fix.from);

    if (updateErr) {
      console.error(`  ❌ Update failed: ${updateErr.message}`);
    } else {
      console.log(`  ✅ Brand "${fix.from}" → "${fix.to}" (${data.length} rows)`);
    }
  }
}

// ── Main ──
async function main() {
  console.log('╔' + '═'.repeat(48) + '╗');
  console.log('║  Affiliate Link Upload & Brand Fix Tool        ║');
  console.log('╚' + '═'.repeat(48) + '╝');

  if (shouldMigrate) {
    const columnExists = await checkColumn();
    if (columnExists) {
      console.log('\n✅ affiliate_url column already exists');
    } else {
      await addColumn();
    }
  }

  if (shouldExecute) {
    // Wait a moment for schema cache to refresh if we just added the column
    if (shouldMigrate) {
      console.log('\n⏳ Waiting 2s for schema cache refresh...');
      await new Promise(r => setTimeout(r, 2000));
    }

    await uploadAffiliateUrls();
    await fixBrandNames();
  }

  console.log('\n✅ Done!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
