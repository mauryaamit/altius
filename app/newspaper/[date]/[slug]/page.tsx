'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Maximize2, ZoomIn, ZoomOut, RotateCcw, AlertTriangle } from 'lucide-react';
import { formatDateLong } from '@/lib/telegram/date-utils';

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
    <div className="pdf-reader-root min-h-screen flex flex-col bg-slate-900 text-white">
      {/* Top Controls Bar */}
      <header className="reader-header bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/newspaper"
            className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors"
          >
            <ArrowLeft size={14} /> Back to Newspaper Room
          </Link>
          {paper && (
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg text-white font-semibold leading-tight">
                  {paper.displayName}
                </h1>
                {isOndemand ? (
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ON-DEMAND EDITION
                  </span>
                ) : (
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    STORED EDITION
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                {formattedDisplayDate} &bull; <span className="uppercase text-sky-400">{paper.edition} edition</span>
              </p>
            </div>
          )}
        </div>

        {paper && paper.fileUrl && !error && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 rounded p-1 text-slate-300">
              <button
                onClick={handleZoomOut}
                className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="font-mono text-xs px-2 min-w-[3rem] text-center">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={handleZoomReset}
                className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors border-l border-slate-700 ml-1"
                title="Reset Zoom"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            <a
              href={paper.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors"
              title="Open in new window"
            >
              <Maximize2 size={14} /> Fullscreen
            </a>
          </div>
        )}
      </header>

      {/* Main Reader Viewport */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-900 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-300 font-mono text-sm gap-4 bg-slate-950/80 rounded-xl border border-slate-800 max-w-md text-center">
            <div className="w-9 h-9 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="font-bold text-white mb-1">
                {isOndemand ? 'Fetching edition from Telegram source…' : 'Loading stored PDF reader stream…'}
              </p>
              <p className="text-xs text-slate-400 font-body">
                Please wait while we prepare the high-resolution edition.
              </p>
            </div>
          </div>
        ) : error || !paper || !paper.fileUrl ? (
          <div className="max-w-md p-8 bg-slate-950 border border-slate-800 rounded-xl text-center my-12 shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="font-display text-xl text-white font-semibold mb-2">Unable to retrieve this edition</h2>
            <p className="font-body text-sm text-slate-400 mb-6 leading-relaxed">
              {error || "We couldn't retrieve this newspaper from the source right now."}
            </p>
            <Link
              href="/newspaper"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold transition-colors shadow-sm"
            >
              <ArrowLeft size={14} /> Return to Newspaper Room
            </Link>
          </div>
        ) : (
          <div
            className="w-full flex-1 max-w-6xl mx-auto rounded overflow-hidden shadow-2xl transition-all duration-200"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <iframe
              src={`${paper.fileUrl}#toolbar=1&navpanes=0`}
              className="w-full h-[calc(100vh-80px)] border-0 rounded bg-white"
              title={`${paper.displayName} PDF Viewer`}
            />
          </div>
        )}
      </main>
    </div>
  );
}
