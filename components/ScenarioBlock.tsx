import React from 'react'
import type { Scenario } from '@/lib/content/types'

interface ScenarioBlockProps {
  scenarios: Scenario[]
}

const scenarioStyles: Record<string, { dot: string; label: string }> = {
  Best:   { dot: 'var(--mba-success)', label: 'text-mba-ink' },
  Worst:  { dot: 'var(--mba-danger)',  label: 'text-mba-ink' },
  Likely: { dot: 'var(--mba-accent)',  label: 'text-mba-ink' },
}

export function ScenarioBlock({ scenarios }: ScenarioBlockProps) {
  return (
    <div className="scenario-block">
      {scenarios.map((s) => {
        const style = scenarioStyles[s.label] || scenarioStyles.Likely
        return (
          <div key={s.label} className="scenario-item">
            <div className="scenario-header">
              <span
                className="scenario-dot"
                style={{ backgroundColor: style.dot }}
                aria-hidden="true"
              />
              <span className="font-mono text-mono-label text-mba-ink-soft uppercase tracking-widest">
                {s.label}
              </span>
            </div>
            <p className="scenario-text font-body text-body text-mba-ink-soft">
              {s.description}
            </p>
          </div>
        )
      })}

      <style jsx>{`
        .scenario-block {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin: var(--space-5) 0;
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .scenario-item {
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--mba-rule);
        }
        .scenario-item:last-child { border-bottom: none; }

        .scenario-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
        }

        .scenario-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .scenario-text {
          max-width: var(--measure-desktop);
          line-height: var(--leading-body);
          padding-left: 20px;  /* align with label */
        }
      `}</style>
    </div>
  )
}
