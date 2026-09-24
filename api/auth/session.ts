import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifySession } from '../_lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = verifySession(req.headers.cookie);
  if (!session) {
    return res.status(200).json({ isAuthenticated: false, role: 'viewer' });
  }
  return res.status(200).json({ isAuthenticated: true, role: 'admin', email: session.email });
}
