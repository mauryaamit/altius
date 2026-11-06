'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Download,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  Bookmark,
  RotateCcw,
  Loader2,
  ArrowUpRight,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface NewspaperCard {
  slug: string;
  displayName: string;
  category: string;
  publicationDate: string;
  edition: string;
  status: string;
  fileUrl: string | null;
  fileSize: number;
  isStored: boolean;
}

interface MetadataResponse {
  success: boolean;
  todayDate: string;
  todayNewspapers: NewspaperCard[];
  previousDate: string | null;
  previousNewspapers: NewspaperCard[];
  storedDates: string[];
  error?: string;
}

const CORE_SLUGS = [
  'the-hindu',
  'indian-express',
  'mint',
  'economic-times',
  'times-of-india',
  'hindustan-times',
  'international-editorial',
  'hindi-editorial',
];

const SUPPLEMENTARY_SLUGS = [
  'all-english-editorials',
  'daily-vocabulary',
];

interface PublicationCuratorial {
  rubric: string;
  kicker: string;
  description: string;
}

const PUBLICATION_CURATION: Record<string, PublicationCuratorial> = {
  'the-hindu': {
    rubric: 'National Broadsheet',
    kicker: 'Flagship Edition of Record',
    description: 'Constitutional affairs, landmark Supreme Court coverage, governance discourse, and institutional policy critique.',
  },
  'indian-express': {
    rubric: 'National Journal',
    kicker: 'Journalism of Courage',
    description: 'Signature "Explained" analytical journalism, investigative field reporting, and rigorous public governance critique.',
  },
  'mint': {
    rubric: 'Financial Press',
    kicker: 'Markets, VC & Strategy',
    description: 'Corporate balance sheets, venture funding ecosystems, executive strategy, macro-policy, and technology disruption.',
  },
  'economic-times': {
    rubric: 'Business Daily',
    kicker: 'Industrial & Monetary Record',
    description: 'Capital markets, Reserve Bank monetary policy, banking infrastructure, manufacturing, and international trade economics.',
  },
  'times-of-india': {
    rubric: 'National Broadsheet',
    kicker: 'Comprehensive Daily',
    description: 'Broad-spectrum national headlines, civic and metropolitan governance, commerce updates, and global affairs.',
  },
  'hindustan-times': {
    rubric: 'National Daily',
    kicker: 'Public Affairs & Politics',
    description: 'National political pulse, northern metropolitan coverage, economic briefs, and strategic diplomatic developments.',
  },
  'international-editorial': {
    rubric: 'Global Geopolitics',
    kicker: 'Foreign Policy & Diplomacy',
    description: 'Selected international commentary from global editorial boards on geopolitics, multilateral treaties, and trade alliances.',
  },
  'hindi-editorial': {
    rubric: 'National Opinion',
    kicker: 'Rashtriya Vimarsh',
    description: 'Curated Hindi-language editorial perspectives on socio-economic development, civil governance, and cultural discourse.',
  },
  'all-english-editorials': {
    rubric: 'Executive Reading',
    kicker: 'Consolidated Op-Ed Deck',
    description: 'Consolidated daily opinion columns and editorial pages across all leading Indian broadsheets. Engineered for VARC and essay synthesis.',
  },
  'daily-vocabulary': {
    rubric: 'Lexicon Masterclass',
    kicker: 'Executive Verbal Aptitude',
    description: 'High-frequency analytical vocabulary extracted from today\'s press, annotated with root etymology, synonyms, and contextual usage.',
  },
};

