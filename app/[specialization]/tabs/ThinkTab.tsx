import React from 'react'
import type { Specialization } from '@/lib/content/types'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { AltitudeBlock } from '@/components/AltitudeBlock'
import { Callout } from '@/components/Callout'
import { Citation } from '@/components/Citation'
import { Bookmark, Heart } from 'lucide-react'
import { NoteEditor } from '@/components/NoteEditor'
import { useDailyContent } from '@/lib/hooks/useDailyContent'

export function ThinkTab({ specialization }: { specialization: Specialization }) {
  const { activeDate, toggleFavorite, isFavorite } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()
  const dateStr = currentDate.toISOString().slice(0, 10)
  const ledgerId = `${specialization}_think__${dateStr}`
  
  const { data: t, loading, error } = useDailyContent<any>(specialization, 'think', currentDate)
  const isHeart = isFavorite(ledgerId, 'heart')
  const isBookmark = isFavorite(ledgerId, 'bookmark')

  if (loading) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8 animate-pulse text-center">
        Loading today's fresh briefing...
      </div>
    )
  }

  if (error || !t) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8 text-center">
        Failed to load content. Gracefully recovering...
      </div>
    )
  }

  return (
    <article aria-label="Think question">
      {/* The question */}
      <section className="think-question-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block" style={{ margin: 0 }}>
            Today's Question
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              onClick={() => toggleFavorite(ledgerId, specialization, 'think', 'heart')}
              className="fav-toggle-btn"
              aria-label={isHeart ? 'Remove from favorites' : 'Add to favorites'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isHeart ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
            >
              <Heart size={15} fill={isHeart ? 'var(--mba-accent)' : 'none'} />
            </button>
            <button
              onClick={() => toggleFavorite(ledgerId, specialization, 'think', 'bookmark')}
              className="fav-toggle-btn"
              aria-label={isBookmark ? 'Remove from bookmarks' : 'Add to bookmarks'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmark ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
            >
              <Bookmark size={15} fill={isBookmark ? 'var(--mba-accent)' : 'none'} />
            </button>
          </div>
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

      <NoteEditor
        contentRef={ledgerId}
        contentTitle={t.question}
        contentType="think"
        page={specialization}
      />

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
