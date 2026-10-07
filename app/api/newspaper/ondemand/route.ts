import { NextRequest, NextResponse } from 'next/server';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { classifyDocument, TARGET_NEWSPAPER_SLUGS } from '@/lib/telegram/classifier';

export const dynamic = 'force-dynamic';

export async function HEAD(request: NextRequest) {
  return handleOndemandRequest(request, true);
}

export async function GET(request: NextRequest) {
  return handleOndemandRequest(request, false);
}

async function handleOndemandRequest(request: NextRequest, isHeadOnly: boolean) {
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

    console.log(`\n==================================================`);
    console.log(`[ON-DEMAND RETRIEVAL] Start search`);
    console.log(`[ON-DEMAND RETRIEVAL] Requested date: ${requestedDate}`);
    console.log(`[ON-DEMAND RETRIEVAL] Requested category: ${requestedSlug}`);
    console.log(`==================================================`);

    // 3. Initialize GramJS MTProto Client
    client = new TelegramClient(new StringSession(sessionStr.trim()), apiId, apiHash.trim(), {
      connectionRetries: 3,
      timeout: 10,
    });

    await client.connect();

    const dialogs = await client.getDialogs({});
    const targetDialog = dialogs.find(d => d.title && d.title.toLowerCase().includes('english pass'));

    if (!targetDialog) {
      console.log(`[ON-DEMAND RETRIEVAL] Source channel "${TARGET_CHANNEL_NAME}" not accessible.`);
      await client.disconnect();
      return NextResponse.json(
        { success: false, error: `Source channel "${TARGET_CHANNEL_NAME}" could not be accessed.` },
        { status: 404 }
      );
    }

    // Compute cutoff timestamp (2 days before requestedDate)
    const [reqYear, reqMonth, reqDay] = requestedDate.split('-').map(Number);
    const targetUtcMs = Date.UTC(reqYear, reqMonth - 1, reqDay);
    // 2 days buffer = 2 * 86400 * 1000 = 172800000 ms
    const cutoffTimestampSec = Math.floor((targetUtcMs - 172800000) / 1000);

    const BATCH_SIZE = 100;
    const MAX_MESSAGES_TO_SCAN = 2000;
    let totalMessagesScanned = 0;
    let offsetId = 0;
    let bestCandidate: any = null;
    let batchIndex = 0;

    console.log(`[ON-DEMAND RETRIEVAL] Searching Telegram history...`);

    while (totalMessagesScanned < MAX_MESSAGES_TO_SCAN) {
      batchIndex++;
      const options: any = { limit: BATCH_SIZE };
      if (offsetId > 0) {
        options.offsetId = offsetId;
      }

      const messages = await client.getMessages(targetDialog.entity, options);
      if (!messages || messages.length === 0) {
        console.log(`[ON-DEMAND RETRIEVAL] No more messages returned by Telegram API.`);
        break;
      }

      totalMessagesScanned += messages.length;
      const newestMsgDate = new Date(messages[0].date * 1000).toISOString().substring(0, 10);
      const oldestMsgDate = new Date(messages[messages.length - 1].date * 1000).toISOString().substring(0, 10);

      console.log(
        `[ON-DEMAND RETRIEVAL] Batch ${batchIndex}: Scanned ${messages.length} msgs (Total: ${totalMessagesScanned}) | Date range: ${newestMsgDate} to ${oldestMsgDate}`
      );

      let reachedCutoff = false;

      for (const msg of messages) {
        offsetId = msg.id;

        // Check if message date is prior to cutoff
        if (msg.date < cutoffTimestampSec) {
          reachedCutoff = true;
        }

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

        console.log(
          `[ON-DEMAND RETRIEVAL] Candidate found: "${filename}" | Edition: ${classified.edition} | Priority: ${classified.priority}`
        );

        if (!bestCandidate || classified.priority < bestCandidate.classified.priority) {
          bestCandidate = { msg, doc, filename, classified };
        }

        // If Priority 1 candidate is found (top priority possible), we can stop immediately!
        if (bestCandidate.classified.priority === 1) {
          console.log(`[ON-DEMAND RETRIEVAL] Priority 1 candidate found ("${filename}"). Stopping search immediately.`);
          break;
        }
      }

      // Stop if Priority 1 candidate was found
      if (bestCandidate && bestCandidate.classified.priority === 1) {
        break;
      }

      // Stop if we reached older messages beyond our cutoff
      if (reachedCutoff) {
        console.log(`[ON-DEMAND RETRIEVAL] Reached historical cutoff date (${new Date(cutoffTimestampSec * 1000).toISOString().substring(0, 10)}). Stopping search.`);
        break;
      }
    }

    if (!bestCandidate) {
      console.log(
        `[ON-DEMAND RETRIEVAL] Result: Edition not found for date ${requestedDate} and slug ${requestedSlug} after scanning ${totalMessagesScanned} messages.`
      );
      await client.disconnect();
      return NextResponse.json(
        { success: false, error: 'That edition could not be found in the source channel.' },
        { status: 404 }
      );
    }

    console.log(
      `[ON-DEMAND RETRIEVAL] Selected edition: ${bestCandidate.classified.edition} ("${bestCandidate.filename}")`
    );

    if (isHeadOnly) {
      await client.disconnect();
      console.log(`[ON-DEMAND RETRIEVAL] Preflight HEAD check successful. File size: ${bestCandidate.doc.size || 0} bytes.`);
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': (bestCandidate.doc.size || 0).toString(),
        },
      });
    }

    // 5. Download Stream Buffer & Disconnect
    console.log(`[ON-DEMAND RETRIEVAL] Streaming PDF to client...`);
    const buffer = await client.downloadMedia(bestCandidate.msg, {});
    await client.disconnect();

    if (!buffer) {
      console.error(`[ON-DEMAND RETRIEVAL] Error: Downloaded buffer was empty.`);
      return NextResponse.json(
        { success: false, error: 'Retrieved empty PDF file stream from source.' },
        { status: 500 }
      );
    }

    const uint8Array = new Uint8Array(buffer as Buffer);
    console.log(`[ON-DEMAND RETRIEVAL] PDF stream sent successfully (${uint8Array.length} bytes).`);

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
    console.error('[ON-DEMAND RETRIEVAL] Error:', error);
    return NextResponse.json(
      { success: false, error: "Couldn't retrieve this edition right now. Please try again." },
      { status: 500 }
    );
  }
}
