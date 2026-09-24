import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSchema, sql } from '../../_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  await ensureSchema();

  const id = req.query.id as string;
  const { team } = req.body ?? {};

  if (team === 'CS') {
    await sql`UPDATE assets SET copy_count_cs = copy_count_cs + 1 WHERE id = ${id}`;
  } else if (team === 'Growth') {
    await sql`UPDATE assets SET copy_count_growth = copy_count_growth + 1 WHERE id = ${id}`;
  } else {
    return res.status(400).json({ error: 'team must be "CS" or "Growth"' });
  }

  return res.status(200).json({ ok: true });
}
