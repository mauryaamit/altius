import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const directUrl = searchParams.get('url');
    const date = searchParams.get('date');
    const slug = searchParams.get('slug');

    let targetUrl = directUrl;

    if (!targetUrl && date && slug) {
      const db = getAdminDb();
      const docRef = db.collection('newspapers').doc(`${date}_${slug}`);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const data = docSnap.data();
        targetUrl = data?.fileUrl || data?.downloadUrl;
      }
    }

    if (!targetUrl) {
      return NextResponse.json(
        { success: false, error: 'Document URL not specified or found.' },
        { status: 404 }
      );
    }

    // Security domain check: Only proxy official GitHub Releases / GitHub CDN / local asset paths
    const isAllowedDomain =
      targetUrl.startsWith('https://github.com/') ||
      targetUrl.startsWith('https://objects.githubusercontent.com/') ||
      targetUrl.startsWith('/newspapers/');

    if (!isAllowedDomain) {
      return NextResponse.json(
        { success: false, error: 'Access denied: URL domain is not authorized.' },
        { status: 403 }
      );
    }

    const headers: Record<string, string> = {
      'User-Agent': 'Altius-Newspaper-Reader/1.0',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(targetUrl, { headers });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch PDF upstream: ${response.statusText}` },
        { status: response.status }
      );
    }

    const blob = await response.arrayBuffer();

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error: any) {
    console.error('[API /api/newspaper/file] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
