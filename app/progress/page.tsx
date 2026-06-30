'use client'
import React, { useEffect, useState } from 'react'
import { Flame, CheckCircle, AlertCircle, HelpCircle, Activity } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useMbaStore } from '@/lib/stores/mbaStore'

// Mock chart data for last 7 days of reviews
const MOCK_ACTIVITY_DATA = [
  { day: 'Mon', reviews: 4 },
  { day: 'Tue', reviews: 7 },
  { day: 'Wed', reviews: 5 },
  { day: 'Thu', reviews: 12 },
  { day: 'Fri', reviews: 8 },
  { day: 'Sat', reviews: 15 },
  { day: 'Sun', reviews: 9 },
]

export default function ProgressPage() {
  const [isMounted, setIsMounted] = useState(false)
  const store = useMbaStore()

  useEffect(() => {
    setIsMounted(true)
    // Automatically bump streak on progress load if active today
    store.bumpStreak()
  }, [])

  if (!isMounted) {
    return (
      <div className="loading-state">
        <p className="font-mono text-mono-label text-mba-ink-faint">Loading progress profile...</p>
      </div>
    )
  }

  // Calculate statistics from the store
  const allRecords = Object.values(store.recallRecords).flat()
  const latestRecordsMap = new Map<string, string>()

  // Map each concept ID to its latest review result
  for (const record of allRecords) {
    const existing = latestRecordsMap.get(record.conceptId)
    if (!existing || record.date > existing) {
      latestRecordsMap.set(record.conceptId, record.result)
    }
  }

  const masteredCount = Array.from(latestRecordsMap.values()).filter((r) => r === 'got-it').length
  const learningCount = Array.from(latestRecordsMap.values()).filter((r) => r === 'shaky').length
  const reviewNeededCount = Array.from(latestRecordsMap.values()).filter((r) => r === 'no').length
  const totalReviewed = latestRecordsMap.size

  const dueForReview = store.getConceptsDueForReview()

  return (
    <div>
      <header className="progress-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">Utility</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>Progress</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          Your personal spaced-repetition profile, daily streaks, and memory stability analytics.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon text-mba-warning">
            <Flame size={20} />
          </div>
          <div className="stat-card-content">
            <span className="font-mono text-mono-label text-mba-ink-faint uppercase">Streak</span>
            <span className="stat-value font-display">{store.streak} Days</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon text-mba-accent">
            <AlertCircle size={20} />
          </div>
          <div className="stat-card-content">
            <span className="font-mono text-mono-label text-mba-ink-faint uppercase">Due Now</span>
            <span className="stat-value font-display">{dueForReview.length} Items</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon text-mba-success">
            <CheckCircle size={20} />
          </div>
          <div className="stat-card-content">
            <span className="font-mono text-mono-label text-mba-ink-faint uppercase">Mastered</span>
            <span className="stat-value font-display">{masteredCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon text-mba-ink-soft">
            <Activity size={20} />
          </div>
          <div className="stat-card-content">
            <span className="font-mono text-mono-label text-mba-ink-faint uppercase">Total Traced</span>
            <span className="stat-value font-display">{totalReviewed}</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="progress-section chart-section">
        <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-4">
          Desk Activity (7-Day Trend)
        </h3>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--mba-rule)" />
              <XAxis
                dataKey="day"
                stroke="var(--mba-ink-faint)"
                tick={{ fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis
                stroke="var(--mba-ink-faint)"
                tick={{ fontSize: 11, fontFamily: 'monospace' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--mba-surface)',
                  borderColor: 'var(--mba-rule)',
                  fontSize: 12,
                  fontFamily: 'monospace',
                  borderRadius: 4,
                }}
              />
              <Line
                type="monotone"
                dataKey="reviews"
                stroke="var(--mba-accent)"
                strokeWidth={2}
                dot={{ stroke: 'var(--mba-accent)', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Review Queue */}
      <div className="progress-section">
        <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-4">
          Spaced-Repetition Review Queue
        </h3>
        {dueForReview.length > 0 ? (
          <div className="review-queue-list">
            {dueForReview.map((rec) => (
              <div key={rec.conceptId} className="review-item">
                <div className="review-item-info">
                  <span className="font-mono text-mono-label text-mba-ink-faint uppercase block mb-1">
                    ID: {rec.conceptId}
                  </span>
                  <span className="font-body text-body text-mba-ink" style={{ fontWeight: 500 }}>
                    Concept due for memory stabilization
                  </span>
                </div>
                <div className="review-item-action">
                  <span className={`review-badge font-mono text-mono-label result-${rec.result}`}>
                    Last: {rec.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-queue-box">
            <CheckCircle size={28} className="text-mba-success mb-2" />
            <p className="font-body text-body text-mba-ink-soft">
              All concepts are stable in memory. Your queue is clear!
            </p>
          </div>
        )}
      </div>

      {/* Category breakdown summary */}
      <div className="progress-section">
        <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-4">
          Concept Memory Breakdown
        </h3>
        <div className="breakdown-cards">
          <div className="breakdown-card">
            <span className="font-mono text-mono-label text-mba-success uppercase block mb-1">Mastered</span>
            <span className="font-display breakdown-num">{masteredCount}</span>
            <p className="font-body text-mono-label text-mba-ink-faint mt-1">High retention likelihood</p>
          </div>
          <div className="breakdown-card">
            <span className="font-mono text-mono-label text-mba-warning uppercase block mb-1">Shaky</span>
            <span className="font-display breakdown-num">{learningCount}</span>
            <p className="font-body text-mono-label text-mba-ink-faint mt-1">Review again soon</p>
          </div>
          <div className="breakdown-card">
            <span className="font-mono text-mono-label text-mba-ink-soft uppercase block mb-1">Unrecalled</span>
            <span className="font-display breakdown-num">{reviewNeededCount}</span>
            <p className="font-body text-mono-label text-mba-ink-faint mt-1">Needs structural review</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-state {
          padding: var(--space-8) 0;
          text-align: center;
        }
        .progress-header { border-left: 3px solid var(--mba-accent); padding-left: var(--space-4);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
          margin-bottom: var(--space-7);
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-4);
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
        }
        .stat-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          flex-shrink: 0;
        }
        .stat-card-content {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: var(--text-h3);
          color: var(--mba-ink);
          font-weight: 600;
          line-height: 1.2;
        }
        .progress-section {
          margin-bottom: var(--space-7);
          padding: var(--space-5);
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
        }
        .empty-queue-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-6) 0;
          text-align: center;
        }
        .review-queue-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .review-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3) var(--space-4);
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
        }
        .review-badge {
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }
        .result-got-it { background: var(--mba-success-soft); color: var(--mba-success); }
        .result-shaky { background: var(--mba-warning-soft); color: var(--mba-warning); }
        .result-no { background: var(--mba-rule); color: var(--mba-ink-soft); }
        
        .breakdown-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4);
        }
        @media (max-width: 640px) {
          .breakdown-cards {
            grid-template-columns: 1fr;
          }
        }
        .breakdown-card {
          padding: var(--space-4);
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
        }
        .breakdown-num {
          font-size: var(--text-h2);
          color: var(--mba-ink);
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
