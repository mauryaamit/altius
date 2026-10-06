import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminStorageBucket } from '@/lib/firebase-admin';
import { TARGET_NEWSPAPER_SLUGS } from '@/lib/telegram/classifier';

export const dynamic = 'force-dynamic';

const TARGET_METADATA: Record<string, { displayName: string; category: string }> = {
  'the-hindu': { displayName: 'The Hindu', category: 'The Hindu' },
  'indian-express': { displayName: 'The Indian Express', category: 'The Indian Express' },
  'mint': { displayName: 'Mint', category: 'Mint' },
  'economic-times': { displayName: 'Economic Times', category: 'Economic Times' },
  'times-of-india': { displayName: 'Times of India', category: 'Times of India' },
  'hindustan-times': { displayName: 'Hindustan Times', category: 'Hindustan Times' },
  'international-editorial': { displayName: 'International Editorial', category: 'International Editorial' },
  'hindi-editorial': { displayName: 'Hindi Editorial', category: 'Hindi Editorial' },
};

export async function GET(request: NextRequest) {
  try {
    const db = getAdminDb();
    const bucket = getAdminStorageBucket();

    const searchParams = request.nextUrl.searchParams;
    const requestedDate = searchParams.get('date');

    // Fetch all records from 'newspapers' collection
    const snapshot = await db.collection('newspapers').get();

    // Group documents by date and slug
    const docsByDate: Record<string, Record<string, any>> = {};
    const datesSet = new Set<string>();

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const pubDate = data.publicationDate;
      const slug = data.slug;
      if (pubDate && slug) {
        datesSet.add(pubDate);
        if (!docsByDate[pubDate]) docsByDate[pubDate] = {};
        docsByDate[pubDate][slug] = data;
      }
    });

    // Sorted dates descending (newest first)
    const availableDates = Array.from(datesSet).sort((a, b) => b.localeCompare(a)).slice(0, 10);

    const activeDate = requestedDate || (availableDates[0] || new Date().toISOString().substring(0, 10));
    const activeDateDocs = docsByDate[activeDate] || {};

    // Build array of 8 target cards for activeDate
    const newspapers = await Promise.all(
      TARGET_NEWSPAPER_SLUGS.map(async slug => {
        const doc = activeDateDocs[slug];
        const meta = TARGET_METADATA[slug] || { displayName: slug, category: slug };

        if (!doc) {
          return {
            slug,
            displayName: meta.displayName,
            category: meta.category,
            publicationDate: activeDate,
            edition: 'none',
            status: 'not_available',
            fileUrl: null,
            originalTelegramFilename: null,
            fileSize: 0,
          };
        }

        // Generate signed URL valid for 24 hours
        let fileUrl = null;
        if (doc.storagePath) {
          try {
            const [url] = await bucket.file(doc.storagePath).getSignedUrl({
              action: 'read',
              expires: Date.now() + 24 * 60 * 60 * 1000,
            });
            fileUrl = url;
          } catch (e) {
            // Fallback to public storage URL
            fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(doc.storagePath)}?alt=media`;
          }
        }

        return {
          slug: doc.slug || slug,
          displayName: doc.displayName || meta.displayName,
          category: doc.category || meta.category,
          publicationDate: doc.publicationDate || activeDate,
          edition: doc.edition || 'main',
          status: 'ready',
          fileUrl,
          originalTelegramFilename: doc.originalTelegramFilename || null,
          fileSize: doc.fileSize || 0,
          ingestedAt: doc.ingestedAt || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      selectedDate: activeDate,
      availableDates,
      newspapers,
    });
  } catch (error: any) {
    console.error('[API /api/newspaper] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
