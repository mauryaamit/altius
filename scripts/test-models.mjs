import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '..', '.env.local');
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

const primaryKey = process.env.GEMINI_API_KEY;
const fallbackKey = process.env.GEMINI_API_KEY_FALLBACK;

const testModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash-exp'];

async function testKey(keyName, apiKey) {
  console.log(`=== Testing Key: ${keyName} ===`);
  const genAI = new GoogleGenerativeAI(apiKey);
  for (const m of testModels) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent('Say hello in 3 words.');
      console.log(`  Model [${m}]: SUCCESS -> "${res.response.text().trim()}"`);
    } catch (err) {
      console.log(`  Model [${m}]: FAILED -> ${err.message.split('\n')[0]}`);
    }
  }
}

async function run() {
  await testKey('PRIMARY', primaryKey);
  await testKey('FALLBACK', fallbackKey);
}

run();
