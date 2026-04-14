#!/usr/bin/env node
/**
 * Anashe DB Migration Runner
 * Usage: node scripts/run-migrations.mjs
 * Requires: SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load .env.local manually
const envFile = readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=').map((s, i) => i === 0 ? s.trim() : l.split('=').slice(1).join('=').trim()))
    .filter(([k]) => k)
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('\n❌  SUPABASE_SERVICE_ROLE_KEY is missing from .env.local');
  console.error('   Get it from: https://supabase.com/dashboard/project/tkdqamzaqarmfoxxtypw/settings/api');
  console.error('   Then add it to .env.local:\n   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function runSQL(sql, label) {
  process.stdout.write(`  Running: ${label} ... `);
  const { error } = await supabase.rpc('exec_sql', { sql }).single();
  if (error && !error.message.includes('already exists') && !error.message.includes('duplicate')) {
    // Try via direct query
    const { error: e2 } = await supabase.from('_').select().limit(0);
    console.log(`⚠  ${error.message}`);
    return false;
  }
  console.log('✓');
  return true;
}

async function main() {
  console.log('\n🚀  Anashe — Running Database Setup\n');
  console.log('  Project:', SUPABASE_URL);

  // Read and split migration files into individual statements
  const schema = readFileSync('supabase/migrations/001_initial_schema.sql', 'utf8');
  const rls = readFileSync('supabase/migrations/002_rls_policies.sql', 'utf8');
  const seed = readFileSync('supabase/seed.sql', 'utf8');

  const allSQL = [
    { label: 'Initial Schema', sql: schema },
    { label: 'RLS Policies', sql: rls },
    { label: 'Seed Data', sql: seed },
  ];

  for (const { label, sql } of allSQL) {
    await runSQL(sql, label);
  }

  console.log('\n✅  Migration complete!\n');
  console.log('   Run: npm run dev\n');
}

main().catch(console.error);
