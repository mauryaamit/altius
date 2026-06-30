'use client'
import React from 'react'
import type { AssumptionRow } from '@/lib/content/types'
import { Citation } from './Citation'

interface AssumptionTableProps {
  rows: AssumptionRow[]
  caption?: string
}

export function AssumptionTable({ rows, caption }: AssumptionTableProps) {
  return (
    <div className="assumption-table-wrap">
      {caption && (
        <p className="assumption-caption font-mono text-mono-label text-mba-ink-soft uppercase tracking-widest mb-3">
          {caption}
        </p>
      )}
      <div className="assumption-scroll">
        <table className="assumption-table">
          <thead>
            <tr>
              <th className="col-param font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
                Parameter
              </th>
              <th className="col-value font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
                Value
              </th>
              <th className="col-source font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
                Source
              </th>
              <th className="col-sensitivity font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
                Sensitivity
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="assumption-row">
                <td className="col-param font-body text-caption text-mba-ink">
                  {row.parameter}
                </td>
                <td className="col-value font-mono text-caption text-mba-ink tabular-nums">
                  {row.value}
                </td>
                <td className="col-source text-caption text-mba-ink-soft">
                  <span className="font-body">{row.source.source}</span>
                  <Citation data={row.source} />
                </td>
                <td className="col-sensitivity font-mono text-caption text-mba-ink-soft tabular-nums">
                  {row.sensitivity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .assumption-table-wrap {
          margin: var(--space-5) 0;
        }

        .assumption-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .assumption-table {
          border-collapse: collapse;
          width: 100%;
          min-width: 540px;
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .assumption-table thead {
          background: var(--mba-surface-sunk);
        }

        .assumption-table th,
        .assumption-table td {
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--mba-rule);
        }

        .assumption-table thead th {
          padding-top: var(--space-4);
          padding-bottom: var(--space-4);
        }

        .assumption-row:last-child td {
          border-bottom: none;
        }

        .assumption-row:hover td {
          background: var(--mba-surface-sunk);
        }

        .col-param { width: 30%; }
        .col-value { width: 20%; }
        .col-source { width: 30%; }
        .col-sensitivity { width: 20%; }
      `}</style>
    </div>
  )
}
