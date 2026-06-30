'use client'
import React, { useMemo } from 'react'
import { getBiteForDate } from '@/lib/content/getDynamicContent'
import { AltitudeBlock } from '@/components/AltitudeBlock'
import { Citation } from '@/components/Citation'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { DateNav } from '@/components/DateNav'
import { toISODate } from '@/lib/getDayIndex'
import { Bookmark } from 'lucide-react'

export default function BitesPage() {
  const { activeDate, toggleFavorite, isFavorite } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()
  const dateStr = toISODate(currentDate)

  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const bite = useMemo(() => {
    return getBiteForDate(currentDate)
  }, [currentDate])

  const ledgerId = `bites_bite__${dateStr}`
  const fav = isFavorite(ledgerId)

  if (!mounted) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8">
        Loading Bite...
      </div>
    )
  }

  return (
    <div>
      <header className="bites-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">Knowledge</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>Bites</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          Distilled cognitive models, economic effects, laws, and history concepts for daily reading.
        </p>
      </header>

      <DateNav />

      {bite ? (
        <article className="bite-container">
          <div className="bite-type-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-mono text-mono-label text-mba-accent uppercase tracking-widest">
              {bite.type}
            </span>

            <button
              onClick={() => toggleFavorite(ledgerId, 'bites', 'bite')}
              className="fav-toggle-btn"
              aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: fav ? 'var(--mba-accent)' : 'var(--mba-ink-faint)' }}
            >
              <Bookmark size={16} fill={fav ? 'var(--mba-accent)' : 'none'} />
            </button>
          </div>

          <h2 className="font-display text-h2-fluid text-mba-ink mb-6" style={{ fontWeight: 600 }}>
            {bite.name}
          </h2>

          <div className="bite-altitude-wrapper">
            <AltitudeBlock content={bite.altitude} id={`bite-${bite.name.toLowerCase().replace(/\s+/g, '-')}`} />
          </div>

          {bite.citations && bite.citations.length > 0 && (
            <div className="bite-citations-wrapper">
              <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">
                References
              </span>
              <div className="bite-cits">
                {bite.citations.map((cit) => (
                  <span key={cit.id} className="mr-2">
                    <Citation data={cit} />
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      ) : (
        <p className="font-body text-body text-mba-ink-faint">No bite loaded for today.</p>
      )}

      <style jsx>{`
        .bites-header { border-left: 3px solid var(--mba-accent); padding-left: var(--space-4);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }
        .bite-container {
          padding: var(--space-6);
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
        }
        .bite-type-wrapper {
          margin-bottom: var(--space-2);
        }
        .bite-altitude-wrapper {
          margin-bottom: var(--space-6);
        }
        .bite-citations-wrapper {
          border-top: 1px solid var(--mba-rule);
          padding-top: var(--space-4);
        }
        .bite-cits {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .fav-toggle-btn {
          transition: transform 0.2s ease;
        }
        .fav-toggle-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}
