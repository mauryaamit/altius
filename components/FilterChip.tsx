import React from 'react'
import type { PulseFilter, GDTag } from '@/lib/content/types'

type FilterValue = PulseFilter | GDTag | string

interface FilterChipProps {
  label: FilterValue
  active: boolean
  onClick: () => void
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`filter-chip ${active ? 'filter-chip--active' : ''}`}
      aria-pressed={active}
    >
      <span className="font-mono text-mono-label uppercase tracking-widest">
        {label}
      </span>

      <style jsx>{`
        .filter-chip {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--mba-rule);
          background: transparent;
          color: var(--mba-ink-faint);
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .filter-chip:hover {
          border-color: var(--mba-accent);
          color: var(--mba-ink-soft);
        }

        .filter-chip--active {
          background: var(--mba-accent-soft);
          border-color: var(--mba-accent);
          color: var(--mba-accent);
        }

        @media (prefers-reduced-motion: reduce) {
          .filter-chip { transition: none; }
        }
      `}</style>
    </button>
  )
}
