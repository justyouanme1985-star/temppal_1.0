import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

async function testRankingCalculation() {
  console.log('🧪 Testing Weighted Ranking Calculation\n');
  console.log('Formula:');
  console.log('  A Point = count_player_recent × 5');
  console.log('  B Point = count_player_cumulative × 1');
  console.log('  C Point = count_items_recent × 2');
  console.log('  D Point = count_items_cumulative × 1 (NOT 100!)\n');
  
  // Get Pyosik's data
  const { data: players } = await supabase
    .from('gamers_info')
    .select('*')
    .or('name.eq.홍창현,ign.ilike.%pyosik%')
    .limit(1);
  
  if (players && players[0]) {
    const p = players[0];
    console.log('📊 홍창현 (Pyosik) Current Data:');
    console.log(`  count_player_recent: ${p.count_player_recent || 0}`);
    console.log(`  count_player_cumulative: ${p.count_player_cumulative || 0}`);
    console.log(`  count_items_recent: ${p.count_items_recent || 0}`);
    console.log(`  count_items_cumulative: ${p.count_items_cumulative || 0}`);
    console.log(`  admin_power_ranking: ${p.admin_power_ranking}\n`);
    
    // Calculate expected values
    const expected = {
      apoint: (p.count_player_recent || 0) * 5,
      bpoint: (p.count_player_cumulative || 0) * 1,
      cpoint: (p.count_items_recent || 0) * 2,
      dpoint: (p.count_items_cumulative || 0) * 1,  // NOT * 100!
    };
    expected.total = expected.apoint + expected.bpoint + expected.cpoint + expected.dpoint;
    
    console.log('✅ Expected Point Calculation:');
    console.log(`  A Point: ${p.count_player_recent || 0} × 5 = ${expected.apoint}`);
    console.log(`  B Point: ${p.count_player_cumulative || 0} × 1 = ${expected.bpoint}`);
    console.log(`  C Point: ${p.count_items_recent || 0} × 2 = ${expected.cpoint}`);
    console.log(`  D Point: ${p.count_items_cumulative || 0} × 1 = ${expected.dpoint} (NOT ${(p.count_items_cumulative || 0) * 100}!)`);
    console.log(`  Total: ${expected.total}\n`);
    
    // Check if point columns exist
    if ('apoint' in p) {
      console.log('🔍 Actual Values in Database:');
      console.log(`  apoint: ${p.apoint} ${p.apoint === expected.apoint ? '✓' : `✗ (should be ${expected.apoint})`}`);
      console.log(`  bpoint: ${p.bpoint} ${p.bpoint === expected.bpoint ? '✓' : `✗ (should be ${expected.bpoint})`}`);
      console.log(`  cpoint: ${p.cpoint} ${p.cpoint === expected.cpoint ? '✓' : `✗ (should be ${expected.cpoint})`}`);
      console.log(`  dpoint: ${p.dpoint} ${p.dpoint === expected.dpoint ? '✓' : `✗ (should be ${expected.dpoint})`}`);
      console.log(`  total_weighted_points: ${p.total_weighted_points} ${p.total_weighted_points === expected.total ? '✓' : `✗ (should be ${expected.total})`}`);
      
      if (p.dpoint === 100 && p.count_items_cumulative === 1) {
        console.log('\n❌ ERROR DETECTED: dpoint is 100 but count_items_cumulative is 1!');
        console.log('   This needs to be fixed in the database.');
      }
    } else {
      console.log('⚠️  Point columns not yet created. Run the SQL script first.');
    }
  }
  
  // Test with various scenarios
  console.log('\n📝 Test Scenarios:');
  const testCases = [
    { player_r: 0, player_c: 80, items_r: 0, items_c: 1 },
    { player_r: 1, player_c: 100, items_r: 1, items_c: 5 },
    { player_r: 10, player_c: 500, items_r: 5, items_c: 20 },
  ];
  
  testCases.forEach((tc, i) => {
    const points = {
      a: tc.player_r * 5,
      b: tc.player_c * 1,
      c: tc.items_r * 2,
      d: tc.items_c * 1,  // NOT * 100!
    };
    const total = points.a + points.b + points.c + points.d;
    
    console.log(`\nScenario ${i + 1}:`);
    console.log(`  Input: PR=${tc.player_r}, PC=${tc.player_c}, IR=${tc.items_r}, IC=${tc.items_c}`);
    console.log(`  Points: A=${points.a}, B=${points.b}, C=${points.c}, D=${points.d}`);
    console.log(`  Total: ${total}`);
  });
  
  console.log('\n🎯 Summary:');
  console.log('  The ranking should automatically update when any count changes.');
  console.log('  Flow: gamers_info counts → calculate points → update admin_power_ranking');
  console.log('  D Point MUST be count_items_cumulative × 1 (not × 100)');
}

testRankingCalculation();