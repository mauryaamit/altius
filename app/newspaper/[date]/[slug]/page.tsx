'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Maximize2, ZoomIn, ZoomOut, RotateCcw, AlertTriangle } from 'lucide-react';
import { formatDateLong } from '@/lib/telegram/date-utils';
import styles from './NewspaperReader.module.css';

interface NewspaperDetail {
  slug: string;
  displayName: string;
  category: string;
  publicationDate: string;
  edition: string;
  status: string;
  fileUrl: string | null;
  fileSize: number;
  isStored?: boolean;
}

export default function PDFReaderPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const dateParam = params?.date as string;
  const slugParam = params?.slug as string;
  const isOndemand = searchParams?.get('mode') === 'ondemand';

  const [paper, setPaper] = useState<NewspaperDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(100);

  useEffect(() => {
    if (dateParam && slugParam) {
      fetchPaperDetail();
    }
  }, [dateParam, slugParam, isOndemand]);

  const fetchPaperDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isOndemand) {
        const ondemandUrl = `/api/newspaper/ondemand?date=${dateParam}&slug=${slugParam}`;

        // Preflight check to catch 503 / 404 / 500 errors before rendering iframe
        const headRes = await fetch(ondemandUrl, { method: 'HEAD' });

        if (!headRes.ok) {
          if (headRes.status === 503) {
            setError('Telegram connection is temporarily unconfigured on server.');
          } else if (headRes.status === 404) {
            setError('That edition could not be found in the source channel.');
          } else {
            setError("Couldn't retrieve this edition right now. Please try again.");
          }
          return;
        }

        setPaper({
          slug: slugParam,
          displayName: slugParam.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          category: slugParam,
          publicationDate: dateParam,
          edition: 'Source Stream',
          status: 'ready_ondemand',
          fileUrl: ondemandUrl,
          fileSize: 0,
          isStored: false,
        });
      } else {
        // Fetch metadata from stored API
        const res = await fetch(`/api/newspaper?date=${dateParam}`);
        const data = await res.json();
        if (data.success && data.newspapers) {
          const found = data.newspapers.find((p: any) => p.slug === slugParam);
          if (found && found.fileUrl) {
            setPaper({
              ...found,
              isStored: data.isStored !== false,
            });
          } else {
            setError(`The requested edition is not available for ${dateParam}.`);
          }
        } else {
          setError('Unable to load newspaper details.');
        }
      }
    } catch {
      setError("Couldn't retrieve this edition right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 60));
  const handleZoomReset = () => setZoom(100);

  const formattedDisplayDate = formatDateLong(dateParam);

  return (
    <div className={styles.readerRoot}>
      {/* ─── TOP CONTROLS BAR (Sticky, Blended, Full-width) ───────────── */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={styles.topBar}
      >
        <div className={styles.topBarInner}>
          {/* Zone 1: Back to Desk */}
          <Link href="/newspaper" className={styles.backBtn}>
            <ArrowLeft size={14} /> Back to Newspaper Room
          </Link>

          {/* Zone 2: Title Block */}
          {paper && (
            <div className={styles.titleBlock}>
              <div className={styles.titleRow}>
                <h1 className={styles.newspaperTitle}>
                  {paper.displayName}
                </h1>
                {isOndemand ? (
                  <span className={styles.ondemandBadge}>
                    ON-DEMAND EDITION
                  </span>
                ) : (
                  <span className={styles.storedBadge}>
                    STORED EDITION
                  </span>
                )}
              </div>
              <p className={styles.metaLine}>
                {formattedDisplayDate} &bull;{' '}
                <span className={styles.editionText}>
                  {paper.edition && paper.edition !== 'none' && paper.edition !== 'source'
                    ? `${paper.edition} edition`
                    : 'National Edition'}
                </span>
              </p>
            </div>
          )}

          {/* Zone 3: Controls Area */}
          {paper && paper.fileUrl && !error && (
            <div className={styles.controlsArea}>
              <div className={styles.segmentedControls}>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className={styles.iconControlBtn}
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className={styles.zoomPercentage}>{zoom}%</span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className={styles.iconControlBtn}
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleZoomReset}
                  className={styles.iconControlBtn}
                  title="Reset Zoom"
                  aria-label="Reset Zoom"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              <a
                href={paper.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.fullscreenBtn}
                title="Open in new window"
              >
                <Maximize2 size={14} /> Fullscreen
              </a>
            </div>
          )}
        </div>
      </motion.header>

      {/* ─── MAIN VIEWER VIEWPORT ────────────────────────────────────────── */}
      <main className={styles.viewerStage}>
        {loading ? (
          <div className={styles.stateCard}>
            <div className={styles.spinner} />
            <h2 className={styles.stateHeading}>
              {isOndemand ? 'Fetching edition from Telegram…' : 'Opening edition stream…'}
            </h2>
            <p className={styles.stateBody}>
              Please wait while we prepare the high-resolution broadsheet.
            </p>
          </div>
        ) : error || !paper || !paper.fileUrl ? (
          <div className={styles.stateCard}>
            <AlertTriangle size={36} color="#801826" style={{ margin: '0 auto 16px' }} />
            <h2 className={styles.stateHeading}>Unable to retrieve this edition</h2>
            <p className={styles.stateBody}>
              {error || "We couldn't retrieve this newspaper from the source right now."}
            </p>
            <Link href="/newspaper" className={styles.returnHomeBtn}>
              <ArrowLeft size={14} /> Return to Newspaper Room
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={styles.viewerContainer}
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <iframe
              src={`${paper.fileUrl}#toolbar=1&navpanes=0`}
              className={styles.pdfFrame}
              title={`${paper.displayName} PDF Viewer`}
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}
