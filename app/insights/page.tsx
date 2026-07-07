'use client'
import React, { useMemo } from 'react'
import { getBiteForDate } from '@/lib/content/getDynamicContent'
import { AltitudeBlock } from '@/components/AltitudeBlock'
import { Citation } from '@/components/Citation'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { DateNav } from '@/components/DateNav'
import { toISODate } from '@/lib/getDayIndex'
import { Bookmark, Heart } from 'lucide-react'

export default function InsightsPage() {
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
  const isHeart = isFavorite(ledgerId, 'heart')
  const isBookmark = isFavorite(ledgerId, 'bookmark')

  if (!mounted) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8">
        Loading Insight...
      </div>
    )
  }

  return (
    <div>
      <header className="insights-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">Knowledge</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>Insights</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          One cognitive bias, economic effect, or mental model per day — explained with real examples and an MBA application.
        </p>
      </header>

      <DateNav />

      {bite ? (
        <article className="insight-container">
          <div className="insight-type-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-mono text-mono-label text-mba-accent uppercase tracking-widest">
              {bite.type}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <button
                onClick={() => toggleFavorite(ledgerId, 'bites', 'bite', 'heart')}
                className="fav-toggle-btn"
                aria-label={isHeart ? 'Remove from favorites' : 'Add to favorites'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isHeart ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
              >
                <Heart size={15} fill={isHeart ? 'var(--mba-accent)' : 'none'} />
              </button>
              <button
                onClick={() => toggleFavorite(ledgerId, 'bites', 'bite', 'bookmark')}
                className="fav-toggle-btn"
                aria-label={isBookmark ? 'Remove from bookmarks' : 'Add to bookmarks'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmark ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
              >
                <Bookmark size={15} fill={isBookmark ? 'var(--mba-accent)' : 'none'} />
              </button>
            </div>
          </div>

          <h2 className="font-display text-h2-fluid text-mba-ink mb-6" style={{ fontWeight: 600 }}>
            {bite.name}
          </h2>

          <div className="insight-altitude-wrapper">
            <AltitudeBlock content={bite.altitude} id={`insight-${bite.name.toLowerCase().replace(/\s+/g, '-')}`} />
          </div>

          {bite.citations && bite.citations.length > 0 && (
            <div className="insight-citations-wrapper">
              <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">
                References
              </span>
              <div className="insight-cits">
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
        <p className="font-body text-body text-mba-ink-faint">No insight loaded for today.</p>
      )}

      <style jsx>{`
        .insights-header { border-left: 3px solid var(--mba-accent); padding-left: var(--space-4); padding-bottom: var(--space-6); border-bottom: 1px solid var(--mba-rule); margin-bottom: var(--space-6); }
        .insight-container { padding: var(--space-6); background: var(--mba-surface-sunk); border: 1px solid var(--mba-rule); border-radius: var(--radius-md); }
        .insight-type-wrapper { margin-bottom: var(--space-2); }
        .insight-altitude-wrapper { margin-bottom: var(--space-6); }
        .insight-citations-wrapper { border-top: 1px solid var(--mba-rule); padding-top: var(--space-4); }
        .insight-cits { display: flex; flex-wrap: wrap; gap: var(--space-2); }
        .fav-toggle-btn { transition: transform 0.2s ease; }
        .fav-toggle-btn:hover { transform: scale(1.1); }
      `}</style>
    </div>
  )
}
