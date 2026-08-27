type LockoutEntry = {
  attempts: number;
  lockedUntil?: number;
};

const store = new Map<string, LockoutEntry>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export function checkLoginLockout(email: string) {
  const key = email.toLowerCase();
  const entry = store.get(key);
  const now = Date.now();

  if (entry?.lockedUntil && now < entry.lockedUntil) {
    return {
      allowed: false as const,
      retryAfterMs: entry.lockedUntil - now,
    };
  }

  if (entry?.lockedUntil && now >= entry.lockedUntil) {
    store.delete(key);
  }

  return { allowed: true as const };
}

export function recordFailedLogin(email: string) {
  const key = email.toLowerCase();
  const entry = store.get(key) ?? { attempts: 0 };
  entry.attempts += 1;

  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
    entry.attempts = 0;
  }

  store.set(key, entry);
}

export function resetLoginLockout(email: string) {
  store.delete(email.toLowerCase());
}
