// Korean consonant (초성) extraction for search matching
const CHOSUNG_LIST = [
  "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ",
  "ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ",
];

// Korean to English keyboard mapping (두벌식 → QWERTY)
const KO_TO_EN: Record<string, string> = {
  "ㅂ": "q", "ㅈ": "w", "ㄷ": "e", "ㄱ": "r", "ㅅ": "t",
  "ㅛ": "y", "ㅕ": "u", "ㅑ": "i", "ㅐ": "o", "ㅔ": "p",
  "ㅁ": "a", "ㄴ": "s", "ㅇ": "d", "ㄹ": "f", "ㅎ": "g",
  "ㅗ": "h", "ㅓ": "j", "ㅏ": "k", "ㅣ": "l",
  "ㅋ": "z", "ㅌ": "x", "ㅊ": "c", "ㅍ": "v", "ㅠ": "b",
  "ㅜ": "n", "ㅡ": "m",
  "ㅃ": "Q", "ㅉ": "W", "ㄸ": "E", "ㄲ": "R", "ㅆ": "T",
  "ㅒ": "O", "ㅖ": "P",
};

// Full Korean syllable decomposition
const JUNGSUNG_LIST = [
  "ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ",
  "ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ",
];

const JONGSUNG_LIST = [
  "","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ",
  "ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ",
  "ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ",
];

function decompose(char: string): string[] {
  const code = char.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return [char];
  const cho = Math.floor(code / 588);
  const jung = Math.floor((code % 588) / 28);
  const jong = code % 28;
  const result = [CHOSUNG_LIST[cho], JUNGSUNG_LIST[jung]];
  if (jong !== 0) result.push(JONGSUNG_LIST[jong]);
  return result;
}

function decomposeString(str: string): string {
  return str.split("").map((ch) => {
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      return decompose(ch).join("");
    }
    return ch;
  }).join("");
}

function getChosung(str: string): string {
  return str.split("").map((ch) => {
    const code = ch.charCodeAt(0) - 0xAC00;
    if (code >= 0 && code <= 11171) {
      return CHOSUNG_LIST[Math.floor(code / 588)];
    }
    return ch;
  }).join("");
}

// Convert Korean jamo input to English QWERTY equivalent
function koToEn(str: string): string {
  const decomposed = decomposeString(str);
  return decomposed.split("").map((ch) => KO_TO_EN[ch] || ch).join("").toLowerCase();
}

function isKorean(str: string): boolean {
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(str);
}

function isChosungOnly(str: string): boolean {
  return /^[ㄱ-ㅎ]+$/.test(str);
}

export function matchesQuery(
  query: string,
  playerName: string,
  realName: string,
  team: string,
  collectedWords?: string[],
): boolean {
  if (!query) return false;
  const q = query.toLowerCase().trim();
  if (!q) return false;

  const name = playerName.toLowerCase();
  const real = realName.toLowerCase();
  const tm = team.toLowerCase();

  // Direct substring match
  if (name.includes(q) || real.includes(q) || tm.includes(q)) return true;

  // Search collected_words (nicknames / aliases)
  if (collectedWords && collectedWords.length > 0) {
    for (const w of collectedWords) {
      const lower = w.toLowerCase();
      if (lower.includes(q)) return true;
      // chosung match on collected words
      if (isKorean(q) && isChosungOnly(q)) {
        const wChosung = getChosung(w);
        if (wChosung.startsWith(q)) return true;
      }
    }
  }

  if (isKorean(query)) {
    // Chosung-only matching (e.g. ㅍㅇㅋ matching 페이커)
    if (isChosungOnly(query)) {
      const nameChosung = getChosung(realName);
      if (nameChosung.startsWith(query)) return true;
      const teamChosung = getChosung(team);
      if (teamChosung.startsWith(query)) return true;
    }

    // Korean decomposed matching (partial syllable matching)
    const decomposedQuery = decomposeString(query);
    const decomposedReal = decomposeString(realName);
    if (decomposedReal.includes(decomposedQuery)) return true;

    // Korean keyboard → English conversion (e.g. typing ㄹ치 → faker typed with Korean IME)
    const converted = koToEn(query);
    if (converted && name.includes(converted)) return true;
  }

  return false;
}

/**
 * Score how well a query matches a player. Higher = better match.
 * Used to sort search results so the best match is on top.
 */
export function scoreQuery(
  query: string,
  playerName: string,
  realName: string,
  team: string,
  collectedWords?: string[],
): number {
  if (!query) return 0;
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const name = playerName.toLowerCase();
  const real = realName.toLowerCase();
  const tm = team.toLowerCase();
  let score = 0;

  // Exact match on IGN — highest priority
  if (name === q) score += 1000;
  // Exact match on real name
  else if (real === q) score += 900;

  // Partial match on IGN (substring)
  if (name.includes(q)) score += 200 + (q.length / name.length) * 100;
  // Partial match on real name
  if (real.includes(q)) score += 150 + (q.length / real.length) * 80;
  // Partial match on team
  if (tm.includes(q)) score += 50 + (q.length / tm.length) * 30;

  // Match in collected_words (nicknames / aliases)
  if (collectedWords && collectedWords.length > 0) {
    for (const w of collectedWords) {
      const lower = w.toLowerCase();
      if (lower === q) score += 300;
      else if (lower.includes(q)) score += 100 + (q.length / lower.length) * 50;
      else if (isKorean(q) && isChosungOnly(q)) {
        const wChosung = getChosung(w);
        if (wChosung.startsWith(q)) score += 60;
      }
    }
  }

  if (isKorean(query)) {
    // Chosung match
    if (isChosungOnly(query)) {
      const nameChosung = getChosung(realName);
      if (nameChosung === q) score += 200;
      else if (nameChosung.startsWith(q)) score += 100;
      const teamChosung = getChosung(team);
      if (teamChosung.startsWith(q)) score += 30;
    }

    // Korean decomposed match
    const decomposedQuery = decomposeString(query);
    const decomposedReal = decomposeString(realName);
    if (decomposedReal.includes(decomposedQuery)) {
      score += 80 + (decomposedQuery.length / decomposedReal.length) * 40;
    }

    // Korean keyboard → English conversion match
    const converted = koToEn(query);
    if (converted) {
      if (name.includes(converted)) score += 120 + (converted.length / name.length) * 60;
    }
  }

  // Bonus: longer query matching against longer fields is better
  score += q.length; // slight preference for longer queries

  return Math.round(score);
}
