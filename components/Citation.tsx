'use client'
import React, { useState, useRef, useEffect } from 'react'
import type { CitationData } from '@/lib/content/types'

interface CitationProps {
  data: CitationData
}

export function Citation({ data }: CitationProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <span ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="citation-tag"
        aria-label={`Citation: ${data.source}`}
        aria-expanded={open}
      >
        [{data.id}]
      </button>

      {open && (
        <span className="citation-popover" role="tooltip">
          <span className="block font-mono text-mono-label text-mba-ink-soft mb-1">
            SOURCE
          </span>
          <span className="block text-caption text-mba-ink font-body leading-snug">
            {data.source}
          </span>
          <span className="block text-mono-label font-mono text-mba-ink-faint mt-1">
            {data.date}
          </span>
          {data.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-mono-label font-mono text-mba-accent mt-1 underline underline-offset-2"
            >
              View source
            </a>
          )}
        </span>
      )}

      <style jsx>{`
        .citation-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7em;
          vertical-align: super;
          color: var(--mba-accent);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0 1px;
          line-height: 1;
          transition: opacity 0.15s ease;
        }
        .citation-tag:hover { opacity: 0.7; }

        .citation-popover {
          position: absolute;
          bottom: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          width: 260px;
          box-shadow: var(--shadow-md);
          z-index: 50;
          white-space: normal;
        }

        @media (max-width: 480px) {
          .citation-popover {
            left: 0;
            transform: none;
            width: 240px;
          }
        }
      `}</style>
    </span>
  )
}
