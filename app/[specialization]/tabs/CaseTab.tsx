import React from 'react'
import type { Specialization } from '@/lib/content/types'
import { marketingCase } from '@/lib/content/marketing'
import { financeCase } from '@/lib/content/finance'
import { consultingCase } from '@/lib/content/consulting'
import { operationsCase } from '@/lib/content/operations'
import { strategyCase } from '@/lib/content/strategy'
import { peopleCase } from '@/lib/content/people'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { getDynamicContentForDate } from '@/lib/content/getDynamicContent'
import { AssumptionTable } from '@/components/AssumptionTable'
import { Citation } from '@/components/Citation'
import { AlertTriangle, Bookmark } from 'lucide-react'

export function CaseTab({ specialization }: { specialization: Specialization }) {
  const { activeDate, toggleFavorite, isFavorite } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()
  const c = getDynamicContentForDate('case', specialization, currentDate) as any
  if (!c) return null

  const ledgerId = `${specialization}_case__${c.date}`
  const fav = isFavorite(ledgerId)

  return (
    <article aria-label={`Case study: ${c.company}`}>
      {/* Eyebrow */}
      <div className="case-eyebrow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
            {c.date} &middot; {c.sector}
          </span>
          {c.citations.map((cit: any) => <Citation key={cit.id} data={cit} />)}
        </div>

        <button
          onClick={() => toggleFavorite(ledgerId, specialization, 'case')}
          className="fav-toggle-btn"
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: fav ? 'var(--mba-accent)' : 'var(--mba-ink-faint)' }}
        >
          <Bookmark size={16} fill={fav ? 'var(--mba-accent)' : 'none'} />
        </button>
      </div>

      <h2 className="font-display case-title">{c.company}</h2>

      {/* Background */}
      <Section label="Background">
        <p className="font-body text-body text-mba-ink-soft prose-measure">{c.background}</p>
      </Section>

      {/* Data Exhibits */}
      {c.dataExhibits && c.dataExhibits.length > 0 && (
        <Section label="Data Exhibits">
          <AssumptionTable rows={c.dataExhibits} />
        </Section>
      )}

      {/* Dilemma */}
      <Section label="The Dilemma">
        <p className="font-body text-body text-mba-ink prose-measure" style={{fontWeight: 500}}>
          {c.dilemma}
        </p>
      </Section>

      {/* Stakeholders */}
      <Section label="Stakeholders">
        <div className="stakeholder-list">
          {c.stakeholders.map((s: any, i: number) => (
            <div key={i} className="stakeholder-row">
              <span className="stakeholder-name font-body text-caption text-mba-ink" style={{fontWeight: 600}}>{s.name}</span>
              <span className="font-mono text-mono-label text-mba-ink-faint">{s.role}</span>
              <p className="font-body text-caption text-mba-ink-soft mt-1">{s.interest}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 4-Lens Breakdown */}
      <Section label="4-Lens Analysis">
        {(['strategy', 'finance', 'marketing', 'operations'] as const).map((lens) => (
          <div key={lens} className="lens-block">
            <h4 className="font-mono text-mono-label text-mba-ink-soft uppercase tracking-widest mb-2">{lens}</h4>
            <p className="font-body text-body text-mba-ink-soft prose-measure">
              {c.lenses[lens]}
            </p>
          </div>
        ))}
      </Section>

      {/* Recommendation */}
      <Section label="Recommended Approach">
        <p className="font-body text-body text-mba-ink prose-measure">{c.recommendation}</p>
        {/* TODO: submission + AI feedback loop — Phase 5 */}
      </Section>

      {/* Common Mistakes */}
      <Section label="Common Mistakes">
        <div className="mistakes-box">
          <div className="mistakes-header">
            <AlertTriangle size={14} className="mistakes-icon" />
            <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">Watch out for</span>
          </div>
          <ul className="mistakes-list">
            {c.commonMistakes.map((m: any, i: number) => (
              <li key={i} className="font-body text-body text-mba-ink-soft">{m}</li>
            ))}
          </ul>
        </div>
      </Section>

      <style jsx>{`
        .case-eyebrow { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-3); }
        .case-title { font-size: var(--text-display); line-height: 1.15; color: var(--mba-ink); margin-bottom: var(--space-6); font-weight: 600; }
        .stakeholder-list { display: flex; flex-direction: column; gap: var(--space-4); }
        .stakeholder-row { padding: var(--space-4); background: var(--mba-surface-sunk); border-radius: var(--radius-md); }
        .stakeholder-name { display: block; margin-bottom: var(--space-1); }
        .lens-block { padding: var(--space-5) 0; border-bottom: 1px solid var(--mba-rule); }
        .lens-block:last-child { border-bottom: none; }
        .mistakes-box { padding: var(--space-5); background: var(--mba-surface-sunk); border-radius: var(--radius-md); border: 1px solid var(--mba-rule); }
        .mistakes-header { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-3); }
        .mistakes-icon { color: var(--mba-warning); }
        .mistakes-list { padding-left: var(--space-5); display: flex; flex-direction: column; gap: var(--space-3); }
        .mistakes-list li { list-style-type: disc; }
      `}</style>
    </article>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="case-section">
      <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-4">
        {label}
      </h3>
      {children}
      <style jsx>{`
        .case-section {
          padding: var(--space-6) 0;
          border-bottom: 1px solid var(--mba-rule);
        }
        .case-section:last-child { border-bottom: none; }
      `}</style>
    </section>
  )
}
