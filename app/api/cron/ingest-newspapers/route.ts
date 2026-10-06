import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

function isAuthorized(request: NextRequest): boolean {
  const cronHeader = request.headers.get('x-vercel-cron-schedule');
  const adminSecret = request.headers.get('x-admin-secret');
  return !!cronHeader || adminSecret === process.env.ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const snapshot = await db.collection('newspapers').limit(10).get();
    const count = snapshot.size;

    return NextResponse.json({
      success: true,
      message: 'Newspaper ingestion status check',
      sampleRecordsFound: count,
      ingestionMethod: 'MTProto Background Worker (scripts/ingest-newspapers.mjs)',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[cron/ingest-newspapers] Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
