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

    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const [yearStr, monthStr, dayStr] = requestedDate.split('-');
    const year = parseInt(yearStr, 10);
    const monthIdx = parseInt(monthStr, 10) - 1;
    const dayNum = parseInt(dayStr, 10);

    const monthName = MONTH_NAMES[monthIdx];
    const dayPadded = String(dayNum).padStart(2, '0');
    const dayUnpadded = String(dayNum);

    // Build targeted search queries to leverage Telegram's server-side message index instantly (<200ms)
    const searchQueries = [
      `${dayPadded}-${monthStr}`,          // e.g. "03-10"
      `${yearStr}${monthStr}${dayPadded}`, // e.g. "20261003"
      `${dayPadded} ${monthName}`,         // e.g. "03 Oct"
      `${dayUnpadded} ${monthName}`,       // e.g. "3 Oct"
      `${dayPadded}_${monthStr}`,          // e.g. "03_10"
    ];

    let bestCandidate: any = null;
    const messagesToProcess: any[] = [];
    const seenMsgIds = new Set<number>();

    console.log(`[ON-DEMAND RETRIEVAL] Executing targeted Telegram server search for date ${requestedDate}...`);

    // 1. Run targeted Telegram server-side searches first
    for (const q of searchQueries) {
      if (bestCandidate && bestCandidate.classified.priority === 1) break;
      try {
        const msgs = await client.getMessages(targetDialog.entity, { search: q, limit: 50 });
        for (const m of msgs) {
          if (!seenMsgIds.has(m.id)) {
            seenMsgIds.add(m.id);
            messagesToProcess.push(m);
          }
        }
      } catch (err: any) {
        console.warn(`[ON-DEMAND RETRIEVAL] Query "${q}" warning:`, err?.message);
      }
    }

    // Classify candidates from targeted search
    for (const msg of messagesToProcess) {
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

      if (!classified.shouldRetain) {
        console.log(`[ON-DEMAND RETRIEVAL] Rejected "${filename}": ${classified.reason}`);
        continue;
      }

      if (classified.inferredDate !== requestedDate) {
        console.log(`[ON-DEMAND RETRIEVAL] Date mismatch for "${filename}": inferred ${classified.inferredDate} vs requested ${requestedDate}`);
        continue;
      }

      if (classified.slug !== requestedSlug) {
        continue;
      }

      console.log(
        `[ON-DEMAND RETRIEVAL] Candidate found: "${filename}" | Edition: ${classified.edition} | Priority: ${classified.priority}`
      );

      if (!bestCandidate || classified.priority < bestCandidate.classified.priority) {
        bestCandidate = { msg, doc, filename, classified };
      }

      if (bestCandidate.classified.priority === 1) {
        console.log(`[ON-DEMAND RETRIEVAL] Priority 1 candidate found ("${filename}"). Stopping search.`);
        break;
      }
    }

    // 2. Fallback: If targeted search did not yield a Priority 1 candidate, perform a quick paginated scan
    if (!bestCandidate || bestCandidate.classified.priority > 1) {
      console.log(`[ON-DEMAND RETRIEVAL] Targeted search did not yield Priority 1 match. Running paginated fallback scan...`);
      const targetUtcMs = Date.UTC(year, monthIdx, dayNum);
      const cutoffTimestampSec = Math.floor((targetUtcMs - 172800000) / 1000);

      let offsetId = 0;
      let batchCount = 0;

      while (batchCount < 10) {
        batchCount++;
        const options: any = { limit: 100 };
        if (offsetId > 0) options.offsetId = offsetId;

        const msgs = await client.getMessages(targetDialog.entity, options);
        if (!msgs || msgs.length === 0) break;

        const minId = Math.min(...msgs.map(m => m.id));
        offsetId = minId;

        let reachedCutoff = false;

        for (const msg of msgs) {
          if (msg.date < cutoffTimestampSec) reachedCutoff = true;
          if (!msg.media || !('document' in msg.media)) continue;
          const doc = (msg.media as any).document;
          let filename = '';
          if (doc && doc.attributes) {
            for (const attr of doc.attributes) {
              if (attr.fileName) filename = attr.fileName;
            }
          }
          if (!filename) continue;

          const msgDateIso = new Date(msg.date * 1000).toISOString();
          const classified = classifyDocument(filename, msgDateIso);

          if (!classified.shouldRetain) continue;
          if (classified.inferredDate !== requestedDate) continue;
          if (classified.slug !== requestedSlug) continue;

          console.log(
            `[ON-DEMAND RETRIEVAL] Fallback candidate found: "${filename}" | Edition: ${classified.edition} | Priority: ${classified.priority}`
          );

          if (!bestCandidate || classified.priority < bestCandidate.classified.priority) {
            bestCandidate = { msg, doc, filename, classified };
          }

          if (bestCandidate.classified.priority === 1) break;
        }

        if (bestCandidate && bestCandidate.classified.priority === 1) break;
        if (reachedCutoff) break;
      }
    }

    if (!bestCandidate) {
      console.log(
        `[ON-DEMAND RETRIEVAL] Result: Edition not found for date ${requestedDate} and slug ${requestedSlug}.`
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
