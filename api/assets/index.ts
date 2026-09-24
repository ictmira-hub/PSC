import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSchema, rowToAsset, sql } from '../_lib/db';
import { verifySession } from '../_lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureSchema();

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM assets ORDER BY created_at DESC`;
    return res.status(200).json(rows.map(rowToAsset));
  }

  if (req.method === 'POST') {
    const session = verifySession(req.headers.cookie);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const a = req.body ?? {};
    if (!a.id || !a.title || !a.csLink || !a.growthLink) {
      return res.status(400).json({ error: 'Missing required fields (id, title, csLink, growthLink)' });
    }

    const now = Date.now();
    await sql`
      INSERT INTO assets (
        id, title, type, category, campaign_name, cs_link, cs_link_description,
        growth_link, growth_utm_params, preview_url, preview_type, video_embed_url,
        description, tags, pinned, copy_count_cs, copy_count_growth,
        created_at, updated_at, created_by
      ) VALUES (
        ${a.id}, ${a.title}, ${a.type}, ${a.category}, ${a.campaignName ?? null},
        ${a.csLink}, ${a.csLinkDescription ?? null}, ${a.growthLink},
        ${a.growthUtmParams ? JSON.stringify(a.growthUtmParams) : null}, ${a.previewUrl ?? null},
        ${a.previewType ?? null}, ${a.videoEmbedUrl ?? null}, ${a.description ?? null},
        ${a.tags ?? []}, ${a.pinned ?? false}, ${a.copyCountCS ?? 0}, ${a.copyCountGrowth ?? 0},
        ${a.createdAt ?? now}, ${a.updatedAt ?? now}, ${a.createdBy ?? session.email}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        type = EXCLUDED.type,
        category = EXCLUDED.category,
        campaign_name = EXCLUDED.campaign_name,
        cs_link = EXCLUDED.cs_link,
        cs_link_description = EXCLUDED.cs_link_description,
        growth_link = EXCLUDED.growth_link,
        growth_utm_params = EXCLUDED.growth_utm_params,
        preview_url = EXCLUDED.preview_url,
        preview_type = EXCLUDED.preview_type,
        video_embed_url = EXCLUDED.video_embed_url,
        description = EXCLUDED.description,
        tags = EXCLUDED.tags,
        pinned = EXCLUDED.pinned,
        updated_at = EXCLUDED.updated_at
    `;
    return res.status(201).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end();
}
