'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Maximize2, ZoomIn, ZoomOut, RotateCcw, AlertTriangle } from 'lucide-react';

interface NewspaperDetail {
  slug: string;
  displayName: string;
  category: string;
  publicationDate: string;
  edition: string;
  status: 'ready' | 'not_available';
  fileUrl: string | null;
  fileSize: number;
}

export default function PDFReaderPage() {
  const params = useParams();
  const router = useRouter();

  const dateParam = params?.date as string;
  const slugParam = params?.slug as string;

  const [paper, setPaper] = useState<NewspaperDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(100);

  useEffect(() => {
    if (dateParam && slugParam) {
      fetchPaperDetail();
    }
  }, [dateParam, slugParam]);

  const fetchPaperDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/newspaper?date=${dateParam}`);
      const data = await res.json();
      if (data.success && data.newspapers) {
        const found = data.newspapers.find((p: any) => p.slug === slugParam);
        if (found && found.status === 'ready' && found.fileUrl) {
          setPaper(found);
        } else {
          setError(`The requested edition (${slugParam}) is not available for ${dateParam}.`);
        }
      } else {
        setError('Failed to load newspaper details.');
      }
    } catch (err: any) {
      setError('Network error fetching document.');
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 60));
  const handleZoomReset = () => setZoom(100);

  const formattedDate = dateParam
    ? new Date(dateParam).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : dateParam;

  return (
    <div className="pdf-reader-root min-h-screen flex flex-col bg-slate-900 text-white">
      {/* Top Controls Bar */}
      <header className="reader-header bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/newspaper"
            className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors"
          >
            <ArrowLeft size={14} /> Back to Room
          </Link>
          {paper && (
            <div>
              <h1 className="font-display text-lg text-white font-semibold leading-tight">
                {paper.displayName}
              </h1>
              <p className="font-mono text-xs text-slate-400">
                {formattedDate} &bull; <span className="uppercase text-sky-400">{paper.edition} edition</span>
              </p>
            </div>
          )}
        </div>

        {paper && paper.fileUrl && (
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
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

            {/* External Open / Direct Link */}
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
      <main className="flex-1 flex flex-col items-center justify-center p-2 bg-slate-900 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400 font-mono text-sm gap-3">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            Loading PDF reader stream...
          </div>
        ) : error || !paper || !paper.fileUrl ? (
          <div className="max-w-md p-6 bg-slate-950 border border-slate-800 rounded-lg text-center my-12">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h2 className="font-display text-lg text-white font-medium mb-2">Edition Not Available</h2>
            <p className="font-body text-xs text-slate-400 mb-6">{error || 'Unable to display PDF'}</p>
            <Link
              href="/newspaper"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-medium transition-colors"
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
