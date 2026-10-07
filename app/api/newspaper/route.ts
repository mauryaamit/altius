import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
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
  'all-english-editorials': { displayName: 'All English Editorials', category: 'All English Editorials' },
  'daily-vocabulary': { displayName: 'Daily Vocabulary', category: 'Daily Vocabulary' },
};

export async function GET(request: NextRequest) {
  try {
    const db = getAdminDb();
    const searchParams = request.nextUrl.searchParams;
    const requestedDate = searchParams.get('date');

    // Fetch all records from 'newspapers' collection (lightweight metadata)
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
    const sortedStoredDates = Array.from(datesSet).sort((a, b) => b.localeCompare(a));
    const todayDate = sortedStoredDates[0] || new Date().toISOString().substring(0, 10);
    const previousDate = sortedStoredDates[1] || null;

    // Helper to build 8 target cards for a given date
    const buildCardsForDate = (dateStr: string) => {
      const dateDocs = docsByDate[dateStr] || {};
      return TARGET_NEWSPAPER_SLUGS.map(slug => {
        const doc = dateDocs[slug];
        const meta = TARGET_METADATA[slug] || { displayName: slug, category: slug };

        if (!doc || doc.status !== 'ready') {
          return {
            slug,
            displayName: meta.displayName,
            category: meta.category,
            publicationDate: dateStr,
            edition: 'none',
            status: 'not_available',
            fileUrl: null,
            fileSize: 0,
            isStored: true,
          };
        }

        const rawFileUrl = doc.fileUrl || doc.downloadUrl;
        const fileUrl = rawFileUrl ? `/api/newspaper/file?url=${encodeURIComponent(rawFileUrl)}` : `/api/newspaper/file?date=${dateStr}&slug=${slug}`;

        return {
          slug: doc.slug || slug,
          displayName: doc.displayName || meta.displayName,
          category: doc.category || meta.category,
          publicationDate: doc.publicationDate || dateStr,
          edition: doc.edition || 'main',
          status: 'ready',
          fileUrl,
          originalTelegramFilename: doc.originalTelegramFilename || null,
          fileSize: doc.fileSize || 0,
          ingestedAt: doc.ingestedAt || null,
          isStored: true,
        };
      });
    };

    // If specific requestedDate parameter is passed for single-date query
    if (requestedDate) {
      const isStored = sortedStoredDates.includes(requestedDate);
      if (isStored) {
        return NextResponse.json({
          success: true,
          requestedDate,
          isStored: true,
          newspapers: buildCardsForDate(requestedDate),
        });
      } else {
        // Return lightweight metadata for on-demand target cards
        const ondemandCards = TARGET_NEWSPAPER_SLUGS.map(slug => {
          const meta = TARGET_METADATA[slug] || { displayName: slug, category: slug };
          return {
            slug,
            displayName: meta.displayName,
            category: meta.category,
            publicationDate: requestedDate,
            edition: 'source',
            status: 'ready_ondemand',
            fileUrl: `/api/newspaper/ondemand?date=${requestedDate}&slug=${slug}`,
            fileSize: 0,
            isStored: false,
          };
        });

        return NextResponse.json({
          success: true,
          requestedDate,
          isStored: false,
          newspapers: ondemandCards,
        });
      }
    }

    // Default metadata payload for /newspaper landing page
    return NextResponse.json({
      success: true,
      todayDate,
      todayNewspapers: buildCardsForDate(todayDate),
      previousDate,
      previousNewspapers: previousDate ? buildCardsForDate(previousDate) : [],
      storedDates: sortedStoredDates.slice(0, 2),
    });
  } catch (error: any) {
    console.error('[API /api/newspaper] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to load newspaper metadata.' },
      { status: 500 }
    );
  }
}
