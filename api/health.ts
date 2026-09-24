import type { VercelRequest, VercelResponse } from '@vercel/node';

// Visit this in a browser (GET, no login needed) to check server-side
// config without DevTools gymnastics: /api/health
// Reveals presence/length only — never actual secret values.
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  let dbConnectOk = false;
  let dbError: string | null = null;
  try {
    if (databaseUrl) {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(databaseUrl);
      await sql`SELECT 1`;
      dbConnectOk = true;
    }
  } catch (err: any) {
    dbError = String(err?.message ?? err);
  }

  return res.status(200).json({
    adminPasswordEnvSet: !!adminPassword,
    adminPasswordEnvLength: adminPassword ? adminPassword.length : 0,
    sessionSecretEnvSet: !!sessionSecret,
    databaseUrlEnvSet: !!databaseUrl,
    databaseConnectOk: dbConnectOk,
    databaseError: dbError,
    nodeVersion: process.version,
  });
}
