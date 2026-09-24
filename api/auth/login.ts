import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkPassword, createSessionCookie } from '../_lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const { password, email } = req.body ?? {};
  if (typeof password !== 'string' || !checkPassword(password)) {
    // TEMPORARY diagnostic — lengths and presence only, never the actual
    // secret or input value. Remove once the mismatch is found.
    const expected = process.env.ADMIN_PASSWORD;
    return res.status(401).json({
      error: 'Invalid admin password',
      debug: {
        adminPasswordEnvSet: !!expected,
        adminPasswordEnvLength: expected ? expected.length : 0,
        receivedPasswordLength: typeof password === 'string' ? password.length : null,
      },
    });
  }

  const resolvedEmail = typeof email === 'string' && email.trim() ? email.trim() : 'mira@packsify.com';
  res.setHeader('Set-Cookie', createSessionCookie(resolvedEmail));
  return res.status(200).json({ isAuthenticated: true, role: 'admin', email: resolvedEmail });
}
