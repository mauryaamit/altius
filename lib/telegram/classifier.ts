/**
 * lib/telegram/classifier.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Deterministic classifier for Telegram e-papers from "English Pass".
 * Identifies 8 target categories with strict rules (e.g. NIE ignore, HT Mumbai priority).
 */

export interface NewspaperTarget {
  slug: string;
  displayName: string;
  category: string;
  edition: string;
  priority: number; // 1 = highest
}

export interface ClassifiedDocument {
  shouldRetain: boolean;
  slug: string;
  displayName: string;
  category: string;
  edition: string;
  priority: number;
  inferredDate: string; // YYYY-MM-DD
  reason: string;
  uniquenessKey: string; // YYYY-MM-DD_slug
}

/**
 * Extract publication date from filename or message date.
 * Filename format examples:
 *  - "The Hindu Delhi 06-10.pdf" -> 2026-10-06
 *  - "HT Mumbai 06-10.pdf" -> 2026-10-06
 *  - "Times of India_TOIDelhiBS-Delhi_20261006.pdf" -> 2026-10-06
 *  - "All International editorial 6 oct 2026.pdf" -> 2026-10-06
 */
export function extractPublicationDate(filename: string, messageDateIso: string): string {
  const fn = filename.trim();

  // Pattern 1: YYYYMMDD (e.g., 20261006)
  const matchYyyymmdd = fn.match(/\b(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\b/);
  if (matchYyyymmdd) {
    return `${matchYyyymmdd[1]}-${matchYyyymmdd[2]}-${matchYyyymmdd[3]}`;
  }

  // Pattern 2: DD-MM (e.g., 06-10 or 06-10-2026)
  const matchDdMmYyyy = fn.match(/\b(0[1-9]|[12]\d|3[01])[-_](0[1-9]|1[0-2])(?:[-_](20\d{2}))?\b/);
  if (matchDdMmYyyy) {
    const day = matchDdMmYyyy[1];
    const month = matchDdMmYyyy[2];
    const year = matchDdMmYyyy[3] || new Date(messageDateIso).getFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  // Pattern 3: Text month e.g. "6 oct 2026" or "06 Oct 2026"
  const months: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };
  const matchTextDate = fn.match(/\b([1-9]|0[1-9]|[12]\d|3[01])\s+([a-zA-Z]{3,9})\s+(20\d{2})\b/i);
  if (matchTextDate) {
    const day = matchTextDate[1].padStart(2, '0');
    const mStr = matchTextDate[2].substring(0, 3).toLowerCase();
    const month = months[mStr] || '01';
    const year = matchTextDate[3];
    return `${year}-${month}-${day}`;
  }

  // Fallback to message creation date in Asia/Kolkata (YYYY-MM-DD)
  if (messageDateIso) {
    try {
      const d = new Date(messageDateIso);
      const istStr = d.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      const istDate = new Date(istStr);
      const y = istDate.getFullYear();
      const m = String(istDate.getMonth() + 1).padStart(2, '0');
      const day = String(istDate.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch {
      return messageDateIso.substring(0, 10);
    }
  }

  const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const y = nowIST.getFullYear();
  const m = String(nowIST.getMonth() + 1).padStart(2, '0');
  const d = String(nowIST.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Deterministic classifier function for incoming Telegram documents.
 */
export function classifyDocument(filename: string, messageDateIso: string): ClassifiedDocument {
  const fn = filename.trim();
  const lower = fn.toLowerCase();
  const inferredDate = extractPublicationDate(fn, messageDateIso);

  // Helper builder
  const buildResult = (
    shouldRetain: boolean,
    slug: string,
    displayName: string,
    category: string,
    edition: string,
    priority: number,
    reason: string
  ): ClassifiedDocument => ({
    shouldRetain,
    slug,
    displayName,
    category,
    edition,
    priority,
    inferredDate,
    reason,
    uniquenessKey: `${inferredDate}_${slug}`,
  });

  // 1. Extension Check
  if (!lower.endsWith('.pdf')) {
    return buildResult(false, 'ignore', 'Ignore', 'IGNORE', 'none', 99, 'Non-PDF file');
  }

  // 2. Strict Ignore: NIE / New Indian Express
  if (lower.includes('nie') || lower.includes('new indian express')) {
    return buildResult(false, 'ignore', 'Ignore', 'IGNORE', 'none', 99, 'NIE (The New Indian Express) is strictly ignored');
  }

  // 3. International Editorial
  if (lower.includes('international editorial')) {
    return buildResult(true, 'international-editorial', 'International Editorial', 'International Editorial', 'global', 1, 'Target: International Editorial');
  }

  // 3b. All English Editorials
  if (lower.includes('all english editorial') || lower.includes('all english editorials')) {
    return buildResult(true, 'all-english-editorials', 'All English Editorials', 'All English Editorials', 'global', 1, 'Target: All English Editorials');
  }

  // 3c. Daily Vocabulary
  if (lower.includes('daily vocabulary') || (lower.includes('vocabulary') && !lower.includes('hindu'))) {
    return buildResult(true, 'daily-vocabulary', 'Daily Vocabulary', 'Daily Vocabulary', 'global', 1, 'Target: Daily Vocabulary');
  }

  // 4. Hindi Editorial
  if (lower.includes('hindi editorial')) {
    return buildResult(true, 'hindi-editorial', 'Hindi Editorial', 'Hindi Editorial', 'national', 1, 'Target: Hindi Editorial');
  }

  // Helper to determine edition priority (Mumbai P1 -> Delhi P2 -> Main/National P2 -> Regional P3)
  const getEditionInfo = (str: string) => {
    if (str.includes('mumbai') || str.startsWith('th-mumbai')) return { edition: 'mumbai', priority: 1 };
    if (str.includes('delhi') || str.startsWith('th-delhi')) return { edition: 'delhi', priority: 2 };
    return { edition: 'main', priority: 2 };
  };

  // Common exclusion check for supplements, city pull-outs, and school editions
  const isSupplementOrSubEdition =
    lower.includes('school') ||
    lower.includes('city') ||
    lower.includes('supplement') ||
    lower.includes('epaper city');

  // 5. The Hindu (Exclude HT / Tamil / Hindi / Analysis / non-newspaper supplements)
  if ((lower.includes('hindu') || lower.startsWith('th-') || lower.startsWith('th ')) && !lower.includes('hindustan') && !lower.includes('tamil')) {
    if (lower.includes('analysis') || lower.includes('in hindi') || isSupplementOrSubEdition) {
      return buildResult(false, 'the-hindu', 'The Hindu', 'The Hindu', 'sub-edition', 99, 'Excluded Hindu analysis/Hindi/supplement');
    }
    const { edition, priority } = getEditionInfo(lower);
    return buildResult(true, 'the-hindu', 'The Hindu', 'The Hindu', edition, priority, `Target: The Hindu (${edition})`);
  }

  // 6. The Indian Express (Exclude NIE)
  if (lower.startsWith('ie-') || lower.startsWith('ie ') || lower.includes('indian express')) {
    if (isSupplementOrSubEdition) return buildResult(false, 'indian-express', 'The Indian Express', 'The Indian Express', 'sub-edition', 99, 'Excluded IE sub-edition/supplement');
    const { edition, priority } = getEditionInfo(lower);
    return buildResult(true, 'indian-express', 'The Indian Express', 'The Indian Express', edition, priority, `Target: The Indian Express (${edition})`);
  }

  // 7. Mint
  if (lower.includes('mint')) {
    if (isSupplementOrSubEdition) return buildResult(false, 'mint', 'Mint', 'Mint', 'sub-edition', 99, 'Excluded Mint sub-edition/supplement');
    const { edition, priority } = getEditionInfo(lower);
    return buildResult(true, 'mint', 'Mint', 'Mint', edition, priority, `Target: Mint (${edition})`);
  }

  // 8. Economic Times
  if (lower.startsWith('et-') || lower.startsWith('et ') || lower.includes('economic times')) {
    if (isSupplementOrSubEdition) return buildResult(false, 'economic-times', 'Economic Times', 'Economic Times', 'sub-edition', 99, 'Excluded ET sub-edition/supplement');
    const { edition, priority } = getEditionInfo(lower);
    return buildResult(true, 'economic-times', 'Economic Times', 'Economic Times', edition, priority, `Target: Economic Times (${edition})`);
  }

  // 9. Times of India
  if (lower.startsWith('toi-') || lower.startsWith('toi ') || lower.includes('times of india')) {
    if (isSupplementOrSubEdition) return buildResult(false, 'times-of-india', 'Times of India', 'Times of India', 'sub-edition', 99, 'Excluded TOI sub-edition/supplement');
    const { edition, priority } = getEditionInfo(lower);
    return buildResult(true, 'times-of-india', 'Times of India', 'Times of India', edition, priority, `Target: Times of India (${edition})`);
  }

  // 10. Hindustan Times (Strict Priority: Mumbai P1 -> Delhi Main P2)
  if (lower.startsWith('ht ') || lower.includes('hindustan times') || lower.startsWith('ht-') || lower.startsWith('ht_')) {
    // Exclude sub-editions, school, city supplements
    if (
      lower.includes('school') ||
      lower.includes('city') ||
      lower.includes('gurugram') ||
      lower.includes('noida') ||
      lower.includes('chandigarh') ||
      lower.includes('pune') ||
      lower.includes('ranchi') ||
      lower.includes('patna') ||
      lower.includes('lucknow')
    ) {
      return buildResult(false, 'hindustan-times', 'Hindustan Times', 'Hindustan Times', 'sub-edition', 99, 'Excluded HT sub/regional edition');
    }

    if (lower.includes('mumbai')) {
      return buildResult(true, 'hindustan-times', 'Hindustan Times', 'Hindustan Times', 'mumbai', 1, 'Target: HT Mumbai (Priority 1)');
    }

    if (lower.includes('delhi')) {
      return buildResult(true, 'hindustan-times', 'Hindustan Times', 'Hindustan Times', 'delhi', 2, 'Target: HT Delhi Main (Priority 2 Fallback)');
    }

    return buildResult(false, 'hindustan-times', 'Hindustan Times', 'Hindustan Times', 'other', 99, 'Non-target HT edition');
  }

  // 11. Default Ignore
  return buildResult(false, 'ignore', 'Ignore', 'IGNORE', 'none', 99, 'Unrelated publication');
}

/**
 * List of all 10 target slugs in order.
 */
export const TARGET_NEWSPAPER_SLUGS = [
  'the-hindu',
  'indian-express',
  'mint',
  'economic-times',
  'times-of-india',
  'hindustan-times',
  'international-editorial',
  'hindi-editorial',
  'all-english-editorials',
  'daily-vocabulary',
];
