'use client'
import React from 'react'
import Link from 'next/link'
import type { DayCardData } from '@/lib/content/types'

const chipColorMap: Record<string, string> = {
  marketing:   'var(--chip-marketing)',
  finance:     'var(--chip-finance)',
  consulting:  'var(--chip-consulting)',
  operations:  'var(--chip-operations)',
  strategy:    'var(--chip-strategy)',
  people:      'var(--chip-people)',
  english:     'var(--mba-accent)',
  guesstimate: 'var(--mba-accent)',
  pulse:       'var(--mba-accent)',
  bites:       'var(--mba-accent)',
  gd:          'var(--mba-accent)',
  explore:     'var(--mba-accent)',
  newspaper:   'var(--mba-accent)',
}

interface DayCardProps {
  data: DayCardData
  index?: number  // for stagger animation
  isLead?: boolean
}

function DayCardComponent({ data, index = 0, isLead = false }: DayCardProps) {
  const chipColor = data.specialization
    ? chipColorMap[data.specialization]
    : chipColorMap[data.slug] || 'var(--mba-accent)'

  return (
    <Link
      href={`/${data.slug}`}
      className={`day-card ${isLead ? 'lead-block' : ''}`}
      style={{
        '--delay': `${index * 60}ms`,
        '--chip-color': chipColor,
      } as React.CSSProperties}
    >
      {/* Eyebrow: chip dot/square + room name */}
      <span className="day-card-eyebrow">
        <span
          className={`day-card-marker ${isLead ? 'marker-square' : 'marker-dot'}`}
          style={{ backgroundColor: chipColor }}
          aria-hidden="true"
        />
        <span className="font-mono text-mono-label text-mba-ink-soft uppercase tracking-widest">
          {data.room}
        </span>
        {data.hasNewContent && (
          <span className="day-card-new font-mono text-mono-label">NEW</span>
        )}
      </span>

      {/* Headline — Cormorant */}
      <h2 className={`day-card-headline font-display ${isLead ? 'text-display' : 'text-h2'}`}>
        {data.headline}
      </h2>

      {/* Teaser — DM Sans, ink-soft */}
      <p className="day-card-teaser font-body">{data.teaser}</p>

      {isLead && <div className="lead-divider" />}

      <style jsx>{`
        .day-card {
          display: block;
          padding: var(--space-5) var(--space-4);
          border-left: 3px solid var(--chip-color);
          border-bottom: 1px solid var(--mba-rule);
          text-decoration: none;
          background: transparent;
          transition: border-left-width 150ms ease, background-color 150ms ease;
          animation: fadeSlideIn 300ms ease both;
          animation-delay: var(--delay, 0ms);
          margin-bottom: var(--space-3);
        }
        
        .day-card:hover {
          border-left-width: 5px;
          background-color: var(--mba-surface-sunk);
        }

        .day-card.lead-block {
          padding-top: var(--space-6);
          padding-bottom: var(--space-6);
          border-bottom: none;
          margin-bottom: var(--space-4);
        }

        .lead-divider {
          height: 1px;
          background: var(--mba-rule);
          margin-top: var(--space-6);
          width: 100%;
        }

        .day-card:hover .day-card-headline {
          color: var(--mba-accent);
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .day-card-eyebrow {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
        }

        .day-card-marker {
          flex-shrink: 0;
        }

        .marker-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .marker-square {
          width: 8px;
          height: 8px;
          border-radius: 0%;
        }

        .day-card-new {
          font-size: var(--text-mono-label);
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.06em;
          color: var(--mba-accent);
          background: var(--mba-accent-soft);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }

        .day-card-headline {
          font-weight: 600;
          color: var(--mba-ink);
          line-height: var(--leading-tight);
          margin-bottom: var(--space-2);
          max-width: var(--measure-desktop);
          transition: color 0.15s ease;
        }

        .text-display {
          font-size: var(--text-display);
        }

        .text-h2 {
          font-size: var(--text-h2);
        }

        .day-card-teaser {
          font-size: var(--text-body);
          color: var(--mba-ink-soft);
          line-height: var(--leading-body);
          max-width: var(--measure-desktop);
        }

        @media (prefers-reduced-motion: reduce) {
          .day-card { animation: none; transition: none; }
          .day-card-headline { transition: none; }
        }
      `}</style>
    </Link>
  )
}

export const DayCard = React.memo(DayCardComponent)
