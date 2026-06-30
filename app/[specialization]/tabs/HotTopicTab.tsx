import React from 'react'
import type { Specialization } from '@/lib/content/types'
import { marketingHotTopic } from '@/lib/content/marketing'
import { financeHotTopic } from '@/lib/content/finance'
import { consultingHotTopic } from '@/lib/content/consulting'
import { operationsHotTopic } from '@/lib/content/operations'
import { strategyHotTopic } from '@/lib/content/strategy'
import { peopleHotTopic } from '@/lib/content/people'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { getDynamicContentForDate } from '@/lib/content/getDynamicContent'
import { StakeholderTable } from '@/components/StakeholderTable'
import { ScenarioBlock } from '@/components/ScenarioBlock'
import { Citation } from '@/components/Citation'
import { Bookmark } from 'lucide-react'

export function HotTopicTab({ specialization }: { specialization: Specialization }) {
  const { activeDate, toggleFavorite, isFavorite } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()
  const h = getDynamicContentForDate('hot-topic', specialization, currentDate) as any
  if (!h) return null

  const ledgerId = `${specialization}_hotTopic__${h.date}`
  const fav = isFavorite(ledgerId)

  return (
    <article aria-label="Hot topic">
      <div className="ht-eyebrow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
            {h.date}
          </span>
          {h.citations.map((c: any) => <Citation key={c.id} data={c} />)}
        </div>

        <button
          onClick={() => toggleFavorite(ledgerId, specialization, 'hotTopic')}
          className="fav-toggle-btn"
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: fav ? 'var(--mba-accent)' : 'var(--mba-ink-faint)' }}
        >
          <Bookmark size={16} fill={fav ? 'var(--mba-accent)' : 'none'} />
        </button>
      </div>

      <h2 className="font-display ht-headline">{h.headline}</h2>

      <HtSection label="What Happened">
        <p className="font-body text-body text-mba-ink-soft prose-measure">{h.whatHappened}</p>
      </HtSection>

      <HtSection label="Root Cause">
        <p className="font-body text-body text-mba-ink-soft prose-measure">{h.rootCause}</p>
      </HtSection>

      <HtSection label="Stakeholder Impact">
        <StakeholderTable stakeholders={h.stakeholders} />
      </HtSection>

      <HtSection label="Business Implications">
        <p className="font-body text-body text-mba-ink-soft prose-measure">{h.businessImplications}</p>
      </HtSection>

      <HtSection label="Three Scenarios">
        <ScenarioBlock scenarios={h.scenarios} />
      </HtSection>

      <style jsx>{`
        .ht-eyebrow { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-3); }
        .ht-headline { font-size: var(--text-display); line-height: 1.2; color: var(--mba-ink); margin-bottom: var(--space-6); font-weight: 600; }
      `}</style>
    </article>
  )
}

function HtSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="ht-section">
      <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-4">{label}</h3>
      {children}
      <style jsx>{`
        .ht-section { padding: var(--space-6) 0; border-bottom: 1px solid var(--mba-rule); }
        .ht-section:last-child { border-bottom: none; }
      `}</style>
    </section>
  )
}
