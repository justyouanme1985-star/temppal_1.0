import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const SCRYPT_KEYLEN = 64;
const HASH_PREFIX = "scrypt";

/**
 * Hash a plaintext password using Node's built-in scrypt.
 * Format: `scrypt$<saltHex>$<hashHex>` so it is self-describing and
 * dependency-free. Used for anonymous community post passwords.
 */
export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(plain, salt, SCRYPT_KEYLEN);
  return `${HASH_PREFIX}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

/**
 * Verify a plaintext password against a stored value.
 * Supports both the new scrypt hash format and legacy plaintext values
 * (rows created before hashing was introduced) for backward compatibility.
 */
export function verifyPassword(plain: string, stored: string): boolean {
  if (!stored) return false;

  if (stored.startsWith(`${HASH_PREFIX}$`)) {
    const [, saltHex, hashHex] = stored.split("$");
    if (!saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const derived = scryptSync(plain, salt, expected.length);
    return expected.length === derived.length && timingSafeEqual(expected, derived);
  }

  // Legacy plaintext fallback — constant-time compare where possible.
  const a = Buffer.from(plain);
  const b = Buffer.from(stored);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** True if a stored value still uses the legacy plaintext format. */
export function isLegacyPlaintext(stored: string): boolean {
  return !!stored && !stored.startsWith(`${HASH_PREFIX}$`);
}
