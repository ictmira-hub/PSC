import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSchema, sql } from '../_lib/db';
import { verifySession } from '../_lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureSchema();

  const session = verifySession(req.headers.cookie);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const id = req.query.id as string;

  if (req.method === 'PATCH') {
    const rows = await sql`SELECT * FROM assets WHERE id = ${id}`;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const current = rows[0];
    const u = req.body ?? {};

    await sql`
      UPDATE assets SET
        title = ${u.title ?? current.title},
        type = ${u.type ?? current.type},
        category = ${u.category ?? current.category},
        campaign_name = ${u.campaignName !== undefined ? u.campaignName : current.campaign_name},
        cs_link = ${u.csLink ?? current.cs_link},
        cs_link_description = ${u.csLinkDescription !== undefined ? u.csLinkDescription : current.cs_link_description},
        growth_link = ${u.growthLink ?? current.growth_link},
        growth_utm_params = ${u.growthUtmParams !== undefined ? JSON.stringify(u.growthUtmParams) : current.growth_utm_params},
        preview_url = ${u.previewUrl !== undefined ? u.previewUrl : current.preview_url},
        preview_type = ${u.previewType !== undefined ? u.previewType : current.preview_type},
        video_embed_url = ${u.videoEmbedUrl !== undefined ? u.videoEmbedUrl : current.video_embed_url},
        description = ${u.description !== undefined ? u.description : current.description},
        tags = ${u.tags ?? current.tags},
        pinned = ${u.pinned !== undefined ? u.pinned : current.pinned},
        updated_at = ${Date.now()}
      WHERE id = ${id}
    `;
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM assets WHERE id = ${id}`;
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'PATCH, DELETE');
  return res.status(405).end();
}
