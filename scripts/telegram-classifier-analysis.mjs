import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.local');

if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    process.env[key] = val;
  }
}

const apiIdStr = process.env.TELEGRAM_API_ID;
const apiHash = process.env.TELEGRAM_API_HASH;
const sessionStr = process.env.TELEGRAM_SESSION;

const apiId = parseInt(apiIdStr.trim(), 10);
const client = new TelegramClient(new StringSession(sessionStr.trim()), apiId, apiHash.trim(), {
  connectionRetries: 5,
});

async function runAnalysis() {
  await client.connect();
  const dialogs = await client.getDialogs({});
  const targetDialog = dialogs.find((d) => d.title && d.title.toLowerCase().includes("english pass"));

  const messages = await client.getMessages(targetDialog.entity, { limit: 500 });
  console.log(`Fetched ${messages.length} messages.`);

  const list = [];
  for (const msg of messages) {
    let filename = '';
    let fileSizeMB = '0';

    if (msg.media && msg.media.document) {
      const doc = msg.media.document;
      fileSizeMB = (doc.size / (1024 * 1024)).toFixed(2);
      if (doc.attributes) {
        for (const attr of doc.attributes) {
          if (attr.fileName) {
            filename = attr.fileName;
            break;
          }
        }
      }
    }

    if (filename.endsWith('.pdf')) {
      list.push({
        id: msg.id,
        date: msg.date ? new Date(msg.date * 1000).toISOString() : '',
        filename,
        fileSizeMB,
      });
    }
  }

  // Exclude NIE
  const nonNie = list.filter(i => !i.filename.toLowerCase().includes('nie'));

  console.log(`\nFound ${nonNie.length} non-NIE PDF files in 500 messages:\n`);

  const patterns = {};
  nonNie.forEach(item => {
    const prefix = item.filename.split(/[_\-\s\d]/)[0];
    if (!patterns[prefix]) patterns[prefix] = [];
    patterns[prefix].push(item);
  });

  for (const [p, items] of Object.entries(patterns)) {
    console.log(`=== Prefix / Group: "${p}" (${items.length} files) ===`);
    items.slice(0, 5).forEach(it => {
      console.log(`   - [Msg #${it.id} | ${it.date.slice(0, 10)}] ${it.filename}`);
    });
    if (items.length > 5) {
      console.log(`   ... (+${items.length - 5} more)`);
    }
  }

  await client.disconnect();
  process.exit(0);
}

runAnalysis().catch(err => {
  console.error(err);
  process.exit(1);
});
