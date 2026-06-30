'use client'
import React, { useState, useMemo } from 'react'
import { FilterChip } from '@/components/FilterChip'
import { Citation } from '@/components/Citation'
import type { GDTopic, GDTag } from '@/lib/content/types'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { DateNav } from '@/components/DateNav'
import { toISODate } from '@/lib/getDayIndex'
import { getGDTopicForDate } from '@/lib/content/getDynamicContent'
import { Bookmark } from 'lucide-react'

const GD_FILTERS: GDTag[] = ['Current', 'Business', 'Abstract', 'Tech', 'Ethics']

export default function GDPage() {
  const { activeDate, toggleFavorite, isFavorite } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()
  const dateStr = toISODate(currentDate)

  const [activeFilter, setActiveFilter] = useState<GDTag | 'All'>('All')
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Retrieve topics dynamically from content ledger
  const activeTopics = useMemo<GDTopic[]>(() => {
    if (activeFilter === 'All') {
      return GD_FILTERS.map((tag) => getGDTopicForDate(tag, currentDate))
    } else {
      return [getGDTopicForDate(activeFilter, currentDate)]
    }
  }, [activeFilter, currentDate])

  if (!mounted) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8">
        Loading GD topics...
      </div>
    )
  }

  return (
    <div>
      <header className="gd-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-3">Skill Room</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>GD Arena</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          Today's group discussion topics with structured For/Against arguments, quantitative data, and closing worked models.
        </p>
      </header>

      <DateNav />

      {/* Filter chips */}
      <div className="gd-filters">
        <FilterChip label="All" active={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
        {GD_FILTERS.map((f) => (
          <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
        ))}
      </div>

      <div className="gd-topics-list">
        {activeTopics.map((topic) => {
          const ledgerId = `gd-arena_gdTopic_${topic.tag.toLowerCase()}_${dateStr}`
          const fav = isFavorite(ledgerId)

          return (
            <article key={topic.topic} className="gd-topic">
              <div className="gd-topic-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span
                    className="gd-tag font-mono text-mono-label uppercase tracking-widest"
                    style={{ color: 'var(--mba-accent)' }}
                  >
                    {topic.tag}
                  </span>
                  
                  <button
                    onClick={() => toggleFavorite(ledgerId, 'gd-arena', 'gdTopic')}
                    className="fav-toggle-btn"
                    aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: fav ? 'var(--mba-accent)' : 'var(--mba-ink-faint)' }}
                  >
                    <Bookmark size={18} fill={fav ? 'var(--mba-accent)' : 'none'} />
                  </button>
                </div>
                <h2 className="font-display gd-headline">{topic.topic}</h2>
              </div>

              <section className="gd-framing">
                <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-3">Framing</h3>
                <p className="font-body text-body text-mba-ink-soft prose-measure">{topic.framing}</p>
                <div className="gd-cits">
                  {topic.citations.map((c) => (
                    <Citation key={c.id} data={c} />
                  ))}
                </div>
              </section>

              {/* For / Against two-column */}
              <div className="gd-arguments">
                <div className="gd-col gd-col-for">
                  <h3 className="font-mono text-mono-label uppercase tracking-widest mb-4" style={{ color: 'var(--mba-success)' }}>For</h3>
                  <ul className="gd-point-list">
                    {topic.forPoints.map((pt, pi) => (
                      <li key={pi} className="gd-point">
                        <p className="font-body text-body text-mba-ink-soft">{pt.point}</p>
                        {pt.citations?.map((c) => (
                          <Citation key={c.id} data={c} />
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="gd-col gd-col-against">
                  <h3 className="font-mono text-mono-label uppercase tracking-widest mb-4" style={{ color: 'var(--mba-danger)' }}>Against</h3>
                  <ul className="gd-point-list">
                    {topic.againstPoints.map((pt, pi) => (
                      <li key={pi} className="gd-point">
                        <p className="font-body text-body text-mba-ink-soft">{pt.point}</p>
                        {pt.citations?.map((c) => (
                          <Citation key={c.id} data={c} />
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Way Forward (Worked Synthesis) */}
              {topic.wayForward && (
                <section className="gd-way-forward">
                  <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-3">Way Forward (Worked Synthesis)</h3>
                  <p className="font-body text-body text-mba-ink-soft prose-measure" style={{ fontStyle: 'italic', lineHeight: '1.5' }}>
                    "{topic.wayForward}"
                  </p>
                </section>
              )}

              {/* Closing structure */}
              <section className="gd-closing mt-4">
                <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-3">Closing Structure Suggestion</h3>
                <p className="font-body text-body text-mba-ink-soft prose-measure">{topic.closingStructure}</p>
              </section>
            </article>
          )
        })}
      </div>

      <style jsx>{`
        .gd-header {
          border-left: 3px solid var(--mba-accent); padding-left: var(--space-4); padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }
        .gd-filters { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-6); }
        .gd-topic { padding: var(--space-7) 0; border-bottom: 1px solid var(--mba-rule); }
        .gd-topic:last-child { border-bottom: none; }
        .gd-topic-header { margin-bottom: var(--space-5); }
        .gd-tag { display: block; margin-bottom: var(--space-2); }
        .gd-headline { font-size: var(--text-h2); font-weight: 600; color: var(--mba-ink); line-height: 1.25; max-width: var(--measure-desktop); }
        .gd-framing { padding: var(--space-5) 0; border-bottom: 1px solid var(--mba-rule); margin-bottom: var(--space-5); }
        .gd-cits { display: flex; gap: var(--space-2); margin-top: var(--space-3); }
        .gd-arguments { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); margin-bottom: var(--space-6); }
        @media (max-width: 640px) { .gd-arguments { grid-template-columns: 1fr; } }
        .gd-col { padding: var(--space-5); background: var(--mba-surface-sunk); border-radius: var(--radius-md); }
        .gd-col-for { border-top: 3px solid var(--mba-success); }
        .gd-col-against { border-top: 3px solid var(--mba-danger); }
        .gd-point-list { display: flex; flex-direction: column; gap: var(--space-4); list-style: none; }
        .gd-point { border-bottom: 1px solid var(--mba-rule); padding-bottom: var(--space-3); }
        .gd-point:last-child { border-bottom: none; }
        .gd-way-forward {
          padding: var(--space-5);
          background: var(--mba-surface-sunk);
          border-radius: var(--radius-md);
          border-left: 3px solid var(--mba-accent);
          margin-bottom: var(--space-5);
        }
        .gd-closing { padding: var(--space-5); background: var(--mba-accent-soft); border-radius: var(--radius-md); border-left: 3px solid var(--mba-accent); }
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
