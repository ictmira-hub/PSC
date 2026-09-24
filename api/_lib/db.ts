import { neon } from '@neondatabase/serverless';

// Vercel's native Postgres integration (Neon) sets DATABASE_URL when the
// database is connected from the project's Storage tab. POSTGRES_URL is
// kept as a fallback for older/alternate Postgres integrations.
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error(
    'No database connection string found. Connect a Postgres database to this project from the Vercel Storage tab (sets DATABASE_URL automatically).'
  );
}

export const sql = neon(connectionString);

// AssetItem shape mirrors src/types.ts (kept in sync manually since /api
// runs as separate serverless functions from the Vite-built client).
export interface AssetItem {
  id: string;
  title: string;
  type: string;
  category: string;
  campaignName?: string;
  csLink: string;
  csLinkDescription?: string;
  growthLink: string;
  growthUtmParams?: Record<string, string | undefined>;
  previewUrl?: string;
  previewType?: string;
  videoEmbedUrl?: string;
  description?: string;
  tags: string[];
  pinned?: boolean;
  copyCountCS: number;
  copyCountGrowth: number;
  createdAt: number;
  updatedAt: number;
  createdBy?: string;
}

let schemaReady: Promise<void> | null = null;

// Lazily creates the table on first request instead of requiring a
// separate migration step. Cheap no-op on every call after the first
// (IF NOT EXISTS), and memoized per warm function instance.
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS assets (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          type TEXT NOT NULL,
          category TEXT NOT NULL,
          campaign_name TEXT,
          cs_link TEXT NOT NULL,
          cs_link_description TEXT,
          growth_link TEXT NOT NULL,
          growth_utm_params JSONB,
          preview_url TEXT,
          preview_type TEXT,
          video_embed_url TEXT,
          description TEXT,
          tags TEXT[] NOT NULL DEFAULT '{}',
          pinned BOOLEAN NOT NULL DEFAULT false,
          copy_count_cs INTEGER NOT NULL DEFAULT 0,
          copy_count_growth INTEGER NOT NULL DEFAULT 0,
          created_at BIGINT NOT NULL,
          updated_at BIGINT NOT NULL,
          created_by TEXT
        );
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets (created_at DESC);`;
    })();
  }
  return schemaReady;
}

export function rowToAsset(row: Record<string, any>): AssetItem {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    category: row.category,
    campaignName: row.campaign_name ?? undefined,
    csLink: row.cs_link,
    csLinkDescription: row.cs_link_description ?? undefined,
    growthLink: row.growth_link,
    growthUtmParams: row.growth_utm_params ?? undefined,
    previewUrl: row.preview_url ?? undefined,
    previewType: row.preview_type ?? undefined,
    videoEmbedUrl: row.video_embed_url ?? undefined,
    description: row.description ?? undefined,
    tags: row.tags ?? [],
    pinned: row.pinned ?? false,
    copyCountCS: row.copy_count_cs ?? 0,
    copyCountGrowth: row.copy_count_growth ?? 0,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
    createdBy: row.created_by ?? undefined,
  };
}
