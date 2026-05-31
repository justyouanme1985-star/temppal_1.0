import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

async function applyWeightedRanking() {
  console.log('🎯 Applying Weighted Ranking System to Supabase...\n');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'functions', 'weighted_ranking_system.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📊 Weighted Point System:');
    console.log('  - A Point (count_player_recent): 5 points each');
    console.log('  - B Point (count_player_cumulative): 1 point each');
    console.log('  - C Point (count_items_recent): 2 points each');
    console.log('  - D Point (count_items_cumulative): 1 point each');
    console.log('  - 90-day automatic reset for recent counts\n');
    
    console.log('⚠️  This script requires admin access to execute DDL statements.');
    console.log('📝 Please run the following SQL in your Supabase SQL Editor:\n');
    console.log('----------------------------------------');
    console.log('-- Copy and paste this into Supabase SQL Editor --\n');
    console.log(sql);
    console.log('----------------------------------------\n');
    
    // Test current rankings
    console.log('📈 Current Top 10 Players (before weighted system):');
    const { data: before } = await supabase
      .from('gamers_info')
      .select('name, count_player_recent, count_player_cumulative, count_items_recent, count_items_cumulative, admin_power_ranking')
      .order('admin_power_ranking', { ascending: true })
      .limit(10);
    
    if (before) {
      before.forEach((player, idx) => {
        const totalPoints = 
          (player.count_player_recent || 0) * 5 +
          (player.count_player_cumulative || 0) * 1 +
          (player.count_items_recent || 0) * 2 +
          (player.count_items_cumulative || 0) * 1;
        
        console.log(`  ${idx + 1}. ${player.name}`);
        console.log(`     Current Rank: ${player.admin_power_ranking}`);
        console.log(`     Counts: Recent(${player.count_player_recent || 0}/${player.count_items_recent || 0}), Total(${player.count_player_cumulative || 0}/${player.count_items_cumulative || 0})`);
        console.log(`     Calculated Points: ${totalPoints} (A:${(player.count_player_recent || 0) * 5} + B:${player.count_player_cumulative || 0} + C:${(player.count_items_recent || 0) * 2} + D:${player.count_items_cumulative || 0})`);
      });
    }
    
    console.log('\n✅ After running the SQL script:');
    console.log('   1. Point columns (apoint, bpoint, cpoint, dpoint) will be added');
    console.log('   2. Total weighted points will be calculated automatically');
    console.log('   3. Rankings will update automatically when counts change');
    console.log('   4. Recent counts will reset after 90 days');
    console.log('\n🎮 The admin_power_ranking will now reflect the weighted scoring system!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

applyWeightedRanking();