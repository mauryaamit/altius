import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.local');

// Parse .env.local
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    process.env[key] = val; // ensure latest saved session is active
  }
}

const apiIdStr = process.env.TELEGRAM_API_ID;
const apiHash = process.env.TELEGRAM_API_HASH;
const sessionStr = process.env.TELEGRAM_SESSION;

if (!apiIdStr || !apiHash) {
  console.error('\n❌ Error: TELEGRAM_API_ID and TELEGRAM_API_HASH must be configured in .env.local\n');
  process.exit(1);
}

if (!sessionStr || sessionStr.trim() === '') {
  console.error('\n❌ Error: TELEGRAM_SESSION is empty in .env.local.');
  console.error('   Please run `node scripts/telegram-auth.mjs` first to generate your session string.\n');
  process.exit(1);
}

const apiId = parseInt(apiIdStr.trim(), 10);
const TARGET_CHANNEL_NAME = "English Pass : All English ePaper in PDF";

console.log('\n======================================================');
console.log('   Altius — Telegram Channel Access Diagnostic');
console.log('======================================================\n');
console.log(`Target Channel: "${TARGET_CHANNEL_NAME}"`);
console.log('Connecting to Telegram MTProto network...\n');

const client = new TelegramClient(new StringSession(sessionStr.trim()), apiId, apiHash.trim(), {
  connectionRetries: 5,
});

async function runDiagnostic() {
  await client.connect();

  const me = await client.getMe();
  if (!me) {
    console.error('❌ Authentication failed: Session invalid or expired.');
    process.exit(1);
  }

  const meName = [me.firstName, me.lastName].filter(Boolean).join(' ') || 'User';
  console.log(`✅ Account Verified: ${meName} (@${me.username || me.id})`);

  console.log('\n🔍 Searching dialogs for target channel...');
  let targetDialog = null;
  const channelIdEnv = process.env.TELEGRAM_CHANNEL_ID?.trim();

  if (channelIdEnv) {
    try {
      const entity = await client.getEntity(channelIdEnv);
      if (entity) {
        targetDialog = {
          entity,
          id: entity.id,
          title: entity.title || entity.name || channelIdEnv,
        };
        console.log(`✅ Direct entity resolution via TELEGRAM_CHANNEL_ID succeeded: "${targetDialog.title}" (${targetDialog.id})`);
      }
    } catch (e) {
      console.warn(`⚠️ Direct entity resolution via TELEGRAM_CHANNEL_ID (${channelIdEnv}) failed:`, e?.message);
    }
  }

  if (!targetDialog) {
    const dialogs = await client.getDialogs({});
    const matches = dialogs.filter(d => {
      const title = (d.title || d.name || '').toLowerCase();
      return title.includes(TARGET_CHANNEL_NAME.toLowerCase()) || 
             title.includes("english pass") ||
             title.includes("all english epaper");
    });

    if (matches.length > 0) {
      const active = matches.find(d => !d.entity?.left) || matches[0];
      targetDialog = active;
      console.log(`✅ Resolved target channel via dialog search: "${targetDialog.title}" (${targetDialog.id})`);
    } else {
      console.warn(`\n⚠️ Exact match not found in recent dialogs. Scanning all joined channels:`);
      for (const d of dialogs) {
        if (d.isChannel || d.isGroup) {
          console.log(`   - "${d.title}" (ID: ${d.id})`);
        }
      }
      console.error(`\n❌ Could not locate channel matching "${TARGET_CHANNEL_NAME}".`);
      console.error('   Please ensure your account has joined this channel in Telegram.\n');
      await client.disconnect();
      process.exit(1);
    }
  }

  const channelTitle = targetDialog.title;
  const channelId = targetDialog.id ? targetDialog.id.toString() : targetDialog.entity.id.toString();

  console.log('\n======================================================');
  console.log(`📺 TARGET CHANNEL VERIFIED:`);
  console.log(`   Title      : ${channelTitle}`);
  console.log(`   Telegram ID: ${channelId}`);
  console.log('======================================================\n');

  console.log('📥 Fetching history (latest 20 messages)...');
  const messages = await client.getMessages(targetDialog.entity, { limit: 20 });
  console.log(`✅ Read ${messages.length} messages successfully.\n`);

  console.log('------------------------------------------------------');
  console.log('  LATEST MESSAGES & ATTACHED MEDIA / PDFs');
  console.log('------------------------------------------------------');

  let pdfCount = 0;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const dateStr = msg.date ? new Date(msg.date * 1000).toLocaleString('en-IN') : 'Unknown Date';
    const textSnippet = msg.message ? msg.message.split('\n')[0].substring(0, 80) : '(No caption/text)';

    let attachmentDetails = '[No Attachment]';

    if (msg.media && msg.media.document) {
      pdfCount++;
      const doc = msg.media.document;
      let filename = 'Unnamed Document';
      
      if (doc.attributes) {
        for (const attr of doc.attributes) {
          if (attr.fileName) {
            filename = attr.fileName;
            break;
          }
        }
      }

      const sizeMB = doc.size ? (doc.size / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown size';
      const mime = doc.mimeType || 'unknown mime';
      attachmentDetails = `📄 DOCUMENT: "${filename}" (${sizeMB}, type: ${mime})`;
    }

    console.log(`\n[Msg #${msg.id} | ${dateStr}]`);
    console.log(`  Caption   : ${textSnippet}`);
    console.log(`  Attachment: ${attachmentDetails}`);
  }

  console.log('\n======================================================');
  console.log(`📊 DIAGNOSTIC SUMMARY:`);
  console.log(`   Account Status      : CONNECTED & VERIFIED ✅`);
  console.log(`   Channel Access      : CONFIRMED ✅`);
  console.log(`   Messages Inspected  : ${messages.length}`);
  console.log(`   PDFs/Docs Identified: ${pdfCount}`);
  console.log('======================================================\n');

  await client.disconnect();
}

runDiagnostic().catch((err) => {
  console.error('\n❌ Diagnostic execution failed:', err);
  process.exit(1);
});
