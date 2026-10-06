import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { classifyDocument, TARGET_NEWSPAPER_SLUGS } from '../lib/telegram/classifier.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.local');

// 1. Load Environment Variables from .env.local if available locally
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

// 2. Initialize Firebase Admin
if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'altius-436b0.firebasestorage.app';

  if (!projectId || !clientEmail || !privateKey) {
    console.error('❌ Firebase Admin credentials missing in environment variables.');
    process.exit(1);
  }

  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
    storageBucket,
  });
}

const db = getFirestore();
const bucket = getStorage().bucket();

const DISPLAY_NAMES = {
  'the-hindu': 'The Hindu',
  'indian-express': 'The Indian Express',
  'mint': 'Mint',
  'economic-times': 'Economic Times',
  'times-of-india': 'Times of India',
  'hindustan-times': 'Hindustan Times',
  'international-editorial': 'International Editorial',
  'hindi-editorial': 'Hindi Editorial',
};

async function runIngestionPipeline() {
  // 3. Compute Current Date & Time in Asia/Kolkata (IST)
  const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const year = nowIST.getFullYear();
  const month = String(nowIST.getMonth() + 1).padStart(2, '0');
  const day = String(nowIST.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const currentHour = nowIST.getHours();
  const timeLabel = `${String(currentHour).padStart(2, '0')}:00 IST`;

  console.log('\n======================================================');
  console.log('   ALTIUS NEWSPAPER INGESTION WORKER');
  console.log(`   Date: ${todayStr}`);
  console.log(`   Time: ${timeLabel}`);
  console.log('======================================================\n');

  // 4. Query Firestore for Today's Ingestion Status
  const todayDocsSnap = await db.collection('newspapers')
    .where('publicationDate', '==', todayStr)
    .get();

  const statusMap = new Map(); // slug -> docData
  todayDocsSnap.docs.forEach(doc => {
    const data = doc.data();
    if (data.slug) {
      statusMap.set(data.slug, data);
    }
  });

  const readySlugs = new Set();
  let htNeedsUpgrade = false;

  TARGET_NEWSPAPER_SLUGS.forEach(slug => {
    const docData = statusMap.get(slug);
    if (docData && docData.status === 'ready') {
      if (slug === 'hindustan-times') {
        if (docData.edition === 'mumbai') {
          readySlugs.add(slug);
        } else {
          // Stored as HT Delhi (Priority 2), check if HT Mumbai appears later
          readySlugs.add(slug); // count as ready for now
          htNeedsUpgrade = true;
        }
      } else {
        readySlugs.add(slug);
      }
    }
  });

  // 5. Early Completion Exit Check
  if (readySlugs.size === 8 && !htNeedsUpgrade) {
    console.log('======================================================');
    console.log('  PROGRESS: 8/8');
    console.log('  STATUS: COMPLETE');
    console.log('  All 8 target categories are fully ingested for today.');
    console.log('  No further Telegram processing required.');
    console.log('======================================================\n');

    await executeRetentionCleanup();
    process.exit(0);
  }

  // 6. Identify Missing Categories & Priority Upgrade Needs
  const missingSlugs = TARGET_NEWSPAPER_SLUGS.filter(s => !readySlugs.has(s) || (s === 'hindustan-times' && htNeedsUpgrade));

  console.log(`Already Completed (${readySlugs.size}/8):`);
  TARGET_NEWSPAPER_SLUGS.forEach(slug => {
    if (readySlugs.has(slug) && !(slug === 'hindustan-times' && htNeedsUpgrade)) {
      console.log(`  ✓ ${DISPLAY_NAMES[slug]} (${statusMap.get(slug)?.edition || 'ready'})`);
    }
  });

  console.log(`\nMissing / Target Categories (${missingSlugs.length}):`);
  missingSlugs.forEach(slug => {
    const note = (slug === 'hindustan-times' && htNeedsUpgrade) ? ' (Searching for Priority 1 Mumbai upgrade)' : '';
    console.log(`  ⏳ ${DISPLAY_NAMES[slug]}${note}`);
  });
  console.log('');

  // 7. Connect to Telegram MTProto Client
  const apiIdStr = process.env.TELEGRAM_API_ID;
  const apiHash = process.env.TELEGRAM_API_HASH;
  const sessionStr = process.env.TELEGRAM_SESSION;

  if (!apiIdStr || !apiHash || !sessionStr) {
    console.error('❌ Telegram environment variables missing.');
    process.exit(1);
  }

  const apiId = parseInt(apiIdStr.trim(), 10);
  const TARGET_CHANNEL_NAME = "English Pass : All English ePaper in PDF";

  const client = new TelegramClient(new StringSession(sessionStr.trim()), apiId, apiHash.trim(), {
    connectionRetries: 5,
  });

  console.log('Connecting to Telegram MTProto...');
  await client.connect();

  const me = await client.getMe();
  if (!me) {
    console.error('❌ Telegram authentication failed.');
    process.exit(1);
  }

  const dialogs = await client.getDialogs({});
  const targetDialog = dialogs.find(d => d.title && d.title.toLowerCase().includes("english pass"));

  if (!targetDialog) {
    console.error(`❌ Target channel "${TARGET_CHANNEL_NAME}" not found.`);
    await client.disconnect();
    process.exit(1);
  }

  const channelId = targetDialog.id ? targetDialog.id.toString() : targetDialog.entity.id.toString();

  console.log('📥 Scanning recent Telegram channel messages...');
  const messages = await client.getMessages(targetDialog.entity, { limit: 250 });

  // Group candidate files for missing slugs
  const candidatesMap = new Map(); // slug -> item

  for (const msg of messages) {
    if (!msg.media || !msg.media.document) continue;
    const doc = msg.media.document;
    let filename = '';
    if (doc.attributes) {
      for (const attr of doc.attributes) {
        if (attr.fileName) {
          filename = attr.fileName;
          break;
        }
      }
    }

    if (!filename) continue;

    const msgDateIso = msg.date ? new Date(msg.date * 1000).toISOString() : new Date().toISOString();
    const classified = classifyDocument(filename, msgDateIso);

    if (!classified.shouldRetain) continue;

    // Only process if it matches today's publication date
    if (classified.inferredDate !== todayStr) continue;

    const slug = classified.slug;
    const isMissing = missingSlugs.includes(slug);

    if (!isMissing) continue;

    // Candidate handling for Hindustan Times upgrade or initial fill
    const existingCandidate = candidatesMap.get(slug);
    if (!existingCandidate || classified.priority < existingCandidate.classified.priority) {
      candidatesMap.set(slug, {
        msg,
        doc,
        filename,
        classified,
        msgDateIso,
      });
    }
  }

  let newlyDownloadedCount = 0;
  const newlyDownloadedSlugs = [];

  // 8. Ingest Candidates
  for (const [slug, item] of candidatesMap.entries()) {
    const { msg, doc, filename, classified, msgDateIso } = item;
    const key = classified.uniquenessKey;
    const docRef = db.collection('newspapers').doc(key);
    const existingDocData = statusMap.get(slug);

    // Skip if existing ready document has equal or higher priority
    if (existingDocData && existingDocData.status === 'ready') {
      const existingPriority = existingDocData.priority ?? 1;
      if (classified.priority >= existingPriority) {
        continue;
      }
      console.log(`🔄 Upgrading ${classified.displayName}: ${existingDocData.edition} (P${existingPriority}) -> ${classified.edition} (P${classified.priority})`);
    }

    console.log(`⬇️ Ingesting [${slug}]: ${filename} (${(doc.size / (1024 * 1024)).toFixed(2)} MB)...`);

    // Mark as processing in Firestore before download
    await docRef.set({
      publicationDate: todayStr,
      slug,
      displayName: classified.displayName,
      category: classified.category,
      edition: classified.edition,
      status: 'processing',
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    try {
      // Stream/Buffer Download
      const buffer = await client.downloadMedia(msg, {});
      if (!buffer) {
        throw new Error(`Media download returned empty buffer for ${filename}`);
      }

      // Storage Upload: newspapers/YYYY-MM-DD/[slug].pdf
      const storagePath = `newspapers/${todayStr}/${slug}.pdf`;
      const fileRef = bucket.file(storagePath);

      await fileRef.save(buffer, {
        metadata: {
          contentType: 'application/pdf',
          metadata: {
            originalFilename: filename,
            publicationDate: todayStr,
            slug,
            edition: classified.edition,
          },
        },
      });

      // Write Ready Metadata to Firestore
      const metadata = {
        publicationDate: todayStr,
        category: classified.category,
        slug,
        displayName: classified.displayName,
        edition: classified.edition,
        priority: classified.priority,
        originalTelegramFilename: filename,
        telegramMessageId: msg.id.toString(),
        telegramChannelId: channelId,
        telegramMessageDate: msgDateIso,
        storagePath,
        fileSize: doc.size,
        ingestedAt: new Date().toISOString(),
        source: 'telegram',
        status: 'ready',
      };

      await docRef.set(metadata, { merge: true });
      console.log(`✅ Stored ${classified.displayName} (${classified.edition}) successfully.`);

      newlyDownloadedCount++;
      newlyDownloadedSlugs.push(slug);
      readySlugs.add(slug);
    } catch (err) {
      console.error(`❌ Failed to ingest ${slug}:`, err.message);
      // Mark as failed so retry happens on next 3-hour run
      await docRef.set({
        status: 'failed',
        error: err.message,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
  }

  // Recalculate Final Progress for this run
  const finalReadyCount = readySlugs.size;
  const isFinalRun = currentHour >= 21;
  const overallStatus = finalReadyCount === 8 ? 'COMPLETE' : isFinalRun ? 'INCOMPLETE (Final Cutoff Passed)' : 'PARTIAL';

  console.log('\n======================================================');
  console.log('   ALTIUS NEWSPAPER INGESTION SUMMARY');
  console.log(`   Date: ${todayStr} | Time: ${timeLabel}`);
  console.log('------------------------------------------------------');
  console.log(`Already Complete (${readySlugs.size - newlyDownloadedCount}/8)`);
  console.log(`Newly Downloaded (${newlyDownloadedCount}/8): ${newlyDownloadedSlugs.map(s => DISPLAY_NAMES[s]).join(', ') || 'None'}`);
  
  const stillMissing = TARGET_NEWSPAPER_SLUGS.filter(s => !readySlugs.has(s));
  console.log(`Still Missing (${stillMissing.length}/8): ${stillMissing.map(s => DISPLAY_NAMES[s]).join(', ') || 'None'}`);

  console.log('------------------------------------------------------');
  console.log(`PROGRESS: ${finalReadyCount}/8`);
  console.log(`STATUS  : ${overallStatus}`);
  if (finalReadyCount < 8 && !isFinalRun) {
    console.log(`Next scheduled check in 3 hours.`);
  }
  console.log('======================================================\n');

  // 9. Retention Cleanup
  await executeRetentionCleanup();

  await client.disconnect();
  process.exit(0);
}

/**
 * 10-Day Retention Cleanup
 * Keeps top 10 unique publication dates in descending order.
 * Deletes Storage files and Firestore docs older than 10 dates.
 */
async function executeRetentionCleanup() {
  console.log('🧹 Running 10-Day Retention Cleanup...');

  const snapshot = await db.collection('newspapers').get();
  if (snapshot.empty) return;

  const datesSet = new Set();
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.publicationDate) {
      datesSet.add(data.publicationDate);
    }
  });

  const sortedDates = Array.from(datesSet).sort((a, b) => b.localeCompare(a));

  if (sortedDates.length <= 10) {
    console.log(`   Retention OK: ${sortedDates.length} publication dates (<= 10).`);
    return;
  }

  const allowedDates = new Set(sortedDates.slice(0, 10));
  const expiredDates = sortedDates.slice(10);

  console.log(`   Pruning expired dates older than top 10: ${expiredDates.join(', ')}`);

  let prunedDocCount = 0;
  let prunedStorageCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.publicationDate && !allowedDates.has(data.publicationDate)) {
      if (data.storagePath) {
        try {
          await bucket.file(data.storagePath).delete();
          prunedStorageCount++;
        } catch {
          // ignore
        }
      }
      await doc.ref.delete();
      prunedDocCount++;
    }
  }

  console.log(`✅ Cleaned up ${prunedDocCount} expired Firestore records & ${prunedStorageCount} Storage files.\n`);
}

runIngestionPipeline().catch(err => {
  console.error('❌ Pipeline Execution Error:', err);
  process.exit(1);
});
