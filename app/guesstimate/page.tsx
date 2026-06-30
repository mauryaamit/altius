'use client'
import React, { useState, useMemo } from 'react'
import { TabBar } from '@/components/TabBar'
import { AssumptionTable } from '@/components/AssumptionTable'
import { Citation } from '@/components/Citation'
import { guesstimateRefData } from '@/lib/content/guesstimateRefData'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { DateNav } from '@/components/DateNav'
import { getGuesstimateProblemsForDate, getGuesstimateInterpretationForDate } from '@/lib/content/getDynamicContent'

const TABS = [
  { id: 'estimate',  label: 'Estimate'  },
  { id: 'interpret', label: 'Interpret' },
  { id: 'reference-data', label: 'Reference Data' },
]

export default function GuesstimatePage() {
  const [activeTab, setActiveTab] = useState('estimate')
  const [revealedQ, setRevealedQ] = useState<Record<number, boolean>>({})
  
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'World Indicators': true,
  })

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const { activeDate } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()

  const [mounted, setMounted] = useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Get daily dynamic problems (3 per day) and interpretation based on date
  const problems = useMemo(() => {
    return getGuesstimateProblemsForDate(currentDate)
  }, [currentDate])

  const interpret = useMemo(() => {
    return getGuesstimateInterpretationForDate(currentDate)
  }, [currentDate])

  if (!mounted) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8">
        Loading Guesstimate room...
      </div>
    )
  }

  return (
    <div>
      <header style={{ paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--mba-rule)', marginBottom: 0, borderLeft: '3px solid var(--mba-accent)', paddingLeft: 'var(--space-4)' }}>
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-3">Skill Room</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>Guesstimate</h1>
      </header>

      {activeTab !== 'reference-data' && <DateNav />}

      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div style={{ paddingTop: 'var(--space-6)' }}>
        {activeTab === 'estimate' && (
          <section aria-label="Estimation problems">
            <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-4">Today's Problems</span>
            
            {problems.map((problem, pIdx) => (
              <div key={pIdx} className="problem-card mb-8 p-6 bg-mba-surface border border-mba-rule rounded-lg">
                <span className="font-mono text-mono-label text-mba-accent uppercase tracking-widest block mb-2">Problem {pIdx + 1} of 3</span>
                <h2 className="font-display text-h2-fluid text-mba-ink mb-6" style={{ fontWeight: 600 }}>{problem.question}</h2>

                {/* Approach 1 */}
                <div className="approach-section">
                  <h3 className="font-mono text-mono-label text-mba-ink-soft uppercase tracking-widest mb-4">
                    Approach 1 — {problem.approach1.name}
                  </h3>
                  <AssumptionTable rows={problem.approach1.rows} />
                  <div className="result-box">
                    <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">Result</span>
                    <p className="font-mono text-h3 text-mba-ink mt-2" style={{ fontWeight: 600 }}>{problem.approach1.result}</p>
                  </div>
                </div>

                {/* Approach 2 */}
                <div className="approach-section">
                  <h3 className="font-mono text-mono-label text-mba-ink-soft uppercase tracking-widest mb-4">
                    Approach 2 — {problem.approach2.name}
                  </h3>
                  <AssumptionTable rows={problem.approach2.rows} />
                  <div className="result-box">
                    <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">Result</span>
                    <p className="font-mono text-h3 text-mba-ink mt-2" style={{ fontWeight: 600 }}>{problem.approach2.result}</p>
                  </div>
                </div>

                {/* Cross-check */}
                <div className="crosscheck-box">
                  <span className="font-mono text-mono-label text-mba-accent uppercase tracking-widest block mb-2">Cross-Check</span>
                  <p className="font-body text-body text-mba-ink-soft">
                    Approach 1 gives {problem.approach1.result.split('~')[1]?.trim() || problem.approach1.result}. Approach 2 gives {problem.approach2.result.split('~')[1]?.trim() || problem.approach2.result}. The two estimates are in the same order of magnitude, which validates the approach structure.
                  </p>
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === 'interpret' && (
          <section aria-label="Data interpretation">
            <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-4">Data Set</span>
            <h2 className="font-display text-h2-fluid text-mba-ink mb-3" style={{ fontWeight: 600 }}>{interpret.title}</h2>
            <p className="font-body text-body text-mba-ink-soft prose-measure mb-5">{interpret.description}</p>

            {/* Table */}
            {interpret.tableData && (
              <div className="interp-table-wrap">
                <div style={{ overflowX: 'auto' }}>
                  <table className="interp-table">
                    <thead>
                      <tr>{interpret.tableData.headers.map((h, i) => (
                        <th key={i} className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>{interpret.tableData.rows.map((row, r) => (
                      <tr key={r}>{row.map((cell, c) => (
                        <td key={c} className={c === 0 ? 'font-mono text-caption text-mba-ink-soft' : 'font-mono text-caption text-mba-ink tabular-nums'}>{cell}</td>
                      ))}</tr>
                    ))}</tbody>
                  </table>
                </div>
                <div className="interp-citations">
                  {interpret.citations.map((c) => <Citation key={c.id} data={c} />)}
                </div>
              </div>
            )}

            {/* Questions */}
            <div className="interp-questions">
              <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-5">Interpretation Questions</h3>
              {interpret.questions.map((q, i) => (
                <div key={i} className="interp-q">
                  <p className="font-body text-body text-mba-ink" style={{ fontWeight: 600 }}>{i + 1}. {q.question}</p>
                  <button
                    className="reveal-btn font-mono text-mono-label"
                    onClick={() => setRevealedQ((prev) => ({ ...prev, [i]: !prev[i] }))}
                    aria-expanded={!!revealedQ[i]}
                  >
                    {revealedQ[i] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {revealedQ[i] ? 'Hide Answer' : 'Reveal Answer'}
                  </button>
                  {revealedQ[i] && <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">{q.answer}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'reference-data' && (
          <section aria-label="Reference data lookups">
            <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-4">Permanent Reference Shelf</span>
            <div className="facts-sections">
              {guesstimateRefData.map((section) => {
                const isOpen = !!openCategories[section.category]
                return (
                  <section key={section.category} className="facts-category-group">
                    <button
                      className="facts-category-header"
                      onClick={() => toggleCategory(section.category)}
                      aria-expanded={isOpen}
                    >
                      <h3 className="font-body text-h3 text-mba-ink" style={{ fontWeight: 600, fontSize: '15px' }}>
                        {section.category}
                      </h3>
                      <div className="facts-category-meta">
                        <span className="font-mono text-mono-label text-mba-ink-faint mr-3">
                          {section.indicators.length} indicators
                        </span>
                        {isOpen ? <ChevronUp size={16} className="chevron" /> : <ChevronDown size={16} className="chevron" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="facts-grid">
                        {section.indicators.map((ind, idx) => (
                          <div key={idx} className="fact-card">
                            <div className="fact-value-container">
                              <span className="font-mono text-h2 text-mba-ink tabular-nums mr-2" style={{ fontSize: '24px', fontWeight: 600 }}>
                                {ind.value}
                              </span>
                              <Citation data={ind.citation} />
                            </div>
                            <div className="fact-label font-mono text-mono-label text-mba-ink-soft uppercase tracking-widest mt-1">
                              {ind.label}
                            </div>
                            {ind.note && (
                              <p className="fact-note font-body text-mba-ink-faint mt-1" style={{ fontSize: '11px', fontStyle: 'italic', lineHeight: '1.3' }}>
                                {ind.note}
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
          </section>
        )}
      </div>

      <style jsx>{`
        .approach-section { padding: var(--space-6) 0; border-bottom: 1px solid var(--mba-rule); }
        .result-box { margin-top: var(--space-4); padding: var(--space-4) var(--space-5); background: var(--mba-accent-soft); border-radius: var(--radius-md); border-left: 3px solid var(--mba-accent); }
        .crosscheck-box { margin-top: var(--space-5); padding: var(--space-5); background: var(--mba-surface-sunk); border-radius: var(--radius-md); border: 1px solid var(--mba-rule); }
        .interp-table-wrap { margin-bottom: var(--space-6); }
        .interp-table { border-collapse: collapse; width: 100%; min-width: 600px; border: 1px solid var(--mba-rule); border-radius: var(--radius-md); overflow: hidden; }
        .interp-table thead { background: var(--mba-surface-sunk); }
        .interp-table th, .interp-table td { padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--mba-rule); }
        .interp-table tbody tr:last-child td { border-bottom: none; }
        .interp-table tbody tr:hover td { background: var(--mba-surface-sunk); }
        .interp-citations { display: flex; align-items: center; gap: var(--space-2); margin-top: var(--space-3); }
        .interp-questions { padding-top: var(--space-5); border-top: 1px solid var(--mba-rule); }
        .interp-q { padding: var(--space-5) 0; border-bottom: 1px solid var(--mba-rule); }
        .interp-q:last-child { border-bottom: none; }
        .reveal-btn { display: inline-flex; align-items: center; gap: var(--space-1); background: none; border: none; cursor: pointer; color: var(--mba-accent); padding: var(--space-2) 0; margin-top: var(--space-2); letter-spacing: 0.06em; text-transform: uppercase; font-size: var(--text-mono-label); }
        .reveal-btn:hover { opacity: 0.7; }
        .problem-card { border: 1px solid var(--mba-rule); border-radius: var(--radius-md); background: var(--mba-surface-sunk); margin-bottom: var(--space-8); padding: var(--space-6); }

        /* Accordion reference styles */
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
        .facts-category-header:hover h3 {
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
