import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { LucideIcon } from 'lucide-react';
import {
  Mouse, Keyboard, Headphones, Monitor,
  RectangleHorizontal, ArmchairIcon, MonitorIcon,
} from 'lucide-react';
import { teamLogos, type Player, type Equipment } from './playerData';
import { equipmentImages } from './equipmentData';

// ── Hardcoded player image overrides (same as playerData.ts) ─────────────
const ASSETS_PATH = '/images/';

const GAME_FOLDER_MAP: Record<string, string> = {
  lol: 'lol',
  valorant: 'valorant',
  battlegrounds: 'pubg',
  starcraft: 'starcraft',
};

function buildPlayerImagePath(id: number | string, ign: string, game: string): string {
  const folder = GAME_FOLDER_MAP[game] || 'lol';
  return `${ASSETS_PATH}players/${folder}/${id}-${ign}.webp`;
}

const DEFAULT_PLAYER_IMAGE = `${ASSETS_PATH}players/lol/no-picture.webp`;

// ── Equipment cache built from Supabase ──────────────────────────────────
type SupabaseEquipCache = Record<string, Record<string, { key: string }>>;

function buildEquipCache(rows: any[]): SupabaseEquipCache {
  const cache: SupabaseEquipCache = {};
  for (const row of rows || []) {
    const cat = row.category || 'other';
    if (!cache[cat]) cache[cat] = {};
    cache[cat][row.key] = row;
  }
  return cache;
}

function hasEquipmentImage(
  equipCache: SupabaseEquipCache,
  category: string,
  key: string,
): boolean {
  const catCache = equipCache[category];
  if (!catCache) return equipmentImages[key] !== undefined;

  const lowerKey = key.toLowerCase();
  for (const [dbKey] of Object.entries(catCache)) {
    if (dbKey.toLowerCase() === lowerKey) {
      if (equipmentImages[dbKey]) return true;
      break;
    }
  }

  // Substring match
  const normKey = key.replace(/[-_\s]+/g, ' ').toLowerCase().trim();
  for (const [dbKey] of Object.entries(catCache)) {
    const normDbKey = dbKey.replace(/[-_\s]+/g, ' ').toLowerCase().trim();
    if (normKey.includes(normDbKey) || normDbKey.includes(normKey)) {
      if (equipmentImages[dbKey]) return true;
      break;
    }
  }

  return equipmentImages[key] !== undefined;
}

function buildPlayerEquipment(
  equipCache: SupabaseEquipCache,
  player: any,
): Equipment[] {
  const equipment: Equipment[] = [];
  const ign = player.ign || '';

  if (player.mouse)
    equipment.push({ id: `${ign}-mouse`, equipmentType: '마우스', equipmentName: player.mouse, productImage: '', productUrl: '' });
  if (player.keyboard)
    equipment.push({ id: `${ign}-keyboard`, equipmentType: '키보드', equipmentName: player.keyboard, productImage: '', productUrl: '' });
  if (player.headset)
    equipment.push({ id: `${ign}-headset`, equipmentType: '헤드셋', equipmentName: player.headset, productImage: '', productUrl: '' });
  if (player.monitor)
    equipment.push({ id: `${ign}-monitor`, equipmentType: '모니터', equipmentName: player.monitor, productImage: '', productUrl: '' });
  if (player.mousepad)
    equipment.push({ id: `${ign}-mousepad`, equipmentType: '마우스패드', equipmentName: player.mousepad, productImage: '', productUrl: '' });
  if (player.chair)
    equipment.push({ id: `${ign}-chair`, equipmentType: '의자', equipmentName: player.chair, productImage: '', productUrl: '' });
  if (player.desk)
    equipment.push({ id: `${ign}-desk`, equipmentType: '책상', equipmentName: player.desk, productImage: '', productUrl: '' });

  return equipment;
}

