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
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([])

  function handleSelect(value: RecallResult, e: React.MouseEvent<HTMLButtonElement>) {
    setSelected(value)
    addRecall(conceptId, value)
    setSaved(true)

    if (value === 'got-it') {
      const rect = e.currentTarget.getBoundingClientRect()
      const newParticles = Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16 + Math.random() * 20
        const distance = 35 + Math.random() * 35
        const x = Math.cos((angle * Math.PI) / 180) * distance
        const y = Math.sin((angle * Math.PI) / 180) * distance
        const colors = [
          'var(--mba-accent)',
          'var(--chip-marketing)',
          'var(--chip-finance)',
          'var(--chip-consulting)',
          'var(--chip-operations)',
          'var(--chip-strategy)',
          'var(--chip-people)'
        ]
        const color = colors[Math.floor(Math.random() * colors.length)]

        return {
          id: Math.random(),
          x,
          y,
          color
        }
      })
      setParticles(newParticles)
      setTimeout(() => setParticles([]), 800)
    }
  }

  return (
    <div className="recall-check" role="group" aria-label="How well do you know this?">
      <span className="recall-label font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
        {label || 'How well do you know this?'}
      </span>

      <div className="recall-buttons" style={{ position: 'relative' }}>
        {buttons.map((btn) => {
          const isActive = selected === btn.value
          return (
            <button
              key={btn.value}
              onClick={(e) => handleSelect(btn.value, e)}
              className={`recall-btn ${isActive ? 'recall-btn--active' : ''}`}
              aria-pressed={isActive}
              title={btn.description}
            >
              {btn.label}
            </button>
          )
        })}

        {/* Confetti Particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle-dot"
            style={{
              '--x': `${p.x}px`,
              '--y': `${p.y}px`,
              '--color': p.color
            } as React.CSSProperties}
          />
        ))}
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

        .particle-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color);
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: burst 750ms cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        @keyframes burst {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0.2);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .recall-btn { transition: none; }
          .particle-dot { display: none; }
        }
      `}</style>
    </div>
  )
}
