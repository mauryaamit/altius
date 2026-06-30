'use client'
import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { toISODate } from '@/lib/getDayIndex'

export function DateNav() {
  const { activeDate, setActiveDate } = useMbaStore()
  
  const today = new Date()
  const currentDate = activeDate ? new Date(activeDate) : today
  
  const todayStr = toISODate(today)
  const currentStr = toISODate(currentDate)
  const isToday = currentStr === todayStr
  
  // Start date boundary is June 1, 2026 (or 30 days prior)
  const START_DATE = new Date('2026-06-01')
  const isStartBound = currentStr === '2026-06-01' || currentDate.getTime() <= START_DATE.getTime()
  
  const handleYesterday = () => {
    if (isStartBound) return
    const prev = new Date(currentDate.getTime() - 86400000)
    setActiveDate(prev)
  }
  
  const handleTomorrow = () => {
    if (isToday) return
    const next = new Date(currentDate.getTime() + 86400000)
    if (toISODate(next) === todayStr) {
      setActiveDate(null)
    } else {
      setActiveDate(next)
    }
  }
  
  const day = currentDate.getDate()
  const month = currentDate.toLocaleDateString('en-IN', { month: 'long' })
  const centerLabel = isToday ? `Today, ${day} ${month}` : `${day} ${month}`
  
  return (
    <div className="date-nav-container">
      <div className="date-nav-inner">
        <button
          onClick={handleYesterday}
          disabled={isStartBound}
          className={`nav-btn prev font-mono ${isStartBound ? 'disabled' : ''}`}
          aria-label="Go to yesterday"
        >
          <ChevronLeft size={14} />
          <span>Yesterday</span>
        </button>
        
        <div className="current-date font-display">
          {centerLabel}
        </div>
        
        <button
          onClick={handleTomorrow}
          disabled={isToday}
          className={`nav-btn next font-mono ${isToday ? 'disabled' : ''}`}
          aria-label="Go to tomorrow"
          aria-disabled={isToday}
        >
          <span>Tomorrow</span>
          <ChevronRight size={14} />
        </button>
      </div>
      <style jsx>{`
        .date-nav-container {
          width: 100%;
          border-bottom: 1px solid var(--mba-rule);
          padding-bottom: var(--space-4);
          margin-bottom: var(--space-5);
        }
        .date-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: var(--measure-desktop, 680px);
          margin: 0 auto;
        }
        .nav-btn {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          background: none;
          border: none;
          color: var(--mba-ink);
          font-size: var(--text-mono-label, 11px);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: opacity 150ms ease, color 150ms ease;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
        }
        .nav-btn:hover:not(.disabled) {
          color: var(--mba-accent);
        }
        .nav-btn.disabled {
          color: var(--mba-ink-faint) !important;
          cursor: not-allowed;
          pointer-events: none;
        }
        .current-date {
          font-size: var(--text-body, 15px);
          font-weight: 700;
          color: var(--mba-ink);
        }
      `}</style>
    </div>
  )
}
