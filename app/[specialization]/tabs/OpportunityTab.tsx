import React from 'react'
import { strategyOpportunity } from '@/lib/content/strategy'
import { Citation } from '@/components/Citation'
import { Lightbulb, ArrowRight } from 'lucide-react'

export function OpportunityTab() {
  const opp = strategyOpportunity

  return (
    <article aria-label="Founder opportunity">
      <div className="opp-eyebrow">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
          {opp.date} &middot; Founder Thinking
        </span>
        {opp.citations.map((c) => <Citation key={c.id} data={c} />)}
      </div>

      <OppSection label="Problem Statement">
        <p className="font-body text-body text-mba-ink prose-measure" style={{fontWeight: 500}}>
          {opp.problemStatement}
        </p>
      </OppSection>

      <OppSection label="Root Cause">
        <p className="font-body text-body text-mba-ink-soft prose-measure">{opp.rootCause}</p>
      </OppSection>

      <OppSection label="Solution Approaches">
        <div className="approach-list">
          {opp.approaches.map((approach, i) => (
            <div key={i} className="approach-item">
              <span className="approach-num font-mono text-mono-label text-mba-accent">0{i + 1}</span>
              <p className="font-body text-body text-mba-ink-soft prose-measure">{approach}</p>
            </div>
          ))}
        </div>
      </OppSection>

      <OppSection label="Action Step">
        <div className="action-box">
          <div className="action-header">
            <ArrowRight size={14} className="action-icon" aria-hidden="true" />
            <span className="font-mono text-mono-label text-mba-accent uppercase tracking-widest">This Week</span>
          </div>
          <p className="font-body text-body text-mba-ink prose-measure mt-3">{opp.actionStep}</p>
        </div>
      </OppSection>

      <style jsx>{`
        .opp-eyebrow { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-5); }
        .approach-list { display: flex; flex-direction: column; gap: var(--space-5); }
        .approach-item { display: flex; gap: var(--space-4); align-items: flex-start; }
        .approach-num { flex-shrink: 0; font-size: 1.5rem; line-height: 1; margin-top: 2px; }
        .action-box {
          padding: var(--space-5);
          background: var(--mba-accent-soft);
          border-radius: var(--radius-md);
          border-left: 3px solid var(--mba-accent);
        }
        .action-header { display: flex; align-items: center; gap: var(--space-2); }
        .action-icon { color: var(--mba-accent); }
      `}</style>
    </article>
  )
}

function OppSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="opp-section">
      <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-4">{label}</h3>
      {children}
      <style jsx>{`
        .opp-section { padding: var(--space-6) 0; border-bottom: 1px solid var(--mba-rule); }
        .opp-section:last-child { border-bottom: none; }
      `}</style>
    </section>
  )
}
