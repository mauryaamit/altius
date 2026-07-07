'use client'
import React, { useState, useMemo } from 'react'
import { FilterChip } from '@/components/FilterChip'
import { Citation } from '@/components/Citation'
import type { PulseFilter, PulseStory } from '@/lib/content/types'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { DateNav } from '@/components/DateNav'
import { toISODate } from '@/lib/getDayIndex'
import { getPulseStoryForDate } from '@/lib/content/getDynamicContent'
import { Bookmark, Heart } from 'lucide-react'

const FILTERS: PulseFilter[] = ['Markets', 'Policy', 'Corporate', 'Trade', 'Tech']

export default function DigestPage() {
  const { activeDate, toggleFavorite, isFavorite } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()
  const dateStr = toISODate(currentDate)

  const [activeFilter, setActiveFilter] = useState<PulseFilter | 'All'>('All')
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

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
      <header className="digest-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">Knowledge</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>Digest</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          What happened in markets, policy, and business today — structured for the MBA lens.
        </p>
      </header>

      <DateNav />

      <div className="digest-filters">
        <FilterChip label="All" active={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
        {FILTERS.map((f) => (
          <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
        ))}
      </div>

      <div className="digest-stories-list">
        {activeStories.map((story) => {
          const ledgerId = `pulse_pulseStory_${story.filter.toLowerCase()}_${dateStr}`
          const isHeart = isFavorite(ledgerId, 'heart')
          const isBookmark = isFavorite(ledgerId, 'bookmark')

          return (
            <article key={story.id} className="digest-story">
              <div className="digest-story-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-mono text-mono-label uppercase tracking-widest text-mba-accent">
                  {story.filter}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <button
                    onClick={() => toggleFavorite(ledgerId, 'pulse', 'pulseStory', 'heart')}
                    className="fav-toggle-btn"
                    aria-label={isHeart ? 'Remove from favorites' : 'Add to favorites'}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: isHeart ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                  >
                    <Heart size={15} fill={isHeart ? 'var(--mba-accent)' : 'none'} />
                  </button>
                  <button
                    onClick={() => toggleFavorite(ledgerId, 'pulse', 'pulseStory', 'bookmark')}
                    className="fav-toggle-btn"
                    aria-label={isBookmark ? 'Remove from bookmarks' : 'Add to bookmarks'}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmark ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                  >
                    <Bookmark size={15} fill={isBookmark ? 'var(--mba-accent)' : 'none'} />
                  </button>
                </div>
              </div>

              <div className="digest-story-content">
                <div className="digest-story-section">
                  <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-2">What Happened</h3>
                  <p className="font-body text-body text-mba-ink-soft prose-measure">{story.whatHappened}</p>
                </div>
                <div className="digest-story-section">
                  <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-3">Key Numbers</h3>
                  <ul className="digest-numbers-list">
                    {story.numbers.map((n, idx) => (
                      <li key={idx} className="digest-number-item">
                        <span className="font-mono text-mono-value text-mba-ink">{n.stat}</span>
                        <Citation data={n.citation} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="digest-story-section">
                  <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-2">Why It Matters</h3>
                  <p className="font-body text-body text-mba-ink-soft prose-measure">{story.whyItMatters}</p>
                </div>
                <div className="digest-story-section">
                  <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-2">Sector Impact</h3>
                  <p className="font-body text-body text-mba-ink-soft prose-measure">{story.sectorImpact}</p>
                </div>
                <div className="digest-story-section digest-forward-looking">
                  <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-2">Forward-Looking Indicator</h3>
                  <p className="font-body text-body text-mba-ink-soft prose-measure">{story.forwardLookingLine}</p>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <style jsx>{`
        .digest-header { border-left: 3px solid var(--mba-accent); padding-left: var(--space-4); padding-bottom: var(--space-6); border-bottom: 1px solid var(--mba-rule); margin-bottom: var(--space-6); }
        .digest-filters { display: flex; gap: var(--space-2); margin-bottom: var(--space-6); flex-wrap: wrap; }
        .digest-stories-list { display: flex; flex-direction: column; gap: var(--space-6); }
        .digest-story { padding: var(--space-5); background: var(--mba-surface-sunk); border: 1px solid var(--mba-rule); border-radius: var(--radius-md); }
        .digest-story-header { margin-bottom: var(--space-4); border-bottom: 1px solid var(--mba-rule); padding-bottom: var(--space-2); }
        .digest-story-content { display: flex; flex-direction: column; gap: var(--space-4); }
        .digest-story-section { border-bottom: 1px dashed var(--mba-rule); padding-bottom: var(--space-3); }
        .digest-story-section:last-child { border-bottom: none; padding-bottom: 0; }
        .digest-numbers-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--space-2); }
        .digest-number-item { display: flex; align-items: center; gap: var(--space-2); }
        .digest-forward-looking { background: var(--mba-accent-soft); padding: var(--space-3); border-radius: var(--radius-sm); border-left: 3px solid var(--mba-accent); border-bottom: none; }
        .fav-toggle-btn { transition: transform 0.2s ease; }
        .fav-toggle-btn:hover { transform: scale(1.1); }
      `}</style>
    </div>
  )
}