export default function NewspaperPage() {
  const [data, setData] = useState<MetadataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active view date mode: 'today' | 'yesterday' | 'archive'
  const [activeDateMode, setActiveDateMode] = useState<'today' | 'yesterday' | 'archive'>('today');
  
  // Historical archive picker state
  const [selectedArchiveDate, setSelectedArchiveDate] = useState<string>('');
  const [archiveCards, setArchiveCards] = useState<NewspaperCard[]>([]);
  const [archiveLoading, setArchiveLoading] = useState<boolean>(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  useEffect(() => {
    fetchMainMetadata();
  }, []);

  const fetchMainMetadata = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/newspaper');
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || 'Unable to connect to the newspaper reading desk.');
      }
    } catch {
      setError('Network communication failed while connecting to the newspaper desk.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalDate = async (dateVal: string) => {
    if (!dateVal || !/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) return;
    setArchiveLoading(true);
    setArchiveError(null);
    try {
      const res = await fetch(`/api/newspaper?date=${dateVal}`);
      const json = await res.json();
      if (json.success && json.newspapers) {
        setArchiveCards(json.newspapers);
        setActiveDateMode('archive');
      } else {
        setArchiveError(json.error || `No editions recorded for ${dateVal}.`);
      }
    } catch {
      setArchiveError('Network error while retrieving historical edition metadata.');
    } finally {
      setArchiveLoading(false);
    }
  };

  const handleArchiveDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedArchiveDate(val);
    if (val) {
      fetchHistoricalDate(val);
    }
  };

  // Formatted date string for masthead dateline (e.g. "FRIDAY, NOVEMBER 6, 2026")
  const formatMastheadDate = (dateStr?: string) => {
    if (!dateStr) return 'CURRENT EDITION';
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).toUpperCase();
    } catch {
      return dateStr;
    }
  };

  // Short label for pills (e.g. "6 Nov 2026")
  const formatShortDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  // Active publications depending on chosen mode
  const currentDisplayedCards = useMemo(() => {
    if (activeDateMode === 'yesterday') {
      return {
        dateStr: data?.previousDate || '',
        core: (data?.previousNewspapers || []).filter((p) => CORE_SLUGS.includes(p.slug)),
        supp: (data?.previousNewspapers || []).filter((p) => SUPPLEMENTARY_SLUGS.includes(p.slug)),
        isHistorical: false,
      };
    }
    if (activeDateMode === 'archive' && archiveCards.length > 0) {
      return {
        dateStr: selectedArchiveDate,
        core: archiveCards.filter((p) => CORE_SLUGS.includes(p.slug)),
        supp: archiveCards.filter((p) => SUPPLEMENTARY_SLUGS.includes(p.slug)),
        isHistorical: true,
      };
    }
    // Default 'today'
    return {
      dateStr: data?.todayDate || '',
      core: (data?.todayNewspapers || []).filter((p) => CORE_SLUGS.includes(p.slug)),
      supp: (data?.todayNewspapers || []).filter((p) => SUPPLEMENTARY_SLUGS.includes(p.slug)),
      isHistorical: false,
    };
  }, [activeDateMode, data, archiveCards, selectedArchiveDate]);

  const renderNewspaperCard = (paper: NewspaperCard, isHistorical: boolean = false) => {
    const isAvailable = paper.status === 'ready' || paper.status === 'ready_ondemand';
    const hasDownloadUrl = Boolean(paper.fileUrl);
    const fileSizeMB = paper.fileSize > 0 ? `${(paper.fileSize / (1024 * 1024)).toFixed(1)} MB` : null;
    const curation = PUBLICATION_CURATION[paper.slug] || {
      rubric: 'National Publication',
      kicker: 'Daily Edition',
      description: 'Comprehensive journalistic coverage and daily editorial discourse.',
    };

    const targetReaderHref = isHistorical
      ? `/newspaper/${paper.publicationDate}/${paper.slug}?mode=ondemand`
      : `/newspaper/${paper.publicationDate}/${paper.slug}`;

    return (
      <article
        key={paper.slug}
        className="group relative flex flex-col justify-between bg-white border border-[#E7E2D6] hover:border-[#1A1815] transition-all duration-200 rounded-lg p-6 shadow-xs hover:shadow-md"
      >
        <div>
          {/* Card Top Rubric Row */}
          <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#F0ECE1]">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#786E5E]">
              {curation.rubric}
            </span>

            {/* Edition badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#F5F1E8] text-[#544D42] border border-[#E0D8C8]">
              {paper.edition && paper.edition !== 'none' && paper.edition !== 'source'
                ? `${paper.edition} edition`
                : 'National'}
            </span>
          </div>

          {/* Publication Title */}
          <h3 className="font-display text-[26px] md:text-[28px] font-semibold text-[#181512] leading-[1.12] tracking-tight group-hover:text-[#801826] transition-colors mb-2">
            {paper.displayName}
          </h3>

          {/* Kicker */}
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#8A1C2C] font-semibold mb-2.5">
            {curation.kicker}
          </p>

          {/* Description */}
          <p className="font-sans text-[13px] text-[#5C5549] leading-relaxed mb-6">
            {curation.description}
          </p>
        </div>

        {/* Card Action & Status Footer */}
        <div className="pt-4 border-t border-[#F0ECE1] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailable ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'
              }`}
            />
            <span className="font-mono text-[11px] text-[#736C5F] font-medium">
              {fileSizeMB ? fileSizeMB : isAvailable ? 'Stream' : 'Pending'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasDownloadUrl && (
              <a
                href={paper.fileUrl || '#'}
                download={`${paper.slug}-${paper.publicationDate}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                title="Direct PDF download"
                className="p-2 text-[#786E5E] hover:text-[#181512] hover:bg-[#F3EFE6] rounded transition-colors"
                aria-label={`Download ${paper.displayName} PDF`}
              >
                <Download size={14} />
              </a>
            )}

            {isAvailable ? (
              <Link
                href={targetReaderHref}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-sans font-medium text-white bg-[#1A1815] hover:bg-[#801826] transition-colors shadow-xs"
              >
                Read Edition <ArrowRight size={12} />
              </Link>
            ) : (
              <span className="text-xs font-mono text-slate-400 italic">Not Ready</span>
            )}
          </div>
        </div>
      </article>
    );
  };

  const renderSupplementaryCard = (paper: NewspaperCard, isHistorical: boolean = false) => {
    const isAvailable = paper.status === 'ready' || paper.status === 'ready_ondemand';
    const hasDownloadUrl = Boolean(paper.fileUrl);
    const fileSizeMB = paper.fileSize > 0 ? `${(paper.fileSize / (1024 * 1024)).toFixed(1)} MB` : null;
    const curation = PUBLICATION_CURATION[paper.slug] || {
      rubric: 'Executive Reading',
      kicker: 'Curated Compendium',
      description: 'Daily executive synthesis of opinion pieces and vocabulary mastery.',
    };

    const targetReaderHref = isHistorical
      ? `/newspaper/${paper.publicationDate}/${paper.slug}?mode=ondemand`
      : `/newspaper/${paper.publicationDate}/${paper.slug}`;

    return (
      <article
        key={paper.slug}
        className="group relative flex flex-col justify-between bg-white border border-[#DDD5C5] hover:border-[#801826] transition-all duration-200 rounded-lg p-7 shadow-xs hover:shadow-md"
      >
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE3D4]">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-widest text-[#801826]">
              <Bookmark size={12} className="text-[#801826]" />
              {curation.rubric}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#736C5F] bg-[#F5F0E6] px-2 py-0.5 rounded border border-[#E0D8C8]">
              Curated Docket
            </span>
          </div>

          <h3 className="font-display text-[28px] md:text-[32px] font-semibold text-[#181512] leading-tight tracking-tight group-hover:text-[#801826] transition-colors mb-2">
            {paper.displayName}
          </h3>

          <p className="font-mono text-xs uppercase tracking-wider text-[#8A1C2C] font-semibold mb-3">
            {curation.kicker}
          </p>

          <p className="font-sans text-[13px] text-[#5C5549] leading-relaxed mb-6">
            {curation.description}
          </p>
        </div>

        <div className="pt-4 border-t border-[#EAE3D4] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailable ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'
              }`}
            />
            <span className="font-mono text-[11px] text-[#736C5F]">
              {fileSizeMB ? `${fileSizeMB} • PDF` : 'Digital Edition'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasDownloadUrl && (
              <a
                href={paper.fileUrl || '#'}
                download={`${paper.slug}-${paper.publicationDate}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                title="Direct PDF download"
                className="p-2 text-[#786E5E] hover:text-[#181512] hover:bg-[#EFE9DC] rounded transition-colors"
                aria-label={`Download ${paper.displayName} PDF`}
              >
                <Download size={14} />
              </a>
            )}

            {isAvailable ? (
              <Link
                href={targetReaderHref}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-sans font-semibold text-white bg-[#801826] hover:bg-[#68121E] transition-colors shadow-xs"
              >
                Open Compendium <ArrowRight size={13} />
              </Link>
            ) : (
              <span className="text-xs font-mono text-slate-400 italic">Not Ready</span>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1815] antialiased selection:bg-[#F3EFE6] selection:text-[#1A1815]">
      {/* ─── HERITAGE BROADSHEET HEADER & MASTHEAD ───────────────────────── */}
      <header className="border-b border-[#DDD5C5] bg-[#FBF9F5]">
        {/* Top Context Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-[11px] font-mono tracking-wider text-[#736C5F] border-b border-[#EDE6D8]">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hover:text-[#1A1815] transition-colors flex items-center gap-1 text-[#544D42]"
            >
              ← Back to Desk
            </Link>
            <span className="hidden sm:inline text-[#DDD5C5]">|</span>
            <span className="hidden sm:inline font-sans uppercase">Altius Executive Reading Library</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              6 AM – 9 PM IST Ingestion Live
            </span>
          </div>
        </div>

        {/* Central Masthead */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#801826] font-bold mb-2">
            THE BROADSHEET & FINANCIAL DESK
          </p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold text-[#161412] tracking-[-0.02em] leading-[0.95] mb-4">
            The Newspaper Room
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#5C5549] max-w-2xl mx-auto leading-relaxed">
            Curated daily national broadsheets, corporate financial dailies, and executive editorial compendiums.
          </p>
        </div>

        {/* Broadsheet Dateline Bar with Double Hairline Rules */}
        <div className="border-t-2 border-b border-[#2C241E] bg-[#FAF7F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            {/* Dateline Date */}
            <div className="flex items-center gap-2 font-mono uppercase font-bold text-[#1A1815] tracking-wider text-xs">
              <Calendar size={13} className="text-[#801826]" />
              <span>{formatMastheadDate(currentDisplayedCards.dateStr)}</span>
            </div>

            {/* Edition Switcher Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => {
                  setActiveDateMode('today');
                  setArchiveError(null);
                }}
                className={`px-3 py-1.5 rounded font-mono text-[11px] uppercase font-bold tracking-wider transition-all ${
                  activeDateMode === 'today'
                    ? 'bg-[#1A1815] text-[#FAF7F0] shadow-xs'
                    : 'bg-[#EFE9DC] text-[#544D42] hover:bg-[#E5DFD1]'
                }`}
              >
                Today ({formatShortDate(data?.todayDate)})
              </button>

              {data?.previousDate && (
                <button
                  onClick={() => {
                    setActiveDateMode('yesterday');
                    setArchiveError(null);
                  }}
                  className={`px-3 py-1.5 rounded font-mono text-[11px] uppercase font-bold tracking-wider transition-all ${
                    activeDateMode === 'yesterday'
                      ? 'bg-[#1A1815] text-[#FAF7F0] shadow-xs'
                      : 'bg-[#EFE9DC] text-[#544D42] hover:bg-[#E5DFD1]'
                  }`}
                >
                  Yesterday ({formatShortDate(data.previousDate)})
                </button>
              )}

              {/* Archive Date Input */}
              <div className="relative inline-flex items-center">
                <input
                  id="archive-date-input"
                  type="date"
                  max={data?.todayDate || new Date().toISOString().substring(0, 10)}
                  value={selectedArchiveDate}
                  onChange={handleArchiveDateSelect}
                  aria-label="Select archive date"
                  className="font-mono text-[11px] uppercase font-semibold text-[#1A1815] bg-[#EFE9DC] hover:bg-[#E5DFD1] border border-[#DDD5C5] rounded px-2.5 py-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#801826] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Archive Active Notice Banner */}
        {activeDateMode === 'archive' && (
          <div className="mb-8 p-4 bg-[#F2EDE2] border-l-4 border-[#801826] rounded-r-lg flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold text-[#181512]">
                Archive Edition: {formatMastheadDate(selectedArchiveDate)}
              </p>
              <p className="font-sans text-xs text-[#5C5549] mt-0.5">
                Displaying historical dockets retrieved directly via Telegram MTProto stream.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveDateMode('today');
                setSelectedArchiveDate('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-[#DDD5C5] text-xs font-mono font-semibold text-[#1A1815] hover:border-[#801826] transition-colors"
            >
              <RotateCcw size={12} /> Return to Today
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {(loading || archiveLoading) && (
          <div className="space-y-12">
            <div className="h-6 w-64 bg-[#EFE9DC] animate-pulse rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-64 bg-[#F3EFE6] border border-[#E7E2D6] rounded-lg animate-pulse p-6" />
              ))}
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {(error || archiveError) && !loading && !archiveLoading && (
          <div className="mb-8 p-6 bg-[#FDF2F2] border border-[#F87171] rounded-lg text-[#991B1B]">
            <h3 className="font-display text-lg font-semibold mb-1">Notice from Newspaper Desk</h3>
            <p className="font-sans text-sm">{error || archiveError}</p>
          </div>
        )}

        {/* Primary Content when Loaded */}
        {!loading && !archiveLoading && !error && (
          <div className="space-y-16">
            {/* ─── SECTION 1: CORE BROADSHEETS (8 EDITIONS) ────────────── */}
            <section aria-labelledby="core-broadsheets-heading">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 mb-8 border-b border-[#E7E2D6]">
                <div>
                  <h2
                    id="core-broadsheets-heading"
                    className="font-display text-2xl sm:text-3xl font-semibold text-[#181512] tracking-tight"
                  >
                    {activeDateMode === 'today'
                      ? "Today's Broadsheets & Financial Press"
                      : activeDateMode === 'yesterday'
                      ? "Yesterday's Broadsheet Archive"
                      : `Archive Broadsheets (${formatShortDate(selectedArchiveDate)})`}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-[#736C5F] mt-1">
                    India's leading national dailies, business records, and international editorial briefs.
                  </p>
                </div>

                <span className="font-mono text-xs text-[#736C5F]">
                  8 Categories • Full Editions
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentDisplayedCards.core.map((paper) =>
                  renderNewspaperCard(paper, currentDisplayedCards.isHistorical)
                )}
              </div>
            </section>

            {/* ─── SECTION 2: SUPPLEMENTARY READING DESK (2 COLLECTIONS) ─ */}
            {currentDisplayedCards.supp.length > 0 && (
              <section
                aria-labelledby="supplementary-reading-heading"
                className="bg-[#F6F2E9] border border-[#DDD5C5] rounded-xl p-6 sm:p-8 md:p-10"
              >
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 pb-4 mb-8 border-b border-[#E3DC CE] border-opacity-70">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles size={14} className="text-[#801826]" />
                      <span className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-[#801826]">
                        CURATED SYNTHESIS
                      </span>
                    </div>
                    <h2
                      id="supplementary-reading-heading"
                      className="font-display text-2xl sm:text-3xl font-semibold text-[#181512] tracking-tight"
                    >
                      Supplementary Reading & Verbal Masterclass
                    </h2>
                    <p className="font-sans text-xs sm:text-sm text-[#5C5549] mt-1 max-w-2xl">
                      Full-spectrum editorial opinions consolidated across all major national broadsheets, paired with executive vocabulary compilations.
                    </p>
                  </div>

                  <span className="font-mono text-xs font-semibold text-[#801826] bg-[#EDE6D8] px-3 py-1 rounded border border-[#DDD5C5] self-start md:self-auto">
                    2 Specialized Dockets
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentDisplayedCards.supp.map((paper) =>
                    renderSupplementaryCard(paper, currentDisplayedCards.isHistorical)
                  )}
                </div>
              </section>
            )}

            {/* ─── SECTION 3: YESTERDAY QUICK-ACCESS PREVIEW (when on Today mode) ─ */}
            {activeDateMode === 'today' && data?.previousDate && (
              <section className="pt-8 border-t border-[#E7E2D6]">
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#EDE6D8]">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#786E5E] block mb-1">
                      RECORD ARCHIVE
                    </span>
                    <h2 className="font-display text-2xl font-semibold text-[#181512]">
                      Previous Day's Broadsheets ({formatShortDate(data.previousDate)})
                    </h2>
                  </div>

                  <button
                    onClick={() => setActiveDateMode('yesterday')}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-[#801826] hover:text-[#5B101B] transition-colors"
                  >
                    View All Stored Yesterday <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(data.previousNewspapers || [])
                    .filter((p) => CORE_SLUGS.includes(p.slug))
                    .slice(0, 4)
                    .map((paper) => renderNewspaperCard(paper, false))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* ─── EDITORIAL FOOTER ────────────────────────────────────────────── */}
      <footer className="mt-20 border-t border-[#DDD5C5] bg-[#F7F4EE] py-10 text-center text-xs font-mono text-[#736C5F]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-display text-lg text-[#1A1815] font-semibold">
            The Altius Newspaper Room
          </p>
          <p className="text-[11px] text-[#8C8273]">
            Curated daily from verified MTProto broadsheet channels under strict regional edition priority.
          </p>
          <p className="text-[10px] text-[#A3998A] pt-2">
            Automated Ingestion Runs: 06:00 • 09:00 • 12:00 • 15:00 • 18:00 • 21:00 IST • Zero-Cost Cloud Archive
          </p>
        </div>
      </footer>
    </div>
  );
}
