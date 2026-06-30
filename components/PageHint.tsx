'use client'
import React, { useState, useEffect } from 'react'
import { X, Info } from 'lucide-react'

interface PageHintProps {
  pageId: string
}

export function PageHint({ pageId }: PageHintProps) {
  const [visible, setVisible] = useState(false)
  const key = `altius-hint-${pageId}`

  useEffect(() => {
    const dismissed = localStorage.getItem(key)
    if (!dismissed) {
      setVisible(true)
    }
  }, [key])

  const handleDismiss = () => {
    localStorage.setItem(key, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="page-hint font-body">
      <div className="hint-content">
        <Info size={16} className="hint-icon text-mba-accent" />
        <span className="text-caption text-mba-ink-soft">
          <strong>Concepts</strong> is your reference library for this function. <strong>Case</strong>, <strong>Hot Topic</strong>, and <strong>Think</strong> refresh daily.
        </span>
      </div>
      <button onClick={handleDismiss} className="dismiss-btn" aria-label="Dismiss hint">
        <X size={16} />
      </button>

      <style jsx>{`
        .page-hint {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-left: 3px solid var(--mba-accent);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-4);
          gap: var(--space-3);
        }

        .hint-content {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .hint-icon {
          flex-shrink: 0;
        }

        .dismiss-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--mba-ink-faint);
          cursor: pointer;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dismiss-btn:hover {
          background: var(--mba-accent-soft);
          color: var(--mba-ink);
        }
      `}</style>
    </div>
  )
}
