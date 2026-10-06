import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import input from 'input';

// Suppress GramJS background update loop ping timeouts during process exit
process.on('unhandledRejection', (reason) => {
  if (reason && (reason.message === 'TIMEOUT' || String(reason).includes('updates'))) {
    return;
  }
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.local');

// Safely parse .env.local if present
if (existsSync(envPath)) {
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
}

const apiIdStr = process.env.TELEGRAM_API_ID;
const apiHash = process.env.TELEGRAM_API_HASH;

if (!apiIdStr || !apiHash) {
  console.error('\n❌ Error: TELEGRAM_API_ID and TELEGRAM_API_HASH must be set in .env.local\n');
  process.exit(1);
}

const apiId = parseInt(apiIdStr.trim(), 10);
if (isNaN(apiId)) {
  console.error('\n❌ Error: TELEGRAM_API_ID must be a valid integer.\n');
  process.exit(1);
}

console.log('\n======================================================');
console.log('   Altius — Telegram Account One-Time Authenticator');
console.log('======================================================\n');
console.log('This local tool authenticates your personal Telegram account');
console.log('and generates a StringSession to save in TELEGRAM_SESSION.\n');

const stringSession = new StringSession('');
const client = new TelegramClient(stringSession, apiId, apiHash.trim(), {
  connectionRetries: 5,
});

async function runAuth() {
  await client.start({
    phoneNumber: async () => await input.text('Please enter your phone number (e.g. +91XXXXXXXXXX): '),
    password: async () => await input.password('Please enter your 2FA Password (if enabled): '),
    phoneCode: async () => await input.text('Please enter the login code sent to Telegram: '),
    onError: (err) => console.error('Authentication step error:', err.message),
  });

  const sessionString = client.session.save();

  console.log('\n======================================================');
  console.log('✅ TELEGRAM AUTHENTICATION SUCCESSFUL!');
  console.log('======================================================\n');
  console.log('Copy the generated StringSession string below and set it as');
  console.log('TELEGRAM_SESSION in your .env.local file:\n');
  console.log('------------------------------------------------------');
  console.log(sessionString);
  console.log('------------------------------------------------------\n');
  console.log('🔒 Security Note: Keep this session string secret. Never commit it to Git.\n');

  // Stop background update loops & disconnect immediately
  try {
    if (client._channelUpdateLoop) {
      client._channelUpdateLoop = false;
    }
    await client.disconnect();
    if (typeof client.destroy === 'function') {
      await client.destroy();
    }
  } catch {
    // Ignore background socket/update loop cleanup exceptions
  }

  process.exit(0);
}

runAuth().catch((err) => {
  console.error('\n❌ Authentication process failed:', err.message);
  process.exit(1);
});
