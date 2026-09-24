import crypto from 'node:crypto';

const COOKIE_NAME = 'psc_admin';
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      'SESSION_SECRET is not set. Add it as an environment variable in the Vercel project settings.'
    );
  }
  return secret;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

// Signs { email, exp } into "psc_admin=<payload>.<hmac>". No external JWT
// library needed for a single-role, single-secret session like this one.
export function createSessionCookie(email: string): string {
  const payload = JSON.stringify({ email, exp: Date.now() + MAX_AGE_SECONDS * 1000 });
  const b64 = base64url(payload);
  const sig = crypto.createHmac('sha256', getSecret()).update(b64).digest('base64url');
  return `${COOKIE_NAME}=${b64}.${sig}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE_SECONDS}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function verifySession(cookieHeader?: string | null): { email: string } | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;

  const [b64, sig] = match[1].split('.');
  if (!b64 || !sig) return null;

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return null;
  }

  const expectedSig = crypto.createHmac('sha256', secret).update(b64).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  try {
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

// Constant-time compare against the server-only ADMIN_PASSWORD env var.
// Never shipped to the client bundle, unlike the old hardcoded passwords.
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
