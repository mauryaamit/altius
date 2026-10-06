import { NextRequest, NextResponse } from 'next/server';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { classifyDocument, TARGET_NEWSPAPER_SLUGS } from '@/lib/telegram/classifier';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  let client: TelegramClient | null = null;

  try {
    const searchParams = request.nextUrl.searchParams;
    const requestedDate = searchParams.get('date');
    const requestedSlug = searchParams.get('slug');

    // 1. Validation
    if (!requestedDate || !/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
      return NextResponse.json(
        { success: false, error: 'Invalid publication date parameter.' },
        { status: 400 }
      );
    }

    if (!requestedSlug || !TARGET_NEWSPAPER_SLUGS.includes(requestedSlug)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or unsupported newspaper category requested.' },
        { status: 400 }
      );
    }

    // 2. Telegram Credentials Check
    const apiIdStr = process.env.TELEGRAM_API_ID;
    const apiHash = process.env.TELEGRAM_API_HASH;
    const sessionStr = process.env.TELEGRAM_SESSION;

    if (!apiIdStr || !apiHash || !sessionStr) {
      return NextResponse.json(
        { success: false, error: 'Telegram connection is temporarily unconfigured on server.' },
        { status: 503 }
      );
    }

    const apiId = parseInt(apiIdStr.trim(), 10);
    const TARGET_CHANNEL_NAME = 'English Pass : All English ePaper in PDF';

    // 3. Initialize GramJS MTProto Client
    client = new TelegramClient(new StringSession(sessionStr.trim()), apiId, apiHash.trim(), {
      connectionRetries: 3,
      timeout: 10,
    });

    await client.connect();

    const dialogs = await client.getDialogs({});
    const targetDialog = dialogs.find(d => d.title && d.title.toLowerCase().includes('english pass'));

    if (!targetDialog) {
      await client.disconnect();
      return NextResponse.json(
        { success: false, error: `Source channel "${TARGET_CHANNEL_NAME}" could not be accessed.` },
        { status: 404 }
      );
    }

    // 4. Scan messages for target candidate
    const messages = await client.getMessages(targetDialog.entity, { limit: 250 });
    let bestCandidate: any = null;

    for (const msg of messages) {
      if (!msg.media || !('document' in msg.media)) continue;
      const doc = (msg.media as any).document;
      let filename = '';
      if (doc && doc.attributes) {
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
      if (classified.inferredDate !== requestedDate) continue;
      if (classified.slug !== requestedSlug) continue;

      if (!bestCandidate || classified.priority < bestCandidate.classified.priority) {
        bestCandidate = { msg, doc, filename, classified };
      }
    }

    if (!bestCandidate) {
      await client.disconnect();
      return NextResponse.json(
        { success: false, error: 'That edition could not be found in the source channel.' },
        { status: 404 }
      );
    }

    // 5. Download Stream Buffer & Disconnect
    const buffer = await client.downloadMedia(bestCandidate.msg, {});
    await client.disconnect();

    if (!buffer) {
      return NextResponse.json(
        { success: false, error: 'Retrieved empty PDF file stream from source.' },
        { status: 500 }
      );
    }

    const uint8Array = new Uint8Array(buffer as Buffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    if (client) {
      try { await client.disconnect(); } catch {}
    }
    console.error('[API /api/newspaper/ondemand] Error:', error);
    return NextResponse.json(
      { success: false, error: "Couldn't retrieve this edition right now. Please try again." },
      { status: 500 }
    );
  }
}
