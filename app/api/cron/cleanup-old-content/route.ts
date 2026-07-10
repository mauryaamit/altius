import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let dbInstance: ReturnType<typeof getFirestore> | null = null;

function getDb() {
  if (dbInstance) return dbInstance;

  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('[cleanup-old-content] Firebase Admin credentials are not set in environment variables.');
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  }

  dbInstance = getFirestore();
  return dbInstance;
}

// Security check: only Vercel cron or admin secret can invoke this
function isAuthorized(request: NextRequest): boolean {
  const cronHeader = request.headers.get('x-vercel-cron-schedule');
  const adminSecret = request.headers.get('x-admin-secret');
  return !!cronHeader || adminSecret === process.env.ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 150);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  console.log(`[cleanup-old-content] Deleting documents older than: ${cutoffStr}`);

  try {
    const deletedDailyContent = await deleteCollectionOlderThan('daily_content', cutoffStr);
    const deletedLedger = await deleteCollectionOlderThan('content_ledger', cutoffStr);

    return NextResponse.json({
      success: true,
      cutoffDate: cutoffStr,
      deletedCount: {
        daily_content: deletedDailyContent,
        content_ledger: deletedLedger
      }
    });
  } catch (error) {
    console.error('[cleanup-old-content] Failed:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

async function deleteCollectionOlderThan(collectionName: string, cutoffStr: string): Promise<number> {
  const db = getDb();
  let deletedCount = 0;
  let hasMore = true;

  while (hasMore) {
    const snapshot = await db.collection(collectionName)
      .where('date', '<', cutoffStr)
      .limit(500)
      .get();

    if (snapshot.empty) {
      hasMore = false;
      break;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    deletedCount += snapshot.size;
    console.log(`[cleanup-old-content] Deleted ${snapshot.size} docs from ${collectionName}`);

    if (snapshot.size < 500) {
      hasMore = false;
    }
  }

  return deletedCount;
}
