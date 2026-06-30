'use client'
import React, { useState, useMemo } from 'react'
import { FilterChip } from '@/components/FilterChip'
import { Citation } from '@/components/Citation'
import type { PulseFilter, PulseStory } from '@/lib/content/types'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { DateNav } from '@/components/DateNav'
import { toISODate } from '@/lib/getDayIndex'
import { getPulseStoryForDate } from '@/lib/content/getDynamicContent'
import { Bookmark } from 'lucide-react'

const FILTERS: PulseFilter[] = ['Markets', 'Policy', 'Corporate', 'Trade', 'Tech']

export default function PulsePage() {
  const { activeDate, toggleFavorite, isFavorite } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()
  const dateStr = toISODate(currentDate)

  const [activeFilter, setActiveFilter] = useState<PulseFilter | 'All'>('All')
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Retrieve stories dynamically from content ledger
  const activeStories = useMemo<PulseStory[]>(() => {
    if (activeFilter === 'All') {
      return FILTERS.map((f) => getPulseStoryForDate(f, currentDate))
    } else {
      return [getPulseStoryForDate(activeFilter, currentDate)]
    }
  }, [activeFilter, currentDate])

  if (!mounted) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8">
        Loading stories...
      </div>
    )
  }

  return (
    <div>
      <header className="pulse-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">Knowledge</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>Pulse</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          What happened in markets, policy, and business today — structured for the MBA lens.
        </p>
      </header>

      <DateNav />

      <div className="pulse-filters">
        <FilterChip label="All" active={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
        {FILTERS.map((f) => (
          <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
        ))}
      </div>

      <div className="pulse-stories-list">
        {activeStories.map((story) => {
          const ledgerId = `pulse_pulseStory_${story.filter.toLowerCase()}_${dateStr}`
          const fav = isFavorite(ledgerId)

          return (
            <article key={story.id} className="pulse-story">
              <div className="pulse-story-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-mono text-mono-label uppercase tracking-widest text-mba-accent">
                  {story.filter}
                </span>

                <button
                  onClick={() => toggleFavorite(ledgerId, 'pulse', 'pulseStory')}
                  className="fav-toggle-btn"
                  aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: fav ? 'var(--mba-accent)' : 'var(--mba-ink-faint)' }}
                >
                  <Bookmark size={16} fill={fav ? 'var(--mba-accent)' : 'none'} />
                </button>
              </div>

              <div className="pulse-story-content">
                {/* What Happened */}
                <div className="pulse-story-section">
                  <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-2">What Happened</h3>
                  <p className="font-body text-body text-mba-ink-soft prose-measure">
                    {story.whatHappened}
                  </p>
                </div>

                {/* Numbers */}
                <div className="pulse-story-section">
                  <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-3">Key Numbers</h3>
                  <ul className="pulse-numbers-list">
                    {story.numbers.map((n, idx) => (
                      <li key={idx} className="pulse-number-item">
                        <span className="font-mono text-mono-value text-mba-ink">{n.stat}</span>
                        <Citation data={n.citation} />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Why It Matters */}
                <div className="pulse-story-section">
                  <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-2">Why It Matters</h3>
                  <p className="font-body text-body text-mba-ink-soft prose-measure">
                    {story.whyItMatters}
                  </p>
                </div>

                {/* Sector Impact */}
                <div className="pulse-story-section">
                  <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-2">Sector Impact</h3>
                  <p className="font-body text-body text-mba-ink-soft prose-measure">
                    {story.sectorImpact}
                  </p>
                </div>

                {/* Forward-Looking Line */}
                <div className="pulse-story-section pulse-forward-looking">
                  <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-2">Forward-Looking Indicator</h3>
                  <p className="font-body text-body text-mba-ink-soft prose-measure">
                    {story.forwardLookingLine}
                  </p>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <style jsx>{`
        .pulse-header { border-left: 3px solid var(--mba-accent); padding-left: var(--space-4);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }
        .pulse-filters {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }
        .pulse-stories-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .pulse-story {
          padding: var(--space-5);
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
        }
        .pulse-story-header {
          margin-bottom: var(--space-4);
          border-bottom: 1px solid var(--mba-rule);
          padding-bottom: var(--space-2);
        }
        .pulse-story-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .pulse-story-section {
          border-bottom: 1px dashed var(--mba-rule);
          padding-bottom: var(--space-3);
        }
        .pulse-story-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .pulse-numbers-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .pulse-number-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .pulse-forward-looking {
          background: var(--mba-accent-soft);
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--mba-accent);
          border-bottom: none;
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
