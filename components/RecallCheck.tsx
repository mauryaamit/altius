'use client'
import React, { useState } from 'react'
import { useMbaStore } from '@/lib/stores/mbaStore'
import type { RecallResult } from '@/lib/content/types'

interface RecallCheckProps {
  conceptId: string
  label?: string  // optional label above the buttons
}

const buttons: { label: string; value: RecallResult; description: string }[] = [
  { label: 'Got it',  value: 'got-it', description: 'Review in 7 days' },
  { label: 'Shaky',  value: 'shaky',  description: 'Review in 3 days' },
  { label: 'No',     value: 'no',     description: 'Review tomorrow'  },
]

export function RecallCheck({ conceptId, label }: RecallCheckProps) {
  const { addRecall, getRecallForConcept } = useMbaStore()
  const existing = getRecallForConcept(conceptId)
  const [selected, setSelected] = useState<RecallResult | null>(existing?.result ?? null)
  const [saved, setSaved] = useState(!!existing)

  function handleSelect(value: RecallResult) {
    setSelected(value)
    addRecall(conceptId, value)
    setSaved(true)
    // TODO: write to Firestore — Phase 5
  }

  return (
    <div className="recall-check" role="group" aria-label="How well do you know this?">
      <span className="recall-label font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
        {label || 'How well do you know this?'}
      </span>

      <div className="recall-buttons">
        {buttons.map((btn) => {
          const isActive = selected === btn.value
          return (
            <button
              key={btn.value}
              onClick={() => handleSelect(btn.value)}
              className={`recall-btn ${isActive ? 'recall-btn--active' : ''}`}
              aria-pressed={isActive}
              title={btn.description}
            >
              {btn.label}
            </button>
          )
        })}
      </div>

      {saved && selected && (
        <span className="recall-saved font-mono text-mono-label text-mba-ink-faint">
          {buttons.find((b) => b.value === selected)?.description}
        </span>
      )}

      <style jsx>{`
        .recall-check {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4) 0;
          flex-wrap: wrap;
        }

        .recall-label {
          flex-shrink: 0;
        }

        .recall-buttons {
          display: flex;
          gap: var(--space-2);
        }

        .recall-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: var(--text-caption);
          font-weight: 500;
          color: var(--mba-ink-soft);
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: 4px 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .recall-btn:hover {
          border-color: var(--mba-accent);
          color: var(--mba-accent);
        }

        .recall-btn--active {
          background: var(--mba-accent-soft);
          border-color: var(--mba-accent);
          color: var(--mba-accent);
          font-weight: 600;
        }

        .recall-saved {
          margin-left: var(--space-2);
        }

        @media (prefers-reduced-motion: reduce) {
          .recall-btn { transition: none; }
        }
      `}</style>
    </div>
  )
}
