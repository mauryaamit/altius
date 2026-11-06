'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  Sparkles,
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

export default function NewspaperPage() {
  const [data, setData] = useState<MetadataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(json.error || 'Unable to load newspaper desk metadata.');
      }
    } catch {
      setError('Network error connecting to newspaper desk.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateLabel = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).toUpperCase();
  };

  const renderPaperCard = (paper: NewspaperCard, isStored: boolean = true) => {
    const isAvailable = paper.status === 'ready' && Boolean(paper.fileUrl);
    const fileSizeMB = paper.fileSize ? (paper.fileSize / (1024 * 1024)).toFixed(1) + ' MB' : '';

    return (
      <div
        key={paper.slug}
        className={`paper-tile flex flex-col justify-between p-5 bg-white border rounded-xl transition-all duration-200 ${
          isAvailable
            ? 'border-[#E2DDD5] shadow-xs hover:border-[#0F172A] hover:shadow-md'
            : 'border-slate-200 opacity-70 bg-slate-50'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              {paper.edition && paper.edition !== 'none' ? `${paper.edition} EDITION` : 'NATIONAL'}
            </span>
            {isAvailable ? (
              <span className="flex items-center text-xs text-emerald-700 font-mono font-medium gap-1">
                <CheckCircle2 size={13} /> {isStored ? 'Available' : 'Stored'}
              </span>
            ) : (
              <span className="flex items-center text-xs text-slate-400 font-mono gap-1">
                <XCircle size={13} /> Pending
              </span>
            )}
          </div>

          <h3 className="font-display text-lg text-[#0F172A] font-semibold leading-snug mb-1">
            {paper.displayName}
          </h3>
        </div>

        <div className="mt-5 pt-3 border-t border-[#F1ECE4] flex items-center justify-between">
          <span className="font-mono text-xs text-[#64748B] font-medium">
            {fileSizeMB ? fileSizeMB : 'PDF'}
          </span>

          {isAvailable ? (
            <Link
              href={`/newspaper/${paper.publicationDate}/${paper.slug}`}
              className="read-action-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-white bg-[#0F172A] hover:bg-slate-800 transition-colors shadow-xs"
            >
              Read Edition <ArrowRight size={13} />
            </Link>
          ) : (
            <span className="text-xs font-mono text-slate-400 italic">Not ready</span>
          )}
        </div>
      </div>
    );
  };

  const todayCorePapers = data?.todayNewspapers.filter((p) => CORE_SLUGS.includes(p.slug)) || [];
  const todaySuppPapers = data?.todayNewspapers.filter((p) => SUPPLEMENTARY_SLUGS.includes(p.slug)) || [];

  const prevCorePapers = data?.previousNewspapers.filter((p) => CORE_SLUGS.includes(p.slug)) || [];
  const prevSuppPapers = data?.previousNewspapers.filter((p) => SUPPLEMENTARY_SLUGS.includes(p.slug)) || [];

  return (
    <div className="newspaper-desk-root min-h-screen bg-[#FDFBF7] text-[#1A1918] px-4 py-8 md:px-8 max-w-6xl mx-auto">
      {/* ─── SECTION 1: TODAY ───────────────────────────────────────────── */}
      <header className="desk-header mb-10 pb-6 border-b border-[#E2DDD5]">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-600" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#64748B] font-semibold">
            TODAY &bull; {formatDateLabel(data?.todayDate)}
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-[#0F172A] tracking-tight leading-tight">
          Newspaper Room
        </h1>
        <p className="font-body text-base text-[#475569] mt-2 max-w-2xl leading-relaxed">
          Your daily reading desk — essential national editions, editorial briefs, and daily vocabulary compilations.
        </p>
      </header>

      {/* TODAY CORE 8 CARDS */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-medium text-[#0F172A] flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-700" />
            Today's Editions ({formatDateLabel(data?.todayDate)})
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> Live Today
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CORE_SLUGS.map((s) => (
              <div key={s} className="h-44 bg-[#F1ECE4] border border-[#E2DDD5] rounded-lg animate-pulse p-4" />
            ))}
          </div>
        ) : error ? (
          <div className="p-5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-body text-sm">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {todayCorePapers.map((paper) => renderPaperCard(paper, true))}
          </div>
        )}

        {/* TODAY SUPPLEMENTARY READING (2 NEW CARDS) */}
        {!loading && !error && todaySuppPapers.length > 0 && (
          <div className="mt-10 pt-6 border-t border-[#F1ECE4]">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#64748B] font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Supplementary Reading
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {todaySuppPapers.map((paper) => renderPaperCard(paper, true))}
            </div>
          </div>
        )}
      </section>

      {/* ─── SECTION 2: PREVIOUS EDITION (YESTERDAY) ───────────────────── */}
      {data?.previousDate && data?.previousNewspapers.length > 0 && (
        <section className="mb-14 pt-8 border-t border-[#E2DDD5]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#64748B] font-semibold block mb-1">
                YESTERDAY &bull; {formatDateLabel(data.previousDate)}
              </span>
              <h2 className="font-display text-2xl font-medium text-[#0F172A]">
                Previous Edition
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-100 text-slate-700 font-mono text-xs font-semibold border border-slate-300">
              STORED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {prevCorePapers.map((paper) => renderPaperCard(paper, true))}
          </div>

          {/* YESTERDAY SUPPLEMENTARY READING */}
          {prevSuppPapers.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[#F1ECE4]">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#64748B] font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                Supplementary Reading
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {prevSuppPapers.map((paper) => renderPaperCard(paper, true))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
