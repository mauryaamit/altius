import React from 'react'
import type { HotTopicStakeholder } from '@/lib/content/types'

interface StakeholderTableProps {
  stakeholders: HotTopicStakeholder[]
  caption?: string
}

export function StakeholderTable({ stakeholders, caption }: StakeholderTableProps) {
  return (
    <div className="stakeholder-wrap">
      {caption && (
        <p className="font-mono text-mono-label text-mba-ink-soft uppercase tracking-widest mb-3">
          {caption}
        </p>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="stakeholder-table">
          <thead>
            <tr>
              <th className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">Stakeholder</th>
              <th className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">Gains</th>
              <th className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">Loses</th>
            </tr>
          </thead>
          <tbody>
            {stakeholders.map((s, i) => (
              <tr key={i}>
                <td className="font-body text-caption text-mba-ink font-medium">{s.name}</td>
                <td className="font-body text-caption text-mba-ink-soft">{s.gains}</td>
                <td className="font-body text-caption text-mba-ink-soft">{s.loses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .stakeholder-wrap { margin: var(--space-5) 0; }
        .stakeholder-table {
          border-collapse: collapse;
          width: 100%;
          min-width: 480px;
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .stakeholder-table thead { background: var(--mba-surface-sunk); }
        .stakeholder-table th,
        .stakeholder-table td {
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--mba-rule);
        }
        .stakeholder-table tbody tr:last-child td { border-bottom: none; }
        .stakeholder-table tbody tr:hover td { background: var(--mba-surface-sunk); }
        .stakeholder-table td:first-child { width: 30%; }
      `}</style>
    </div>
  )
}
