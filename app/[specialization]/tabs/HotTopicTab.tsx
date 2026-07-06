import React from 'react'
import type { Specialization } from '@/lib/content/types'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { StakeholderTable } from '@/components/StakeholderTable'
import { ScenarioBlock } from '@/components/ScenarioBlock'
import { Citation } from '@/components/Citation'
import { Bookmark, Heart } from 'lucide-react'
import { NoteEditor } from '@/components/NoteEditor'
import { useDailyContent } from '@/lib/hooks/useDailyContent'

export function HotTopicTab({ specialization }: { specialization: Specialization }) {
  const { activeDate, toggleFavorite, isFavorite } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()
  const dateStr = currentDate.toISOString().slice(0, 10)
  const ledgerId = `${specialization}_hotTopic__${dateStr}`
  
  const { data: h, loading, error } = useDailyContent<any>(specialization, 'hotTopic', currentDate)
  const isHeart = isFavorite(ledgerId, 'heart')
  const isBookmark = isFavorite(ledgerId, 'bookmark')

  if (loading) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8 animate-pulse text-center">
        Loading today's fresh briefing...
      </div>
    )
  }

  if (error || !h) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8 text-center">
        Failed to load content. Gracefully recovering...
      </div>
    )
  }

  return (
    <article aria-label="Hot topic">
      <div className="ht-eyebrow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
            {h.date}
          </span>
          {h.citations.map((c: any) => <Citation key={c.id} data={c} />)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button
            onClick={() => toggleFavorite(ledgerId, specialization, 'hotTopic', 'heart')}
            className="fav-toggle-btn"
            aria-label={isHeart ? 'Remove from favorites' : 'Add to favorites'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isHeart ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
          >
            <Heart size={15} fill={isHeart ? 'var(--mba-accent)' : 'none'} />
          </button>
          <button
            onClick={() => toggleFavorite(ledgerId, specialization, 'hotTopic', 'bookmark')}
            className="fav-toggle-btn"
            aria-label={isBookmark ? 'Remove from bookmarks' : 'Add to bookmarks'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmark ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
          >
            <Bookmark size={15} fill={isBookmark ? 'var(--mba-accent)' : 'none'} />
          </button>
        </div>
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

      <NoteEditor
        contentRef={ledgerId}
        contentTitle={h.headline}
        contentType="hotTopic"
        page={specialization}
      />

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
