import React, { useState } from 'react'
import type { Specialization } from '@/lib/content/types'
import { marketingThink } from '@/lib/content/marketing'
import { financeThink } from '@/lib/content/finance'
import { consultingThink } from '@/lib/content/consulting'
import { operationsThink } from '@/lib/content/operations'
import { strategyThink } from '@/lib/content/strategy'
import { peopleThink } from '@/lib/content/people'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { getDynamicContentForDate } from '@/lib/content/getDynamicContent'
import { AltitudeBlock } from '@/components/AltitudeBlock'
import { Callout } from '@/components/Callout'
import { Citation } from '@/components/Citation'
import { toISODate } from '@/lib/getDayIndex'

import { Bookmark } from 'lucide-react'

export function ThinkTab({ specialization }: { specialization: Specialization }) {
  const { activeDate, toggleFavorite, isFavorite } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()
  const t = getDynamicContentForDate('think', specialization, currentDate) as any
  if (!t) return null

  const ledgerId = `${specialization}_think__${toISODate(currentDate)}`
  const fav = isFavorite(ledgerId)

  return (
    <article aria-label="Think question">
      {/* The question */}
      <section className="think-question-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block" style={{ margin: 0 }}>
            Today's Question
          </span>
          <button
            onClick={() => toggleFavorite(ledgerId, specialization, 'think')}
            className="fav-toggle-btn"
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: fav ? 'var(--mba-accent)' : 'var(--mba-ink-faint)' }}
          >
            <Bookmark size={16} fill={fav ? 'var(--mba-accent)' : 'none'} />
          </button>
        </div>
        <p className="think-question font-display">{t.question}</p>
      </section>

      {/* Model answer */}
      <section className="think-answer-section">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-4">
          Model Answer
        </span>
        <AltitudeBlock
          content={t.modelAnswer}
          id={`think-${specialization}`}
          showCitations={false}
        />
      </section>

      {/* Alternate perspective */}
      <section className="think-alt-section">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-4">
          Alternate Perspective
        </span>
        <Callout
          specialization={specialization}
          label="Counter-view"
        >
          {t.alternatePerspective}
        </Callout>
      </section>

      {/* Citations */}
      {t.citations.length > 0 && (
        <div className="think-citations">
          <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">Sources</span>
          <span className="ml-2">{t.citations.map((c: any) => <Citation key={c.id} data={c} />)}</span>
        </div>
      )}

      {/* TODO: submission + AI feedback loop — Phase 5 */}

      <style jsx>{`
        .think-question-section {
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }
        .think-question {
          font-size: clamp(1.25rem, 1.1rem + 0.6vw, 1.75rem);
          font-weight: 600;
          color: var(--mba-ink);
          line-height: 1.3;
          max-width: var(--measure-desktop);
        }
        .think-answer-section {
          margin-bottom: var(--space-6);
        }
        .think-alt-section {
          margin-bottom: var(--space-5);
        }
        .think-citations {
          padding-top: var(--space-4);
          border-top: 1px solid var(--mba-rule);
          display: flex;
          align-items: center;
        }
      `}</style>
    </article>
  )
}
