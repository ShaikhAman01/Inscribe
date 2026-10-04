const ITERATIONS = 100_000;
const encoder = new TextEncoder();

const toB64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromB64 = (s: string) => Uint8Array.from(atob(s), (ch) => ch.charCodeAt(0));

const timingSafeEqual = (a: Uint8Array, b: Uint8Array) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
};

const pbkdf2 = async (password: string, salt: Uint8Array, iterations: number) => {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return new Uint8Array(bits);
};

export const hashPassword = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${toB64(salt)}$${toB64(hash)}`;
};

// Accounts created before PBKDF2 hold an unsalted SHA-256; they are upgraded on next sign-in.
const verifyLegacy = async (password: string, stored: string) => {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(password)));
  return timingSafeEqual(encoder.encode(toB64(digest)), encoder.encode(stored));
};

export const verifyPassword = async (password: string, stored: string) => {
  const [scheme, iterations, salt, hash] = stored.split("$");
  if (scheme !== "pbkdf2") {
    return { ok: await verifyLegacy(password, stored), needsRehash: true };
  }
  const derived = await pbkdf2(password, fromB64(salt), Number(iterations));
  return { ok: timingSafeEqual(derived, fromB64(hash)), needsRehash: Number(iterations) < ITERATIONS };
};

// Spends the same time as a real check so unknown emails can't be told apart by latency.
export const burnPasswordCheck = (password: string) =>
  pbkdf2(password, new Uint8Array(16), ITERATIONS).then(() => undefined);
