/**
 * test-gemini.mjs
 * ─────────────────────────────────────────────────────────────────────
 * Smoke-test for the Gemini API key setup used by the Altius daily pipeline.
 * Tests PRIMARY key first, falls back to GEMINI_API_KEY_FALLBACK if needed.
 *
 * Run with:
 *   node scripts/test-gemini.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Load .env.local manually ─────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '..', '.env.local');
try {
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.error('⚠️  Could not read .env.local');
}

// ── Step 1: Validate keys ─────────────────────────────────────────────
const primaryKey = process.env.GEMINI_API_KEY;
const fallbackKey = process.env.GEMINI_API_KEY_FALLBACK;

if (!primaryKey) {
  console.error('\n❌ GEMINI_API_KEY is not set in .env.local\n');
  process.exit(1);
}
console.log('\n✅ Step 1 — Keys found:');
console.log(`   PRIMARY  : ${primaryKey.slice(0, 12)}...${primaryKey.slice(-4)}`);
console.log(`   FALLBACK : ${fallbackKey ? fallbackKey.slice(0, 12) + '...' + fallbackKey.slice(-4) : '(not set)'}`);

// ── Step 2: Import the SDK ────────────────────────────────────────────
let GoogleGenerativeAI;
try {
  ({ GoogleGenerativeAI } = await import('@google/generative-ai'));
  console.log('✅ Step 2 — @google/generative-ai SDK loaded');
} catch (e) {
  console.error('❌ Step 2 — Could not load @google/generative-ai:', e.message);
  process.exit(1);
}

// ── Step 3: Build model helper ────────────────────────────────────────
function buildModel(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: { responseMimeType: 'application/json', temperature: 0.9, maxOutputTokens: 512 },
    systemInstruction: `You are an elite MBA knowledge editor for Altius.
Output ONLY valid JSON. No markdown, no backticks, no preamble, no postamble.`,
  });
}

// ── Step 4: Production-style prompt (Finance) ─────────────────────────
const testPrompt = `Generate ONE MBA case study for the FINANCE specialisation.

Authoritative sources to draw from and cite:
- Aswath Damodaran (damodaran.com — valuation, cost of capital, industry multiples)
- RBI (rbi.org.in — India monetary policy, banking sector data)
- NSE (nseindia.com — equity data, index performance)
- Financial Times / Bloomberg (global capital markets, M&A)

All company data MUST be sourced from the listed sources or official annual reports.
Cite the source name and approximate date for every metric.

Return JSON:
{
  "company": "Company name",
  "title": "Case title (max 10 words)",
  "sector": "Sector",
  "situation": "2-3 sentence problem statement with real data and source citations",
  "keyMetric": "One headline number with source and date",
  "question": "The core case question for the student"
}`;

// ── Step 5: Try primary, fallback on 429 ─────────────────────────────
async function attempt(apiKey, label) {
  const model = buildModel(apiKey);
  const start = Date.now();
  const result = await model.generateContent(testPrompt);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  return { text: result.response.text().trim(), elapsed, label };
}

let raw, elapsed, usedLabel;

console.log('\n⏳ Step 3 — Testing PRIMARY key with a production-style prompt...');
try {
  ({ text: raw, elapsed, label: usedLabel } = await attempt(primaryKey, 'PRIMARY'));
  console.log(`✅ Step 3 — PRIMARY key responded in ${elapsed}s`);
} catch (e) {
  const isFallbackEligible =
    e?.message?.includes('429') ||
    e?.message?.includes('quota') ||
    e?.message?.includes('403') ||
    e?.message?.includes('blocked') ||
    e?.message?.includes('RESOURCE_EXHAUSTED');

  if (isFallbackEligible && fallbackKey) {
    console.warn(`⚠️  Step 3 — PRIMARY key failed (${e.message.split('\n')[0]})`);
    console.log('⏳ Step 4 — Trying FALLBACK key...');
    try {
      ({ text: raw, elapsed, label: usedLabel } = await attempt(fallbackKey, 'FALLBACK'));
      console.log(`✅ Step 4 — FALLBACK key responded in ${elapsed}s`);
    } catch (e2) {
      console.error('❌ Step 4 — FALLBACK key also failed:', e2.message.split('\n')[0]);
      process.exit(1);
    }
  } else {
    console.error('❌ Step 3 — PRIMARY key failed:', e.message.split('\n')[0]);
    process.exit(1);
  }
}

// ── Step 6: Parse and display ─────────────────────────────────────────
let parsed;
try {
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  parsed = JSON.parse(cleaned);
  console.log(`✅ Step 5 — Response is valid JSON (key used: ${usedLabel})\n`);
} catch {
  console.error('❌ Step 5 — Response is NOT valid JSON. Raw:', raw);
  process.exit(1);
}

console.log('═══════════════════════════════════════════════════════');
console.log('  SAMPLE GENERATED CASE (Finance) — LIVE FROM GEMINI');
console.log('═══════════════════════════════════════════════════════');
console.log(`  Company    : ${parsed.company}`);
console.log(`  Title      : ${parsed.title}`);
console.log(`  Sector     : ${parsed.sector}`);
console.log(`  Key Metric : ${parsed.keyMetric}`);
console.log(`  Question   : ${parsed.question}`);
console.log(`  Situation  :\n    ${parsed.situation}`);
console.log('═══════════════════════════════════════════════════════\n');

console.log('📅 Vercel Cron Schedule (from vercel.json):');
console.log('   /api/cron/generate-daily      → every day at 18:30 UTC = 00:00 IST');
console.log('   /api/cron/cleanup-old-content → every Sunday at 02:00 UTC\n');
console.log('✅ ALL CHECKS PASSED — Gemini is working. Pipeline is ready for tomorrow.\n');
