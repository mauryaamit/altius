import React from 'react'
import type { Specialization } from '@/lib/content/types'

interface CalloutProps {
  children: React.ReactNode
  specialization?: Specialization  // controls left-border chip color
  label?: string                   // small eyebrow above content
}

const chipVarMap: Record<string, string> = {
  marketing:   'var(--chip-marketing)',
  finance:     'var(--chip-finance)',
  consulting:  'var(--chip-consulting)',
  operations:  'var(--chip-operations)',
  strategy:    'var(--chip-strategy)',
  people:      'var(--chip-people)',
}

export function Callout({ children, specialization, label }: CalloutProps) {
  const borderColor = specialization
    ? chipVarMap[specialization]
    : 'var(--mba-accent)'

  return (
    <aside
      className="callout"
      style={{ borderLeftColor: borderColor }}
      aria-label={label || 'Alternate perspective'}
    >
      {label && (
        <span className="callout-label font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
          {label}
        </span>
      )}
      <div className="callout-body font-body text-body text-mba-ink-soft">
        {children}
      </div>

      <style jsx>{`
        .callout {
          border-left: 3px solid var(--mba-accent);
          padding: var(--space-4) var(--space-5);
          background: var(--mba-surface-sunk);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          margin: var(--space-5) 0;
        }

        .callout-label {
          display: block;
          margin-bottom: var(--space-3);
        }

        .callout-body {
          line-height: var(--leading-body);
          max-width: var(--measure-desktop);
        }
      `}</style>
    </aside>
  )
}
