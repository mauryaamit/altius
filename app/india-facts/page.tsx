'use client'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { indiaFactSections } from '@/lib/content/indiaFacts'
import { Citation } from '@/components/Citation'
import { TrendArrow } from '@/components/TrendArrow'
import type { IndiaFactCategory } from '@/lib/content/types'

export default function IndiaFactsPage() {
  // Open the first category ('Macro') by default
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    Macro: true,
  })

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <div>
      <header className="facts-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">Knowledge</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>India Facts</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          Essential macroeconomic, demographic, and social indicators updated with the latest institutional data.
        </p>
      </header>

      <div className="facts-sections">
        {indiaFactSections.map((section) => {
          const isOpen = !!openCategories[section.category]
          return (
            <section key={section.category} className="facts-category-group">
              <button
                className="facts-category-header"
                onClick={() => toggleCategory(section.category)}
                aria-expanded={isOpen}
              >
                <h2 className="font-body text-h3 text-mba-ink" style={{ fontWeight: 600 }}>
                  {section.category}
                </h2>
                <div className="facts-category-meta">
                  <span className="font-mono text-mono-label text-mba-ink-faint mr-3">
                    {section.facts.length} indicators
                  </span>
                  {isOpen ? <ChevronUp size={16} className="chevron" /> : <ChevronDown size={16} className="chevron" />}
                </div>
              </button>

              {isOpen && (
                <div className="facts-grid">
                  {section.facts.map((fact, idx) => (
                    <div key={idx} className="fact-card">
                      <div className="fact-value-container">
                        <span className="font-mono text-h2 text-mba-ink tabular-nums mr-2" style={{ fontSize: '24px', fontWeight: 600 }}>
                          {fact.value}
                        </span>
                        <TrendArrow direction={fact.trend} />
                        <span className="ml-1">
                          <Citation data={fact.citation} />
                        </span>
                      </div>
                      <div className="fact-label font-mono text-mono-label text-mba-ink-soft uppercase tracking-widest mt-1">
                        {fact.label}
                      </div>
                      {fact.note && (
                        <p className="fact-note font-body text-mba-ink-faint mt-1" style={{ fontSize: '11px', fontStyle: 'italic', lineHeight: '1.3' }}>
                          {fact.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      <style jsx>{`
        .facts-header {
          border-left: 3px solid var(--mba-accent); padding-left: var(--space-4); padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }
        .facts-sections {
          display: flex;
          flex-direction: column;
        }
        .facts-category-group {
          border-bottom: 1px solid var(--mba-rule);
        }
        .facts-category-group:last-child {
          border-bottom: none;
        }
        .facts-category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          background: none;
          border: none;
          padding: var(--space-5) 0;
          cursor: pointer;
        }
        .facts-category-header:hover h2 {
          color: var(--mba-accent);
        }
        .facts-category-meta {
          display: flex;
          align-items: center;
          color: var(--mba-ink-faint);
        }
        .facts-grid {
          padding: 0 0 var(--space-5) 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }
        @media (max-width: 640px) {
          .facts-grid {
            grid-template-columns: 1fr;
          }
        }
        .fact-card {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--space-4) var(--space-5);
          background: var(--mba-surface-sunk);
          border-radius: var(--radius-md);
          border: 1px solid var(--mba-rule);
        }
        .fact-value-container {
          display: flex;
          align-items: center;
        }
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  )
}
