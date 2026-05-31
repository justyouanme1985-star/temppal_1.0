// Korean consonant (초성) extraction for search matching
const CHOSUNG_LIST = [
  "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ",
  "ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ",
];

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

function koToEn(str: string): string {
  const decomposed = decomposeString(str);
  return decomposed.split("").map((ch) => KO_TO_EN[ch] || ch).join("").toLowerCase();
}

function isKorean(str: string): boolean {
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(str);
}

export function isChosungOnly(str: string): boolean {
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

  const name = (playerName ?? "").toLowerCase();
  const real = (realName ?? "").toLowerCase();
  const tm = (team ?? "").toLowerCase();

  // 직접 부분 문자열 매칭
  if (name.includes(q) || real.includes(q) || tm.includes(q)) return true;

  // collected_words 매칭
  if (collectedWords && collectedWords.length > 0) {
    for (const w of collectedWords) {
      if (w.toLowerCase().includes(q)) return true;
    }
  }

  if (isKorean(q)) {
    // 초성 매칭 (ㅍ → 페이커, ㅍㅇㅋ → 페이커)
    if (isChosungOnly(q)) {
      const nameChosung = getChosung(realName);
      if (nameChosung.startsWith(q) || nameChosung.includes(q)) return true;

      const teamChosung = getChosung(tm);
      if (teamChosung.startsWith(q) || teamChosung.includes(q)) return true;

      if (collectedWords) {
        for (const w of collectedWords) {
          const wChosung = getChosung(w);
          if (wChosung.startsWith(q) || wChosung.includes(q)) return true;
        }
      }
    }

    // 한글 분해 매칭 (페이 → 페이커)
    const decomposedQuery = decomposeString(q);
    const decomposedReal = decomposeString(realName);
    const decomposedTm = decomposeString(tm);
    if (decomposedReal.includes(decomposedQuery)) return true;
    if (decomposedTm.includes(decomposedQuery)) return true;

    if (collectedWords) {
      for (const w of collectedWords) {
        if (decomposeString(w).includes(decomposedQuery)) return true;
      }
    }

    // 한글 → 영문 변환 매칭
    const converted = koToEn(q);
    if (converted && name.includes(converted)) return true;
  }

  return false;
}

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

  const name = (playerName ?? "").toLowerCase();
  const real = (realName ?? "").toLowerCase();
  const tm = (team ?? "").toLowerCase();
  let score = 0;

  // IGN 정확히 일치 — 최우선
  if (name === q) score += 2000;
  // 실명 정확히 일치
  else if (real === q) score += 1900;

  // IGN 부분 일치
  if (name.includes(q)) score += 200 + (q.length / name.length) * 100;
  // 실명 부분 일치
  if (real.includes(q)) score += 150 + (q.length / real.length) * 80;
  // 팀명 부분 일치
  if (tm.includes(q)) score += 50 + (q.length / tm.length) * 30;

  // collected_words 매칭
  if (collectedWords && collectedWords.length > 0) {
    for (const w of collectedWords) {
      const lower = w.toLowerCase();
      // 정확히 일치 → 자동 이동 확정 (2000점)
      if (lower === q) score += 2000;
      else if (lower.includes(q)) score += 100 + (q.length / lower.length) * 50;
    }
  }

  if (isKorean(q)) {
    // 초성 매칭 — 낮은 점수 (자동 이동 안 되게)
    if (isChosungOnly(q)) {
      const nameChosung = getChosung(realName);
      if (nameChosung === q) score += 150;
      else if (nameChosung.startsWith(q)) score += 80;
      else if (nameChosung.includes(q)) score += 40;

      const teamChosung = getChosung(tm);
      if (teamChosung.startsWith(q)) score += 20;
      else if (teamChosung.includes(q)) score += 10;

      if (collectedWords) {
        for (const w of collectedWords) {
          const wChosung = getChosung(w);
          if (wChosung.startsWith(q)) score += 60;
          else if (wChosung.includes(q)) score += 30;
        }
      }
    }

    // 한글 분해 매칭
    const decomposedQuery = decomposeString(q);
    const decomposedReal = decomposeString(realName);
    if (decomposedReal.includes(decomposedQuery)) {
      score += 80 + (decomposedQuery.length / decomposedReal.length) * 40;
    }

    if (collectedWords) {
      for (const w of collectedWords) {
        if (decomposeString(w).includes(decomposedQuery)) {
          score += 60;
        }
      }
    }

    // 한글 → 영문 변환 매칭
    const converted = koToEn(q);
    if (converted && name.includes(converted)) {
      score += 120 + (converted.length / name.length) * 60;
    }
  }

  score += q.length;
  return Math.round(score);
}