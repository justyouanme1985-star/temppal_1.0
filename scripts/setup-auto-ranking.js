#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAutoRanking() {
  try {
    console.log('🚀 Setting up automatic ranking system in Supabase...\n');
    
    // Read the SQL file
    const sqlPath = join(__dirname, '..', 'supabase', 'functions', 'update_rankings.sql');
    const sql = readFileSync(sqlPath, 'utf8');
    
    // Note: The Supabase JS client doesn't support running raw SQL directly
    // You'll need to run this SQL in the Supabase Dashboard SQL Editor
    
    console.log('📋 SQL script generated successfully!\n');
    console.log('To apply the automatic ranking system:\n');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the following SQL:');
    console.log('─'.repeat(60));
    console.log(sql);
    console.log('─'.repeat(60));
    console.log('\n4. Click "Run" to execute the SQL');
    console.log('\n✅ Once applied, rankings will automatically update when count_item_cumulative changes!');
    
    // Test current data
    console.log('\n📊 Current ranking data sample:');
    const { data, error } = await supabase
      .from('gamers_info')
      .select('name, count_items_cumulative, popularity_rank')
      .order('count_items_cumulative', { ascending: false, nullsFirst: false })
      .limit(5);
    
    if (error) {
      console.error('Error fetching sample data:', error);
    } else {
      console.table(data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupAutoRanking();