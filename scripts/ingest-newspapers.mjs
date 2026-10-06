import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
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

// 2. Initialize Firebase Admin (Firestore only, no bucket requirement)
if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

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
  });
}

const db = getFirestore();

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

/**
 * Upload PDF buffer to GitHub Release asset tag `epaper-YYYY-MM-DD`.
 * Fallback to local file store if GITHUB_TOKEN is not provided.
 */
async function storePdfAsset(todayStr, slug, filename, buffer) {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPOSITORY || 'mauryaamit/altius';

  if (!token) {
    console.log(`ℹ️ GITHUB_TOKEN not set. Storing ${slug}.pdf locally for dev environment...`);
    const localDir = resolve(__dirname, '..', 'public', 'newspapers', todayStr);
    if (!existsSync(localDir)) mkdirSync(localDir, { recursive: true });
    const localFilePath = resolve(localDir, `${slug}.pdf`);
    writeFileSync(localFilePath, buffer);
    return {
      fileUrl: `/newspapers/${todayStr}/${slug}.pdf`,
      downloadUrl: `/newspapers/${todayStr}/${slug}.pdf`,
      storageType: 'local',
    };
  }

  const [owner, repo] = repoFull.split('/');
  const tagName = `epaper-${todayStr}`;
  const releaseName = `Altius Newspaper Archive - ${todayStr}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'Altius-Ingestion-Worker',
  };

  let uploadUrlTemplate = '';

  const getRelRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tagName}`, { headers });
  if (getRelRes.ok) {
    const relData = await getRelRes.json();
    uploadUrlTemplate = relData.upload_url;
  } else {
    const createRelRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag_name: tagName,
        name: releaseName,
        body: `Automated daily epaper archive for ${todayStr}.`,
        draft: false,
        prerelease: false,
      }),
    });

    if (!createRelRes.ok) {
      const errText = await createRelRes.text();
      throw new Error(`Failed to create GitHub Release ${tagName}: ${createRelRes.status} ${errText}`);
    }

    const relData = await createRelRes.json();
    uploadUrlTemplate = relData.upload_url;
  }

  const assetName = `${slug}.pdf`;
  const uploadUrl = uploadUrlTemplate.split('{')[0] + `?name=${encodeURIComponent(assetName)}`;

  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/pdf',
      'Content-Length': buffer.length.toString(),
    },
    body: buffer,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    if (uploadRes.status === 422 && errText.includes('already_exists')) {
      const relRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tagName}`, { headers });
      if (relRes.ok) {
        const relData = await relRes.json();
        const assetsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/${relData.id}/assets`, { headers });
        if (assetsRes.ok) {
          const assets = await assetsRes.json();
          const existingAsset = assets.find(a => a.name === assetName);
          if (existingAsset) {
            await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/assets/${existingAsset.id}`, {
              method: 'DELETE',
              headers,
            });
            const retryRes = await fetch(uploadUrl, {
              method: 'POST',
              headers: {
                ...headers,
                'Content-Type': 'application/pdf',
                'Content-Length': buffer.length.toString(),
              },
              body: buffer,
            });
            if (retryRes.ok) {
              const assetData = await retryRes.json();
              return { fileUrl: assetData.browser_download_url, downloadUrl: assetData.browser_download_url, storageType: 'github-release' };
            }
          }
        }
      }
    }
    throw new Error(`Failed to upload asset to GitHub Release: ${uploadRes.status} ${errText}`);
  }

  const assetData = await uploadRes.json();
  return {
    fileUrl: assetData.browser_download_url,
    downloadUrl: assetData.browser_download_url,
    storageType: 'github-release',
  };
}

async function runIngestionPipeline() {
  const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const year = nowIST.getFullYear();
  const month = String(nowIST.getMonth() + 1).padStart(2, '0');
  const day = String(nowIST.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // Parse optional --date=YYYY-MM-DD from command-line arguments (for manual backfills)
  const dateArg = process.argv.find(arg => arg.startsWith('--date='))?.split('=')[1] ||
                  (process.argv.indexOf('--date') !== -1 ? process.argv[process.argv.indexOf('--date') + 1] : null);

  const targetDateStr = dateArg || todayStr;

  const currentHour = nowIST.getHours();
  const timeLabel = `${String(currentHour).padStart(2, '0')}:00 IST`;

  console.log('\n======================================================');
  console.log('   ALTIUS NEWSPAPER INGESTION WORKER (Zero-Cost Storage)');
  console.log(`   Target Publication Date: ${targetDateStr}${dateArg ? ' [MANUAL BACKFILL MODE]' : ' [SCHEDULED MODE]'}`);
  console.log(`   Execution Time: ${timeLabel}`);
  console.log('======================================================\n');

  // Query Firestore for Target Date Ingestion Status
  const todayDocsSnap = await db.collection('newspapers')
    .where('publicationDate', '==', targetDateStr)
    .get();

  const statusMap = new Map();
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
          readySlugs.add(slug);
          htNeedsUpgrade = true;
        }
      } else {
        readySlugs.add(slug);
      }
    }
  });

  // Early Completion Exit Check
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

  // Identify Missing Categories
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

  // Connect to Telegram MTProto Client
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

  const candidatesMap = new Map();

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
    if (classified.inferredDate !== targetDateStr) continue;

    const slug = classified.slug;
    const isMissing = missingSlugs.includes(slug);
    if (!isMissing) continue;

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

  // Ingest Candidates
  for (const [slug, item] of candidatesMap.entries()) {
    const { msg, doc, filename, classified, msgDateIso } = item;
    const key = classified.uniquenessKey;
    const docRef = db.collection('newspapers').doc(key);
    const existingDocData = statusMap.get(slug);

    if (existingDocData && existingDocData.status === 'ready') {
      const existingPriority = existingDocData.priority ?? 1;
      if (classified.priority >= existingPriority) {
        continue;
      }
      console.log(`🔄 Upgrading ${classified.displayName}: ${existingDocData.edition} (P${existingPriority}) -> ${classified.edition} (P${classified.priority})`);
    }

    console.log(`⬇️ Ingesting [${slug}]: ${filename} (${(doc.size / (1024 * 1024)).toFixed(2)} MB)...`);

    await docRef.set({
      publicationDate: targetDateStr,
      slug,
      displayName: classified.displayName,
      category: classified.category,
      edition: classified.edition,
      status: 'processing',
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    try {
      const buffer = await client.downloadMedia(msg, {});
      if (!buffer) {
        throw new Error(`Media download returned empty buffer for ${filename}`);
      }

      // Store PDF Asset using zero-cost GitHub Releases CDN storage
      const assetRes = await storePdfAsset(targetDateStr, slug, filename, buffer);

      const metadata = {
        publicationDate: targetDateStr,
        category: classified.category,
        slug,
        displayName: classified.displayName,
        edition: classified.edition,
        priority: classified.priority,
        originalTelegramFilename: filename,
        telegramMessageId: msg.id.toString(),
        telegramChannelId: channelId,
        telegramMessageDate: msgDateIso,
        fileUrl: assetRes.fileUrl,
        downloadUrl: assetRes.downloadUrl,
        storageType: assetRes.storageType,
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
      await docRef.set({
        status: 'failed',
        error: err.message,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
  }

  const finalReadyCount = readySlugs.size;
  const isFinalRun = currentHour >= 21;
  const overallStatus = finalReadyCount === 8 ? 'COMPLETE' : isFinalRun ? 'INCOMPLETE (Final Cutoff Passed)' : 'PARTIAL';

  console.log('\n======================================================');
  console.log('   ALTIUS NEWSPAPER INGESTION SUMMARY');
  console.log(`   Date: ${targetDateStr} | Time: ${timeLabel}`);
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

  await executeRetentionCleanup();

  await client.disconnect();
  process.exit(0);
}

/**
 * 10-Day Retention Cleanup
 * Keeps top 10 unique publication dates in descending order.
 * Deletes GitHub Releases and Firestore docs older than 10 dates.
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
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPOSITORY || 'mauryaamit/altius';
  const [owner, repo] = repoFull.split('/');

  for (const expDate of expiredDates) {
    if (token) {
      try {
        const tagName = `epaper-${expDate}`;
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'Altius-Ingestion-Worker',
        };
        const relRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tagName}`, { headers });
        if (relRes.ok) {
          const relData = await relRes.json();
          await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/${relData.id}`, { method: 'DELETE', headers });
          await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/tags/${tagName}`, { method: 'DELETE', headers });
          console.log(`   Deleted GitHub Release ${tagName}`);
        }
      } catch (e) {
        console.error(`   Warning deleting release for ${expDate}:`, e.message);
      }
    }
  }

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.publicationDate && !allowedDates.has(data.publicationDate)) {
      await doc.ref.delete();
      prunedDocCount++;
    }
  }

  console.log(`✅ Cleaned up ${prunedDocCount} expired Firestore records & releases.\n`);
}

runIngestionPipeline().catch(err => {
  console.error('❌ Pipeline Execution Error:', err);
  process.exit(1);
});
