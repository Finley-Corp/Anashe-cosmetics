#!/usr/bin/env node
import { existsSync, readFileSync } from 'fs';
import pg from 'pg';

const { Client } = pg;

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};

  const raw = readFileSync(filePath, 'utf8');
  const entries = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      if (idx === -1) return null;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      return [key, value];
    })
    .filter(Boolean);

  return Object.fromEntries(entries);
}

const envFromFile = {
  ...parseEnvFile('.env'),
  ...parseEnvFile('.env.local'),
};

function env(name) {
  return process.env[name] ?? envFromFile[name];
}

const connectionString =
  env('DATABASE_URL') ??
  env('POSTGRES_URL') ??
  env('SUPABASE_DB_URL');

if (!connectionString) {
  console.error('Missing DB connection string.');
  console.error('Set DATABASE_URL, POSTGRES_URL, or SUPABASE_DB_URL in env/.env.local.');
  process.exit(1);
}

const intervalMinutes = Number(process.env.KEEP_DB_INTERVAL_MINUTES ?? 5);
const intervalMs = Math.max(1, intervalMinutes) * 60 * 1000;

async function pingDb() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    const startedAt = Date.now();
    await client.query('select 1');
    const durationMs = Date.now() - startedAt;
    console.log(`[${new Date().toISOString()}] DB ping OK (${durationMs}ms)`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[${new Date().toISOString()}] DB ping failed: ${message}`);
  } finally {
    await client.end().catch(() => {});
  }
}

console.log(`Starting DB keepalive ping every ${intervalMinutes} minute(s).`);
console.log('Press Ctrl+C to stop.');

await pingDb();
setInterval(pingDb, intervalMs);
