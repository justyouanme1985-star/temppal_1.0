import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

async function verify() {
  // Get Pyosik's current data
  const { data: p } = await supabase
    .from('gamers_info')
    .select('name, ign, count_player_recent, count_player_cumulative, count_items_recent, count_items_cumulative, admin_power_ranking')
    .eq('name', '홍창현')
    .single();

  console.log('현재 데이터 (Current data):');
  console.log(`  최근 방문(PR): ${p.count_player_recent}`);
  console.log(`  누적 방문(PC): ${p.count_player_cumulative}`);
  console.log(`  최근 장비(IR): ${p.count_items_recent}`);
  console.log(`  누적 장비(IC): ${p.count_items_cumulative}`);
  console.log(`  현재 랭킹: ${p.admin_power_ranking}`);

  console.log('\n✅ 예상 동작 (Expected behavior after SQL is applied):');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('관리자가 최근 방문(PR)을 1로 설정하면:');
  console.log('  → 누적 방문(PC)이 자동으로 1 증가');
  console.log('  → apoint = PR × 5');
  console.log('  → bpoint = PC × 1');
  console.log('  → total_weighted_points 재계산');
  console.log('  → admin_power_ranking 자동 갱신');
  
  console.log('\n관리자가 최근 장비(IR)를 3으로 설정하면:');
  console.log('  → 누적 장비(IC)가 자동으로 3 증가');
  console.log('  → cpoint = IR × 2');
  console.log('  → dpoint = IC × 1 (절대 × 100 아님!)');
  console.log('  → total_weighted_points 재계산');
  console.log('  → admin_power_ranking 자동 갱신');
  
  console.log('\n90일 후 (reset_old_recent_counts() 실행):');
  console.log('  → PR과 IR만 0으로 리셋');
  console.log('  → PC와 IC는 영구 보존');

  console.log('\n📊 점수 계산 예시:');
  const scenario = { pr: 3, pc: p.count_player_cumulative + 3, ir: 1, ic: p.count_items_cumulative + 1 };
  const points = {
    a: scenario.pr * 5,
    b: scenario.pc * 1,
    c: scenario.ir * 2,
    d: scenario.ic * 1
  };
  console.log(`  PR=${scenario.pr}, PC=${scenario.pc}, IR=${scenario.ir}, IC=${scenario.ic}`);
  console.log(`  A=${points.a} + B=${points.b} + C=${points.c} + D=${points.d} = 합계 ${points.a + points.b + points.c + points.d}`);
}

verify();
