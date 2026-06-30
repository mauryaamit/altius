'use client'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { AltitudeBlockContent, CitationData } from '@/lib/content/types'
import { Citation } from './Citation'

interface AltitudeBlockProps {
  content: AltitudeBlockContent
  id?: string  // for RecallCheck pairing
  showCitations?: boolean
}

export function AltitudeBlock({ content, id, showCitations = true }: AltitudeBlockProps) {
  const [depthOpen, setDepthOpen] = useState(false)

  return (
    <article className="altitude-block" aria-label="Concept explainer">
      {/* Hook — bold, text-h3 */}
      <p className="altitude-hook">{content.hook}</p>

      {/* Plain — body face, ink-soft, 2-4 sentences */}
      <p className="altitude-plain">{content.plain}</p>

      {/* Depth — collapsible */}
      <div className="altitude-depth-container">
        <button
          className="altitude-toggle"
          onClick={() => setDepthOpen((v) => !v)}
          aria-expanded={depthOpen}
          aria-controls={id ? `depth-${id}` : undefined}
        >
          <span className="font-mono text-mono-label tracking-widest uppercase text-mba-accent">
            {depthOpen ? 'Collapse' : 'Go deeper'}
          </span>
          {depthOpen
            ? <ChevronUp size={14} className="text-mba-accent" />
            : <ChevronDown size={14} className="text-mba-accent" />
          }
        </button>

        {depthOpen && (
          <div
            id={id ? `depth-${id}` : undefined}
            className="altitude-depth"
          >
            <p className="altitude-depth-text">{content.depth}</p>

            {/* Citations */}
            {showCitations && content.citations && content.citations.length > 0 && (
              <div className="altitude-citations">
                <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
                  Sources
                </span>
                <span className="ml-2">
                  {content.citations.map((c) => (
                    <Citation key={c.id} data={c} />
                  ))}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .altitude-block {
          padding: var(--space-5) 0;
          border-bottom: 1px solid var(--mba-rule);
        }
        .altitude-block:last-child {
          border-bottom: none;
        }

        .altitude-hook {
          font-family: 'DM Sans', sans-serif;
          font-size: var(--text-h3);
          font-weight: 600;
          color: var(--mba-ink);
          line-height: var(--leading-tight);
          margin-bottom: var(--space-3);
          max-width: var(--measure-desktop);
        }

        .altitude-plain {
          font-family: 'DM Sans', sans-serif;
          font-size: var(--text-body);
          color: var(--mba-ink-soft);
          line-height: var(--leading-body);
          max-width: var(--measure-desktop);
          margin-bottom: var(--space-4);
        }

        .altitude-depth-container {
          margin-top: var(--space-2);
        }

        .altitude-toggle {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--space-1) 0;
          transition: opacity 0.15s ease;
        }
        .altitude-toggle:hover { opacity: 0.7; }

        .altitude-depth {
          margin-top: var(--space-4);
          padding: var(--space-5);
          background: var(--mba-surface-sunk);
          border-radius: var(--radius-md);
          border-left: 3px solid var(--mba-accent);
        }

        .altitude-depth-text {
          font-family: 'DM Sans', sans-serif;
          font-size: var(--text-body);
          color: var(--mba-ink);
          line-height: var(--leading-body);
          max-width: var(--measure-desktop);
        }

        .altitude-citations {
          margin-top: var(--space-4);
          padding-top: var(--space-3);
          border-top: 1px solid var(--mba-rule);
          display: flex;
          align-items: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .altitude-toggle { transition: none; }
        }
      `}</style>
    </article>
  )
}
