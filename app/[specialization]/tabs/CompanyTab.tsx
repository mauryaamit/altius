import React from 'react'
import type { Specialization } from '@/lib/content/types'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { Citation } from '@/components/Citation'
import { Bookmark, Heart } from 'lucide-react'
import { NoteEditor } from '@/components/NoteEditor'
import { useDailyContent } from '@/lib/hooks/useDailyContent'

const chipColorMap: Record<Specialization, string> = {
  marketing:   'var(--chip-marketing)',
  finance:     'var(--chip-finance)',
  consulting:  'var(--chip-consulting)',
  operations:  'var(--chip-operations)',
  strategy:    'var(--chip-strategy)',
  people:      'var(--chip-people)',
}

interface CompanyTabProps {
  specialization: Specialization
}

export function CompanyTab({ specialization }: CompanyTabProps) {
  const { activeDate, toggleFavorite, isFavorite } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()
  const dateStr = currentDate.toISOString().slice(0, 10)
  const ledgerId = `${specialization}_companySpotlight__${dateStr}`
  
  const { data, loading, error } = useDailyContent<any>(specialization, 'companySpotlight', currentDate)
  const chipColor = chipColorMap[specialization] || 'var(--mba-accent)'

  if (loading) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8 animate-pulse text-center">
        Loading today's fresh briefing...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8 text-center">
        Failed to load content. Gracefully recovering...
      </div>
    )
  }

  const getCitation = (id: number) => {
    return data.citations?.find((c: any) => c.id === id)
  }

  const isHeart = isFavorite(ledgerId, 'heart')
  const isBookmark = isFavorite(ledgerId, 'bookmark')

  return (
    <article className="company-spotlight" style={{ '--chip-color': chipColor } as React.CSSProperties}>
      
      {/* 1. Header: Name & Identity */}
      <section className="spotlight-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block" style={{ margin: 0 }}>
            Company Spotlight
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              onClick={() => toggleFavorite(ledgerId, specialization, 'companySpotlight', 'heart')}
              className="fav-toggle-btn"
              aria-label={isHeart ? 'Remove from favorites' : 'Add to favorites'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isHeart ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
            >
              <Heart size={15} fill={isHeart ? 'var(--mba-accent)' : 'none'} />
            </button>
            <button
              onClick={() => toggleFavorite(ledgerId, specialization, 'companySpotlight', 'bookmark')}
              className="fav-toggle-btn"
              aria-label={isBookmark ? 'Remove from bookmarks' : 'Add to bookmarks'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmark ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
            >
              <Bookmark size={15} fill={isBookmark ? 'var(--mba-accent)' : 'none'} />
            </button>
          </div>
        </div>
        <h2 className="font-display company-name text-h2 text-mba-ink mb-2">
          {data.companyName}
        </h2>
        <p className="font-body text-body text-mba-ink-soft italic prose-measure mb-4">
          {data.identity}
        </p>
        <div className="meta-row font-mono text-caption text-mba-ink-faint">
          <span>Founded: {data.founded}</span>
          <span className="dot-divider" />
          <span>HQ: {data.headquarters}</span>
        </div>
      </section>

      <div className="hairline-divider" />

      {/* 2. Metrics Block (Stat Row) */}
      <section className="spotlight-section">
        <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-4">Financials & Market Position</h3>
        <div className="metrics-grid">
          {data.metrics.map((m: any, idx: number) => {
            const cit = getCitation(m.citationId)
            return (
              <div key={idx} className="metric-card">
                <div className="metric-val-row">
                  <span className="metric-value font-mono text-h2 text-mba-ink">{m.value}</span>
                  {cit && <Citation data={cit} />}
                </div>
                <span className="metric-label font-body text-caption text-mba-ink-soft">{m.label}</span>
                <span className="metric-date font-mono text-mono-label text-mba-ink-faint mt-1">as of {m.asOf}</span>
              </div>
            )
          })}
        </div>
      </section>

      <div className="hairline-divider" />

      {/* 3. Industry Context */}
      <section className="spotlight-section">
        <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-3">Industry Dynamics</h3>
        <p className="font-body text-body text-mba-ink-soft prose-measure">
          {data.industryContext}
        </p>
      </section>

      <div className="hairline-divider" />

      {/* 4. Competitors */}
      <section className="spotlight-section">
        <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-4">Competitive Positioning Contrast</h3>
        <div className="competitors-list">
          {data.competitors.map((comp: any, idx: number) => (
            <div key={idx} className="competitor-item">
              <span className="competitor-name font-display font-bold text-mba-ink block mb-1">{comp.name}</span>
              <p className="font-body text-body text-mba-ink-soft prose-measure m-0">{comp.positioningNote}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="hairline-divider" />

      {/* 5. Function-Specific Lens */}
      <section className="spotlight-section">
        <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-3">Functional Strategy Lens</h3>
        <p className="font-body text-body text-mba-ink-soft prose-measure">
          {data.functionLens}
        </p>
      </section>

      <div className="hairline-divider" />

      {/* 6. Why This Matters */}
      <section className="spotlight-section matters-box">
        <h3 className="font-mono text-mono-label text-mba-accent uppercase tracking-wider block mb-2">GD & Interview Application</h3>
        <p className="font-body text-body text-mba-ink prose-measure m-0" style={{ fontWeight: 500 }}>
          {data.whyItMatters}
        </p>
      </section>

      <NoteEditor
        contentRef={ledgerId}
        contentTitle={data.companyName}
        contentType="companySpotlight"
        page={specialization}
      />

      <style jsx>{`
        .company-spotlight {
          border-left: 3px solid var(--chip-color);
          padding-left: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .spotlight-section {
          padding: var(--space-2) 0;
        }

        .company-name {
          line-height: 1.15;
          font-weight: 700;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .dot-divider {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--mba-ink-faint);
        }

        .hairline-divider {
          height: 1px;
          background: var(--mba-rule);
          width: 100%;
        }

        /* Metrics grid: 2-4 columns on desktop, 2-column grid on mobile */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: var(--space-5);
        }

        .metric-card {
          display: flex;
          flex-direction: column;
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          padding: var(--space-4);
          border-radius: var(--radius-sm);
        }

        .metric-val-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-2);
        }

        .metric-value {
          line-height: 1.1;
          font-weight: 600;
        }

        .metric-label {
          margin-top: var(--space-2);
          line-height: 1.3;
        }

        .competitors-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .competitor-item {
          padding: var(--space-3) var(--space-4);
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
        }

        .matters-box {
          background: var(--mba-accent-soft);
          border-radius: var(--radius-sm);
          padding: var(--space-5);
          border-left: 2px solid var(--mba-accent);
        }

        @media (max-width: 767px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .company-spotlight {
            padding-left: var(--space-4);
          }
        }
      `}</style>
    </article>
  )
}