function buildPlayerPreviousEquipment(
  equipCache: SupabaseEquipCache,
  player: any,
): Equipment[] {
  const equipment: Equipment[] = [];
  const ign = player.ign || '';

  if (player.previous_mouse)
    equipment.push({ id: `${ign}-prev-mouse`, equipmentType: '마우스', equipmentName: player.previous_mouse, productImage: '', productUrl: '' });
  if (player.previous_keyboard)
    equipment.push({ id: `${ign}-prev-keyboard`, equipmentType: '키보드', equipmentName: player.previous_keyboard, productImage: '', productUrl: '' });
  if (player.previous_mousepad)
    equipment.push({ id: `${ign}-prev-mousepad`, equipmentType: '마우스패드', equipmentName: player.previous_mousepad, productImage: '', productUrl: '' });

  return equipment;
}

function getPlayerImageFor(raw: any): string {
  return buildPlayerImagePath(raw.id, raw.ign, raw.game);
}

function mapRawToPlayer(raw: any, equipCache: SupabaseEquipCache): Player {
  const clicks = raw.count_player_cumulative ?? 0;
  const recent = raw.count_player_recent ?? 0;
  const prevRank = raw.previous_admin_power_ranking ?? 0;
  const currRank = raw.admin_power_ranking ?? 0;
  const rankChangeAmt = prevRank > 0 ? prevRank - currRank : 0;

  return {
    id: (raw.ign || '').toLowerCase(),
    dbId: raw.id,
    team: raw.team || '',
    teamLogo: teamLogos[raw.team] || '',
    playerName: raw.ign || '',
    playerRealName: raw.name || '',
    birthDate: raw.birthdate || raw.birthday || raw.dob || undefined,
    nationality: `🇰🇷 ${raw.nationality || ''}`,
    playerImage: getPlayerImageFor(raw),
    equipment: buildPlayerEquipment(equipCache, raw),
    previousEquipment: buildPlayerPreviousEquipment(equipCache, raw),
    game: raw.game || 'lol',
    profession: raw.profession || '',
    position: raw.position || '',
    popularityRank: 0,
    rankChange: rankChangeAmt,
    clickCount: clicks,
    powerRanking: raw.admin_power_ranking ?? undefined,
    powerScore: raw.total_weighted_points ?? 0,
    youtube: raw.youtube || undefined,
    soop: raw.soop || undefined,
    instagram: raw.instagram || undefined,
    twitter: raw.twitter || undefined,
    twitch: raw.twitch || undefined,
    chzzk: raw.chzzk || undefined,
    facebook: raw.facebook || undefined,
    collectedWords: raw.collected_words || undefined,
  };
}

async function dedupeAndRank(rawPlayers: any[], equipCache: SupabaseEquipCache): Promise<Player[]> {
  const playerMap = new Map<string, Player>();
  for (const raw of rawPlayers) {
    if (!raw.ign || playerMap.has(raw.ign)) continue;
    playerMap.set(raw.ign, mapRawToPlayer(raw, equipCache));
  }
  const players = Array.from(playerMap.values());

  // Group by game, then sort each group by power ranking
  const byGame: Record<string, Player[]> = {};
  for (const p of players) {
    if (!byGame[p.game]) byGame[p.game] = [];
    byGame[p.game].push(p);
  }

  for (const game of Object.keys(byGame)) {
    const list = byGame[game];
    list.sort((a, b) => {
      const aRank = (a as any).powerRanking ?? Infinity;
      const bRank = (b as any).powerRanking ?? Infinity;
      if (aRank !== bRank) return aRank - bRank;
      return b.clickCount - a.clickCount;
    });
    list.forEach((p, i) => {
      p.popularityRank = i + 1;
    });
  }

  // Return all players flattened (HomeClient will filter by game)
  return players;
}

// ── Public API ───────────────────────────────────────────────────────────

export async function getServerAllPlayers(): Promise<Player[]> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // no-op — read-only data fetch
        },
      },
    },
  );

  // Fetch in parallel
  const [playersRes, equipRes] = await Promise.all([
    supabase.from('gamers_info').select('*'),
    supabase.from('equipment_info').select('*'),
  ]);

  if (playersRes.error) {
    console.error('Server: failed to fetch gamers_info', playersRes.error);
    throw playersRes.error;
  }

  const equipCache = buildEquipCache(equipRes.data ?? []);
  return await dedupeAndRank(playersRes.data ?? [], equipCache);
}
