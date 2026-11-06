'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  Download,
  Calendar,
  CalendarDays,
  Sparkles,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import styles from './NewspaperRoom.module.css';

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

const gridMotionVariants: Variants = {
  hidden: { opacity: 0.4 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const cardMotionVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
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

  // Short label for pills (e.g. "6 Nov")
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

  const renderNewspaperCard = (paper: NewspaperCard, isHistorical: boolean = false, isMuted: boolean = false) => {
    const isAvailable = paper.status === 'ready' || paper.status === 'ready_ondemand';
    const hasDownloadUrl = Boolean(paper.fileUrl);
    const fileSizeMB = paper.fileSize > 0 ? `${(paper.fileSize / (1024 * 1024)).toFixed(1)} MB` : null;

    const targetReaderHref = isHistorical
      ? `/newspaper/${paper.publicationDate}/${paper.slug}?mode=ondemand`
      : `/newspaper/${paper.publicationDate}/${paper.slug}`;

    const editionLabel = paper.edition && paper.edition !== 'none' && paper.edition !== 'source'
      ? `${paper.edition} edition`
      : 'National Edition';

    return (
      <motion.article
        key={paper.slug}
        variants={cardMotionVariants}
        className={`${styles.card} ${isMuted ? styles.cardMuted : ''}`}
      >
        {/* Desktop Header: Edition chip */}
        <div className={styles.cardHeaderDesktop}>
          <span className={styles.editionChip}>
            {editionLabel}
          </span>
        </div>

        {/* Mobile Header: Row 1 = chip (left) + download button (right) */}
        <div className={styles.cardHeaderMobile}>
          <span className={styles.editionChip}>
            {editionLabel}
          </span>
          {hasDownloadUrl && (
            <a
              href={paper.fileUrl || '#'}
              download={`${paper.slug}-${paper.publicationDate}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              title="Direct PDF download"
              className={styles.downloadBtnMobile}
              aria-label={`Download ${paper.displayName} PDF`}
            >
              <Download size={14} />
            </a>
          )}
        </div>

        {/* Newspaper Name: Cormorant 30px desktop / 22px mobile */}
        <h3 className={styles.newspaperName}>
          {paper.displayName}
        </h3>

        {/* Mobile Status Row (Row 3 on mobile: dot + file size) */}
        <div className={styles.cardStatusMobile}>
          <span
            className={`${styles.statusDot} ${
              isAvailable ? styles.statusDotReady : styles.statusDotPending
            }`}
          />
          <span className={styles.fileSize}>
            {fileSizeMB ? fileSizeMB : isAvailable ? 'Stream' : 'Pending'}
          </span>
        </div>

        {/* Footer (Desktop: hairline + left dot/size/dl + right btn; Mobile: full-width btn) */}
        <div className={styles.cardFooter}>
          <div className={styles.footerLeft}>
            <span
              className={`${styles.statusDot} ${
                isAvailable ? styles.statusDotReady : styles.statusDotPending
              }`}
            />
            <span className={styles.fileSize}>
              {fileSizeMB ? fileSizeMB : isAvailable ? 'Stream' : 'Pending'}
            </span>

            {hasDownloadUrl && (
              <a
                href={paper.fileUrl || '#'}
                download={`${paper.slug}-${paper.publicationDate}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                title="Direct PDF download"
                className={styles.downloadBtn}
                aria-label={`Download ${paper.displayName} PDF`}
              >
                <Download size={14} />
              </a>
            )}
          </div>

          <div className={styles.footerRight}>
            {isAvailable ? (
              <Link
                href={targetReaderHref}
                className={styles.primaryBtn}
              >
                <span>Read Edition</span>
                <ArrowRight size={13} className={styles.btnArrow} />
              </Link>
            ) : (
              <span className={styles.fileSize} style={{ fontStyle: 'italic', color: '#9CA3AF' }}>
                Not Ready
              </span>
            )}
          </div>
        </div>
      </motion.article>
    );
  };

  const renderSupplementaryCard = (paper: NewspaperCard, isHistorical: boolean = false) => {
    const isAvailable = paper.status === 'ready' || paper.status === 'ready_ondemand';
    const hasDownloadUrl = Boolean(paper.fileUrl);
    const fileSizeMB = paper.fileSize > 0 ? `${(paper.fileSize / (1024 * 1024)).toFixed(1)} MB` : null;

    const targetReaderHref = isHistorical
      ? `/newspaper/${paper.publicationDate}/${paper.slug}?mode=ondemand`
      : `/newspaper/${paper.publicationDate}/${paper.slug}`;

    return (
      <motion.article
        key={paper.slug}
        variants={cardMotionVariants}
        className={styles.card}
      >
        {/* Desktop Header */}
        <div className={styles.cardHeaderDesktop}>
          <span className={styles.editionChip} style={{ backgroundColor: '#EDE6D8', borderColor: '#DDD5C5' }}>
            Curated Docket
          </span>
        </div>

        {/* Mobile Header: Row 1 = chip left + download button right */}
        <div className={styles.cardHeaderMobile}>
          <span className={styles.editionChip} style={{ backgroundColor: '#EDE6D8', borderColor: '#DDD5C5' }}>
            Curated Docket
          </span>
          {hasDownloadUrl && (
            <a
              href={paper.fileUrl || '#'}
              download={`${paper.slug}-${paper.publicationDate}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              title="Direct PDF download"
              className={styles.downloadBtnMobile}
              aria-label={`Download ${paper.displayName} PDF`}
            >
              <Download size={14} />
            </a>
          )}
        </div>

        {/* Title */}
        <h3 className={styles.newspaperName}>
          {paper.displayName}
        </h3>

        {/* Mobile Status Row (Row 3 on mobile) */}
        <div className={styles.cardStatusMobile}>
          <span
            className={`${styles.statusDot} ${
              isAvailable ? styles.statusDotReady : styles.statusDotPending
            }`}
          />
          <span className={styles.fileSize}>
            {fileSizeMB ? `${fileSizeMB} · PDF` : 'Digital Edition'}
          </span>
        </div>

        {/* Footer */}
        <div className={styles.cardFooter}>
          <div className={styles.footerLeft}>
            <span
              className={`${styles.statusDot} ${
                isAvailable ? styles.statusDotReady : styles.statusDotPending
              }`}
            />
            <span className={styles.fileSize}>
              {fileSizeMB ? `${fileSizeMB} · PDF` : 'Digital Edition'}
            </span>

            {hasDownloadUrl && (
              <a
                href={paper.fileUrl || '#'}
                download={`${paper.slug}-${paper.publicationDate}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                title="Direct PDF download"
                className={styles.downloadBtn}
                aria-label={`Download ${paper.displayName} PDF`}
              >
                <Download size={14} />
              </a>
            )}
          </div>

          <div className={styles.footerRight}>
            {isAvailable ? (
              <Link
                href={targetReaderHref}
                className={`${styles.primaryBtn} ${styles.compendiumBtn}`}
              >
                <span>Open Compendium</span>
                <ArrowRight size={13} className={styles.btnArrow} />
              </Link>
            ) : (
              <span className={styles.fileSize} style={{ fontStyle: 'italic', color: '#9CA3AF' }}>
                Not Ready
              </span>
            )}
          </div>
        </div>
      </motion.article>
    );
  };

  return (
    <div className={styles.nrRoot}>
      {/* ─── HERITAGE BROADSHEET HEADER & MASTHEAD ───────────────────────── */}
      <header className={styles.header}>
        {/* Top Context Bar */}
        <div className={styles.topBar}>
          <div className={`${styles.container} ${styles.topBarInner}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link href="/" className={styles.backLink}>
                ← Back to Desk
              </Link>
              <span className={styles.libraryDivider}>|</span>
              <span className={styles.libraryLabel}>
                Altius Executive Reading Library
              </span>
            </div>

            <div>
              <span className={styles.liveIndicator}>
                <span className={styles.pulseDot} />
                <span className={styles.timeRangeSpan}>6 AM – 9 PM IST </span>Ingestion Live
              </span>
            </div>
          </div>
        </div>

        {/* Central Masthead (Reduced Vertical Space) */}
        <div className={`${styles.container} ${styles.masthead}`}>
          <p className={styles.eyebrow}>
            THE BROADSHEET & FINANCIAL DESK
          </p>
          <h1 className={styles.title}>
            The Newspaper Room
          </h1>
          <p className={styles.subtitle}>
            Curated daily national broadsheets, corporate financial dailies, and executive editorial compendiums.
          </p>
        </div>

        {/* Broadsheet Dateline Bar (Refined Hairlines, Desktop & Mobile Formats) */}
        <div className={styles.datelineBar}>
          <div className={styles.container}>
            {/* Desktop Layout (Single row) */}
            <div className={styles.datelineDesktop}>
              <div className={styles.datelineDate}>
                <Calendar size={13} color="#801826" />
                <span>{formatMastheadDate(currentDisplayedCards.dateStr)}</span>
              </div>

              <div className={styles.dateControls}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDateMode('today');
                    setArchiveError(null);
                  }}
                  className={`${styles.datePill} ${
                    activeDateMode === 'today' ? styles.datePillActive : ''
                  }`}
                >
                  Today ({formatShortDate(data?.todayDate)})
                </button>

                {data?.previousDate && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDateMode('yesterday');
                      setArchiveError(null);
                    }}
                    className={`${styles.datePill} ${
                      activeDateMode === 'yesterday' ? styles.datePillActive : ''
                    }`}
                  >
                    Yesterday ({formatShortDate(data.previousDate)})
                  </button>
                )}

                <div className={styles.datePickerWrapper}>
                  <input
                    id="archive-date-input"
                    type="date"
                    max={data?.todayDate || new Date().toISOString().substring(0, 10)}
                    value={selectedArchiveDate}
                    onChange={handleArchiveDateSelect}
                    aria-label="Select archive date"
                    className={styles.dateInput}
                  />
                  <CalendarDays size={14} className={styles.datePickerIcon} />
                </div>
              </div>
            </div>

            {/* Mobile Layout (2 compact rows ~110px total height) */}
            <div className={styles.datelineMobile}>
              {/* Row 1: Date text (left) + Date picker (right) */}
              <div className={styles.dateMobileRow1}>
                <div className={styles.datelineDate}>
                  <Calendar size={13} color="#801826" />
                  <span>{formatShortDate(currentDisplayedCards.dateStr) || 'Current'}</span>
                </div>

                <div className={styles.datePickerWrapper}>
                  <input
                    id="archive-date-input-mobile"
                    type="date"
                    max={data?.todayDate || new Date().toISOString().substring(0, 10)}
                    value={selectedArchiveDate}
                    onChange={handleArchiveDateSelect}
                    aria-label="Select archive date"
                    className={styles.dateInput}
                  />
                  <CalendarDays size={13} className={styles.datePickerIcon} />
                </div>
              </div>

              {/* Row 2: Today & Yesterday equal pills in 2-column grid */}
              <div className={styles.dateMobileRow2}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDateMode('today');
                    setArchiveError(null);
                  }}
                  className={`${styles.datePill} ${
                    activeDateMode === 'today' ? styles.datePillActive : ''
                  }`}
                >
                  Today ({formatShortDate(data?.todayDate)})
                </button>

                {data?.previousDate && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDateMode('yesterday');
                      setArchiveError(null);
                    }}
                    className={`${styles.datePill} ${
                      activeDateMode === 'yesterday' ? styles.datePillActive : ''
                    }`}
                  >
                    Yesterday ({formatShortDate(data.previousDate)})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className={`${styles.container} ${styles.mainContent}`}>
        {/* Archive Active Notice Banner */}
        {activeDateMode === 'archive' && (
          <div className={styles.archiveBanner}>
            <div>
              <p style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '19px', fontWeight: 600, color: '#181512', margin: 0 }}>
                Archive Edition: {formatMastheadDate(selectedArchiveDate)}
              </p>
              <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px', color: '#5C5549', margin: '3px 0 0' }}>
                Displaying historical dockets retrieved directly via Telegram MTProto stream.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveDateMode('today');
                setSelectedArchiveDate('');
              }}
              className={styles.archiveReturnBtn}
            >
              <RotateCcw size={12} /> Return to Today
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {(loading || archiveLoading) && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ height: '22px', width: '220px', backgroundColor: '#EFE9DC', borderRadius: '4px', marginBottom: '16px' }} />
            <div className={styles.cardGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} style={{ height: '170px', backgroundColor: '#F3EFE6', border: '1px solid rgba(60,40,20,0.1)', borderRadius: '20px' }} />
              ))}
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {(error || archiveError) && !loading && !archiveLoading && (
          <div style={{ margin: '24px 0', padding: '16px 20px', backgroundColor: '#FDF2F2', border: '1px solid #F87171', borderRadius: '16px', color: '#991B1B' }}>
            <h3 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '19px', fontWeight: 600, margin: '0 0 4px' }}>
              Notice from Newspaper Desk
            </h3>
            <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13.5px', margin: 0 }}>
              {error || archiveError}
            </p>
          </div>
        )}

        {/* Primary Content when Loaded */}
        {!loading && !archiveLoading && !error && (
          <div>
            {/* ─── SECTION 1: CORE BROADSHEETS (8 EDITIONS) ────────────── */}
            <section aria-labelledby="core-broadsheets-heading">
              <div className={styles.sectionHeader}>
                <div>
                  <h2 id="core-broadsheets-heading" className={styles.sectionHeading}>
                    {activeDateMode === 'today'
                      ? "Today's Broadsheets & Financial Press"
                      : activeDateMode === 'yesterday'
                      ? "Yesterday's Broadsheet Archive"
                      : `Archive Broadsheets (${formatShortDate(selectedArchiveDate)})`}
                  </h2>
                  <p className={styles.sectionSubtext}>
                    India's leading national dailies, business records, and international editorial briefs.
                  </p>
                </div>

                <span className={styles.counterChip}>
                  8 Categories • Full Editions
                </span>
              </div>

              <motion.div
                key={`core-${activeDateMode}-${selectedArchiveDate}`}
                variants={gridMotionVariants}
                initial="hidden"
                animate="visible"
                className={styles.cardGrid}
              >
                {currentDisplayedCards.core.map((paper) =>
                  renderNewspaperCard(paper, currentDisplayedCards.isHistorical, false)
                )}
              </motion.div>
            </section>

            {/* ─── SECTION 2: SUPPLEMENTARY READING DESK (2 COLLECTIONS) ─ */}
            {currentDisplayedCards.supp.length > 0 && (
              <section
                aria-labelledby="supplementary-reading-heading"
                className={styles.supplementaryBand}
              >
                <div className={styles.supplementaryHeader}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Sparkles size={13} color="#801826" />
                      <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.18em', color: '#801826' }}>
                        CURATED SYNTHESIS
                      </span>
                    </div>
                    <h2 id="supplementary-reading-heading" className={styles.sectionHeading}>
                      Supplementary Reading & Verbal Masterclass
                    </h2>
                    <p className={styles.sectionSubtext} style={{ maxWidth: '600px' }}>
                      Full-spectrum editorial opinions consolidated across all major broadsheets, paired with executive vocabulary compilations.
                    </p>
                  </div>

                  <span className={styles.counterChip} style={{ color: '#801826', backgroundColor: '#EDE6D8', borderColor: '#DDD5C5', fontWeight: 600 }}>
                    2 Specialized Dockets
                  </span>
                </div>

                <motion.div
                  key={`supp-${activeDateMode}-${selectedArchiveDate}`}
                  variants={gridMotionVariants}
                  initial="hidden"
                  animate="visible"
                  className={styles.supplementaryGrid}
                >
                  {currentDisplayedCards.supp.map((paper) =>
                    renderSupplementaryCard(paper, currentDisplayedCards.isHistorical)
                  )}
                </motion.div>
              </section>
            )}

            {/* ─── SECTION 3: YESTERDAY QUICK-ACCESS PREVIEW (when on Today mode) ─ */}
            {activeDateMode === 'today' && data?.previousDate && (
              <section style={{ marginTop: '36px' }}>
                <div className={styles.archiveHeaderRow}>
                  <div>
                    <span style={{ display: 'block', fontFamily: 'var(--font-mono), monospace', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.12em', color: '#786E5E', marginBottom: '2px' }}>
                      RECORD ARCHIVE
                    </span>
                    <h2 className={styles.sectionHeading} style={{ fontSize: '26px' }}>
                      Previous Day's Broadsheets ({formatShortDate(data.previousDate)})
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveDateMode('yesterday')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono), monospace', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#801826' }}
                  >
                    View All Stored Yesterday <ChevronRight size={14} />
                  </button>
                </div>

                <div className={styles.cardGrid}>
                  {(data.previousNewspapers || [])
                    .filter((p) => CORE_SLUGS.includes(p.slug))
                    .slice(0, 4)
                    .map((paper) => renderNewspaperCard(paper, false, true))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* ─── EDITORIAL FOOTER ────────────────────────────────────────────── */}
      <footer className={styles.footerNote}>
        <div className={styles.footerInner}>
          <p className={styles.footerTitle}>
            The Altius Newspaper Room
          </p>
          <p style={{ margin: '0 0 6px' }}>
            Curated daily from verified MTProto broadsheet channels under strict regional edition priority.
          </p>
          <p style={{ margin: 0, fontSize: '10px', color: '#A3998A' }}>
            Automated Ingestion Runs: 06:00 • 09:00 • 12:00 • 15:00 • 18:00 • 21:00 IST • Zero-Cost Cloud Archive
          </p>
        </div>
      </footer>
    </div>
  );
}
