import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearSessionCookie } from '../_lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  res.setHeader('Set-Cookie', clearSessionCookie());
  return res.status(200).json({ ok: true });
}
