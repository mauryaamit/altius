'use client'
import React, { useState, useMemo } from 'react'
import { TabBar } from '@/components/TabBar'
import { AltitudeBlock } from '@/components/AltitudeBlock'
import { RecallCheck } from '@/components/RecallCheck'
import { ChevronDown, ChevronUp, Bookmark, Heart } from 'lucide-react'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { DateNav } from '@/components/DateNav'
import { toISODate } from '@/lib/getDayIndex'
import { getEnglishContentForDate } from '@/lib/content/getDynamicContent'

const TABS = [
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'grammar',    label: 'Grammar'    },
  { id: 'reading',    label: 'Reading'    },
  { id: 'write',      label: 'Write Better'},
]

export default function EnglishPage() {
  const [activeTab, setActiveTab] = useState('vocabulary')
  const [revealedPassage, setRevealedPassage] = useState<Record<number, boolean>>({})
  const [revealedWAT, setRevealedWAT] = useState(false)
  const [revealedDrill, setRevealedDrill] = useState<Record<number, boolean>>({})

  const { activeDate, toggleFavorite, isFavorite } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()
  const dateStr = toISODate(currentDate)

  const [mounted, setMounted] = useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Retrieve today's English content from content engine
  const content = useMemo(() => {
    return getEnglishContentForDate(currentDate)
  }, [currentDate])

  const toggleDrill = (idx: number) => {
    setRevealedDrill((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  if (!mounted) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8">
        Loading English room...
      </div>
    )
  }

  return (
    <div>
      <header className="eng-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-3">
          Skill Room
        </span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>
          English
        </h1>
      </header>

      <DateNav />
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div style={{ paddingTop: 'var(--space-6)' }}>
        {/* Vocabulary */}
        {activeTab === 'vocabulary' && (
          <section aria-label="Vocabulary" className="stack-container">
            <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-4">
              Vocabulary Words for Today
            </span>

            {content.vocabulary.map((vocab, vIdx) => {
              const ledgerId = `english_vocabularyWord_vocab-${vIdx}_${dateStr}`
              const isHeart = isFavorite(ledgerId, 'heart')
              const isBookmark = isFavorite(ledgerId, 'bookmark')

              return (
                <div key={vocab.word} className="vocab-card-wrapper mb-8">
                  <div className="vocab-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest">
                        Word {vIdx + 1} of 3
                      </span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <button
                          onClick={() => toggleFavorite(ledgerId, 'english', 'vocabularyWord', 'heart')}
                          className="fav-toggle-btn"
                          aria-label={isHeart ? 'Remove from favorites' : 'Add to favorites'}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isHeart ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                        >
                          <Heart size={15} fill={isHeart ? 'var(--mba-accent)' : 'none'} />
                        </button>
                        <button
                          onClick={() => toggleFavorite(ledgerId, 'english', 'vocabularyWord', 'bookmark')}
                          className="fav-toggle-btn"
                          aria-label={isBookmark ? 'Remove from bookmarks' : 'Add to bookmarks'}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmark ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                        >
                          <Bookmark size={15} fill={isBookmark ? 'var(--mba-accent)' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <h2 className="font-display vocab-word">{vocab.word}</h2>
                    <p className="font-mono text-caption text-mba-ink-soft mb-4">{vocab.roots}</p>
                    <p className="font-body text-body text-mba-ink prose-measure mb-4">{vocab.definition}</p>
                    
                    <div className="vocab-example">
                      <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">
                        Usage Examples
                      </span>
                      {vocab.examples && vocab.examples.length > 0 ? (
                        <ul style={{ paddingLeft: 'var(--space-4)', margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                          {vocab.examples.map((ex, idx) => (
                            <li key={idx} className="font-body text-body text-mba-ink-soft prose-measure italic">
                              "{ex}"
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="font-body text-body text-mba-ink-soft prose-measure italic">"{vocab.exampleSentence}"</p>
                      )}
                    </div>

                    {vocab.misuseNote && (
                      <div className="vocab-misuse-box mt-4" style={{ padding: 'var(--space-4)', background: 'var(--mba-surface-sunk)', borderLeft: '3px solid var(--mba-accent)', borderRadius: 'var(--radius-sm)' }}>
                        <span className="font-mono text-mono-label text-mba-ink-soft uppercase tracking-widest block mb-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                          Common Misuse & Confusion
                        </span>
                        <p className="font-body text-caption text-mba-ink-soft prose-measure" style={{ margin: 0 }}>
                          {vocab.misuseNote}
                        </p>
                      </div>
                    )}

                    <p className="font-mono text-mono-label text-mba-ink-faint mt-4">{vocab.usedIn}</p>
                  </div>
                  <RecallCheck conceptId={`vocab-${vocab.word}`} label="How well do you know this word?" />
                </div>
              )
            })}
          </section>
        )}

        {/* Grammar */}
        {activeTab === 'grammar' && (
          <section aria-label="Grammar" className="stack-container">
            <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-4">
              Curriculum Drills for Today (Wren & Martin)
            </span>

            {content.grammar.map((grammar, gIdx) => {
              const ledgerId = `english_grammarRule_grammar-${gIdx}_${dateStr}`
              const isHeart = isFavorite(ledgerId, 'heart')
              const isBookmark = isFavorite(ledgerId, 'bookmark')

              return (
                <div key={grammar.rule} className="grammar-card-wrapper mb-8">
                  <div className="grammar-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-3">
                        Rule {gIdx + 1} of 2
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <button
                          onClick={() => toggleFavorite(ledgerId, 'english', 'grammarRule', 'heart')}
                          className="fav-toggle-btn"
                          aria-label={isHeart ? 'Remove from favorites' : 'Add to favorites'}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isHeart ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                        >
                          <Heart size={15} fill={isHeart ? 'var(--mba-accent)' : 'none'} />
                        </button>
                        <button
                          onClick={() => toggleFavorite(ledgerId, 'english', 'grammarRule', 'bookmark')}
                          className="fav-toggle-btn"
                          aria-label={isBookmark ? 'Remove from bookmarks' : 'Add to bookmarks'}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmark ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                        >
                          <Bookmark size={15} fill={isBookmark ? 'var(--mba-accent)' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <h2 className="font-display grammar-rule">{grammar.rule}</h2>
                    <div className="grammar-examples">
                      {grammar.examples.map((ex, i) => (
                        <p key={i} className={`font-body text-body prose-measure mb-3 ${ex.startsWith('WRONG') ? 'grammar-wrong' : ex.startsWith('RIGHT') ? 'grammar-right' : 'text-mba-ink-soft'}`}>
                          {ex}
                        </p>
                      ))}
                    </div>
                    
                    <div className="grammar-error">
                      <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">
                        Common Error
                      </span>
                      <p className="font-body text-body text-mba-ink-soft prose-measure">{grammar.commonError}</p>
                    </div>

                    {grammar.drill && (
                      <div className="grammar-drill-box mt-5" style={{ padding: 'var(--space-5)', background: 'var(--mba-accent-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--mba-rule)' }}>
                        <span className="font-mono text-mono-label text-mba-accent uppercase tracking-widest block mb-2">
                          Error-Spotting Drill
                        </span>
                        <p className="font-body text-body text-mba-ink mb-3" style={{ fontWeight: 500 }}>
                          Spot the error: "{grammar.drill.sentence}"
                        </p>
                        <button
                          className="reveal-btn font-mono text-mono-label"
                          onClick={() => toggleDrill(gIdx)}
                          aria-expanded={!!revealedDrill[gIdx]}
                          style={{ margin: 0, padding: 0 }}
                        >
                          {revealedDrill[gIdx] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          {revealedDrill[gIdx] ? 'Hide Explanation' : 'Reveal Explanation'}
                        </button>
                        {revealedDrill[gIdx] && (
                          <p className="font-body text-body text-mba-ink-soft prose-measure mt-3" style={{ borderTop: '1px solid var(--mba-rule)', paddingTop: 'var(--space-3)', margin: 0 }}>
                            {grammar.drill.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <RecallCheck conceptId={`grammar-${grammar.rule}`} label="Internalized this rule?" />
                </div>
              )
            })}
          </section>
        )}

        {/* Reading */}
        {activeTab === 'reading' && (
          <section aria-label="Reading">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block">
                Reading Passage
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <button
                  onClick={() => toggleFavorite(`english_readingPassage__${dateStr}`, 'english', 'readingPassage', 'heart')}
                  className="fav-toggle-btn"
                  aria-label={isFavorite(`english_readingPassage__${dateStr}`, 'heart') ? 'Remove from favorites' : 'Add to favorites'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFavorite(`english_readingPassage__${dateStr}`, 'heart') ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                >
                  <Heart size={15} fill={isFavorite(`english_readingPassage__${dateStr}`, 'heart') ? 'var(--mba-accent)' : 'none'} />
                </button>
                <button
                  onClick={() => toggleFavorite(`english_readingPassage__${dateStr}`, 'english', 'readingPassage', 'bookmark')}
                  className="fav-toggle-btn"
                  aria-label={isFavorite(`english_readingPassage__${dateStr}`, 'bookmark') ? 'Remove from bookmarks' : 'Add to bookmarks'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFavorite(`english_readingPassage__${dateStr}`, 'bookmark') ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                >
                  <Bookmark size={15} fill={isFavorite(`english_readingPassage__${dateStr}`, 'bookmark') ? 'var(--mba-accent)' : 'none'} />
                </button>
              </div>
            </div>

            <h2 className="font-display text-h2-fluid text-mba-ink mb-5" style={{ fontWeight: 600 }}>
              {content.reading.title}
            </h2>
            <div className="reading-passage">
              <p className="font-body text-body text-mba-ink leading-reading">{content.reading.passage}</p>
            </div>
            <div className="reading-questions">
              <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-5">
                Inference Questions
              </h3>
              {content.reading.questions.map((q, i) => (
                <div key={i} className="reading-q">
                  <p className="font-body text-body text-mba-ink" style={{ fontWeight: 600 }}>{i + 1}. {q.question}</p>
                  <button
                    className="reveal-btn font-mono text-mono-label"
                    onClick={() => setRevealedPassage((prev) => ({ ...prev, [i]: !prev[i] }))}
                    aria-expanded={!!revealedPassage[i]}
                  >
                    {revealedPassage[i] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {revealedPassage[i] ? 'Hide Answer' : 'Reveal Answer'}
                  </button>
                  {revealedPassage[i] && (
                    <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">{q.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Write Better */}
        {activeTab === 'write' && (
          <section aria-label="Write Better">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block">
                WAT Prompt
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <button
                  onClick={() => toggleFavorite(`english_watPrompt__${dateStr}`, 'english', 'watPrompt', 'heart')}
                  className="fav-toggle-btn"
                  aria-label={isFavorite(`english_watPrompt__${dateStr}`, 'heart') ? 'Remove from favorites' : 'Add to favorites'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFavorite(`english_watPrompt__${dateStr}`, 'heart') ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                >
                  <Heart size={15} fill={isFavorite(`english_watPrompt__${dateStr}`, 'heart') ? 'var(--mba-accent)' : 'none'} />
                </button>
                <button
                  onClick={() => toggleFavorite(`english_watPrompt__${dateStr}`, 'english', 'watPrompt', 'bookmark')}
                  className="fav-toggle-btn"
                  aria-label={isFavorite(`english_watPrompt__${dateStr}`, 'bookmark') ? 'Remove from bookmarks' : 'Add to bookmarks'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFavorite(`english_watPrompt__${dateStr}`, 'bookmark') ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                >
                  <Bookmark size={15} fill={isFavorite(`english_watPrompt__${dateStr}`, 'bookmark') ? 'var(--mba-accent)' : 'none'} />
                </button>
              </div>
            </div>

            <h2 className="font-display text-h2-fluid text-mba-ink mb-5" style={{ fontWeight: 600 }}>
              &ldquo;{content.writeBetter.wat.prompt}&rdquo;
            </h2>

            <div className="spelt-grid">
              <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest col-span-2 block mb-3">
                SPELT Framework Reminder
              </span>
              {(Object.entries(content.writeBetter.wat.speltReminder) as [string, string][]).map(([key, val]) => (
                <div key={key} className="spelt-row">
                  <span className="font-mono text-h3 text-mba-accent spelt-key" style={{ fontWeight: 600 }}>{key}</span>
                  <p className="font-body text-caption text-mba-ink-soft">{val}</p>
                </div>
              ))}
            </div>

            <div className="model-essay-section mb-8">
              <button
                className="reveal-btn font-mono text-mono-label"
                onClick={() => setRevealedWAT((v) => !v)}
                aria-expanded={revealedWAT}
              >
                {revealedWAT ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {revealedWAT ? 'Hide Model Essay' : 'Reveal Model Essay'}
              </button>
              {revealedWAT && (
                <div className="model-essay">
                  <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-4">
                    Model Essay (Read Only)
                  </span>
                  <div className="font-body text-body text-mba-ink prose-measure" style={{ whiteSpace: 'pre-wrap' }}>
                    {content.writeBetter.wat.modelEssay}
                  </div>
                </div>
              )}
            </div>

            {/* Business Phrases daily shelf */}
            <div className="phrases-shelf mb-8">
              <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-4">
                Business Phraseology Focus
              </span>
              <div className="phrases-grid" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {content.writeBetter.phrases.map((phraseObj) => (
                  <div key={phraseObj.phrase} className="phrase-card p-4 bg-mba-surface border border-mba-rule rounded-md">
                    <span className="font-mono text-body text-mba-accent font-bold block mb-1">{phraseObj.phrase}</span>
                    <p className="font-body text-caption text-mba-ink-soft mb-2">Context: {phraseObj.context}</p>
                    <p className="font-body text-caption text-mba-ink italic">Example: "{phraseObj.example}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistake Spotlight */}
            <div className="mistake-spotlight p-5 bg-mba-surface-sunk border border-mba-rule rounded-md">
              <span className="font-mono text-mono-label text-mba-accent uppercase tracking-widest block mb-3">
                Common Mistake Spotlight
              </span>
              <h4 className="font-display text-h3 text-mba-ink font-bold mb-3">{content.writeBetter.mistake.topic}</h4>
              <div className="mb-3">
                <span className="font-mono text-mono-label text-mba-danger block">INCORRECT</span>
                <p className="font-body text-caption text-mba-ink-soft mt-1">"{content.writeBetter.mistake.wrong}"</p>
              </div>
              <div className="mb-3">
                <span className="font-mono text-mono-label text-mba-success block">CORRECT</span>
                <p className="font-body text-caption text-mba-ink mt-1 font-bold">"{content.writeBetter.mistake.right}"</p>
              </div>
              <div>
                <span className="font-mono text-mono-label text-mba-ink-faint block">EXPLANATION</span>
                <p className="font-body text-caption text-mba-ink-soft mt-1">{content.writeBetter.mistake.explanation}</p>
              </div>
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .eng-header { border-left: 3px solid var(--mba-accent); padding-left: var(--space-4); padding-bottom: var(--space-6); border-bottom: 1px solid var(--mba-rule); margin-bottom: 0; }
        .vocab-card { padding: var(--space-6); background: var(--mba-surface-sunk); border-radius: var(--radius-lg); border: 1px solid var(--mba-rule); }
        .vocab-word { font-size: clamp(2rem, 1.5rem + 2vw, 3rem); color: var(--mba-ink); margin: var(--space-3) 0 var(--space-2); font-weight: 600; }
        .vocab-example { padding: var(--space-4); background: var(--mba-surface); border-radius: var(--radius-md); border-left: 3px solid var(--mba-rule); }
        .grammar-card { padding: var(--space-6); background: var(--mba-surface-sunk); border-radius: var(--radius-lg); border: 1px solid var(--mba-rule); }
        .grammar-rule { font-size: var(--text-h2); color: var(--mba-ink); margin: var(--space-3) 0 var(--space-5); font-weight: 600; }
        .grammar-examples { margin-bottom: var(--space-5); }
        .grammar-wrong { color: var(--mba-danger); font-family: 'JetBrains Mono', monospace; font-size: var(--text-caption); }
        .grammar-right { color: var(--mba-success); font-family: 'JetBrains Mono', monospace; font-size: var(--text-caption); }
        .grammar-error { padding: var(--space-4); background: var(--mba-surface); border-radius: var(--radius-md); }
        .reading-passage { padding: var(--space-5); background: var(--mba-surface-sunk); border-radius: var(--radius-md); margin-bottom: var(--space-6); border: 1px solid var(--mba-rule); line-height: 1.8; }
        .reading-questions { padding-top: var(--space-5); border-top: 1px solid var(--mba-rule); }
        .reading-q { padding: var(--space-5) 0; border-bottom: 1px solid var(--mba-rule); }
        .reading-q:last-child { border-bottom: none; }
        .reveal-btn { display: inline-flex; align-items: center; gap: var(--space-1); background: none; border: none; cursor: pointer; color: var(--mba-accent); padding: var(--space-2) 0; margin-top: var(--space-2); letter-spacing: 0.06em; text-transform: uppercase; font-size: var(--text-mono-label); transition: opacity 0.15s ease; }
        .reveal-btn:hover { opacity: 0.7; }
        .spelt-grid { display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-5); background: var(--mba-surface-sunk); border-radius: var(--radius-md); border: 1px solid var(--mba-rule); margin-bottom: var(--space-6); }
        .spelt-row { display: flex; gap: var(--space-4); align-items: flex-start; }
        .spelt-key { flex-shrink: 0; width: 20px; }
        .model-essay-section { margin-top: var(--space-4); }
        .model-essay { margin-top: var(--space-4); padding: var(--space-5); background: var(--mba-surface-sunk); border-radius: var(--radius-md); border: 1px solid var(--mba-rule); }
        .leading-reading { line-height: 1.8; }
        .fav-toggle-btn {
          transition: transform 0.2s ease;
        }
        .fav-toggle-btn:hover {
          transform: scale(1.1);
        }
        .phrase-card {
          border-left: 3px solid var(--mba-accent);
        }
        .mistake-spotlight {
          border-left: 3px solid var(--mba-accent);
        }
      `}</style>
    </div>
  )
}
