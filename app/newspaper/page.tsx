'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, FileText, CheckCircle2, XCircle, ArrowRight, ChevronRight, Clock } from 'lucide-react';

interface NewspaperCardData {
  slug: string;
  displayName: string;
  category: string;
  publicationDate: string;
  edition: string;
  status: 'ready' | 'not_available';
  fileUrl: string | null;
  originalTelegramFilename: string | null;
  fileSize: number;
}

const TARGET_SLUGS = [
  'the-hindu',
  'indian-express',
  'mint',
  'economic-times',
  'times-of-india',
  'hindustan-times',
  'international-editorial',
  'hindi-editorial',
];

export default function NewspaperPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [newspapers, setNewspapers] = useState<NewspaperCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewspapers(selectedDate);
  }, [selectedDate]);

  const fetchNewspapers = async (dateParam?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = dateParam ? `/api/newspaper?date=${dateParam}` : '/api/newspaper';
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setAvailableDates(data.availableDates || []);
        setSelectedDate(data.selectedDate || new Date().toISOString().substring(0, 10));
        setNewspapers(data.newspapers || []);
      } else {
        setError(data.error || 'Failed to load newspapers');
      }
    } catch (err: any) {
      setError('Network error fetching newspapers');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).toUpperCase()
    : 'TODAY';

  return (
    <div className="newspaper-room-root max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="news-header mb-8 pb-6 border-b border-mba-rule border-l-4 border-l-mba-accent pl-4">
        <span className="font-mono text-xs uppercase tracking-widest text-mba-ink-faint block mb-2">
          {formattedDate}
        </span>
        <h1 className="font-display text-4xl text-mba-ink font-semibold" style={{ lineHeight: '1.15' }}>
          Newspaper Room
        </h1>
        <p className="font-body text-base text-mba-ink-soft mt-2 max-w-2xl">
          Daily indexing of top 8 national epapers and international editorial briefs. High-resolution PDF reading room with 10-day archive.
        </p>
      </header>

      {/* 8 Target Cards Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-mba-ink font-medium flex items-center gap-2">
            <FileText className="w-5 h-5 text-mba-accent" />
            Editions for {selectedDate}
          </h2>
          {availableDates.length > 0 && selectedDate === availableDates[0] && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Today
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TARGET_SLUGS.map((slug) => (
              <div key={slug} className="h-44 bg-mba-surface-sunk border border-mba-rule rounded-lg animate-pulse p-4" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 font-body">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {newspapers.map((paper) => {
              const isAvailable = paper.status === 'ready' && Boolean(paper.fileUrl);
              const fileSizeMB = paper.fileSize ? (paper.fileSize / (1024 * 1024)).toFixed(1) + ' MB' : '';

              return (
                <div
                  key={paper.slug}
                  className={`paper-card flex flex-col justify-between p-5 bg-white border rounded-lg transition-all duration-200 ${
                    isAvailable
                      ? 'border-mba-rule hover:border-mba-accent hover:shadow-md'
                      : 'border-mba-rule/60 opacity-75 bg-slate-50/50'
                  }`}
                >
                  <div>
                    {/* Badge / Status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                        {paper.edition && paper.edition !== 'none' ? `${paper.edition} Edition` : 'National'}
                      </span>
                      {isAvailable ? (
                        <span className="flex items-center text-xs text-emerald-600 font-mono gap-1">
                          <CheckCircle2 size={13} /> Available
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-slate-400 font-mono gap-1">
                          <XCircle size={13} /> Not Available
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg text-mba-ink font-semibold leading-tight mb-2">
                      {paper.displayName}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-400">
                      {fileSizeMB ? fileSizeMB : 'PDF'}
                    </span>

                    {isAvailable ? (
                      <Link
                        href={`/newspaper/${paper.publicationDate}/${paper.slug}`}
                        className="read-action-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-white bg-mba-accent hover:bg-slate-800 transition-colors"
                      >
                        READ <ArrowRight size={12} />
                      </Link>
                    ) : (
                      <span className="text-xs font-mono text-slate-400 italic">No File</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Past 10 Days Archive UI */}
      <section className="mt-12 pt-8 border-t border-mba-rule">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-mba-accent" />
          <h2 className="font-display text-2xl text-mba-ink font-medium">Past 10 Days Archive</h2>
        </div>
        <p className="font-body text-sm text-mba-ink-soft mb-6">
          Select a publication date below to browse historical newspaper editions retained in the 10-day rolling archive.
        </p>

        <div className="flex flex-wrap gap-2">
          {availableDates.map((date) => {
            const isSelected = date === selectedDate;
            const dateObj = new Date(date);
            const dateDisplay = dateObj.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            });
            const dayName = dateObj.toLocaleDateString('en-IN', { weekday: 'short' });

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`archive-date-btn px-4 py-2 rounded-md font-mono text-xs flex flex-col items-center border transition-all ${
                  isSelected
                    ? 'bg-mba-accent text-white border-mba-accent shadow-sm'
                    : 'bg-white text-mba-ink border-mba-rule hover:border-mba-ink-faint hover:bg-slate-50'
                }`}
              >
                <span className="font-bold text-sm">{dateDisplay}</span>
                <span className="opacity-80 uppercase text-[10px]">{dayName}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
