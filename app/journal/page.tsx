'use client'
import React, { useState, useEffect } from 'react'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { toISODate, getDayIndex } from '@/lib/getDayIndex'
import { DateNav } from '@/components/DateNav'
import { PenTool, CheckCircle, Info, Calendar, BookOpen } from 'lucide-react'

const JOURNAL_PROMPTS = [
  "How can you apply today's core specialization concepts to a challenge in your current organization?",
  "What strategic trade-offs did you observe in today's case study, and how would you have negotiated them?",
  "Reflect on today's Hot Topic. How does this regulatory or market shift impact your industry?",
  "If you were the CEO in today's Company Spotlight, what would be your top priority for the next 12 months?",
  "What is the most counter-intuitive insight you encountered today, and why did it surprise you?",
  "How does today's learning connect to your long-term career goals as a business leader?",
  "Reflect on a decision in your career that failed or succeeded due to one of the concepts you reviewed today."
]

export default function JournalPage() {
  const { activeDate, journal, saveJournal } = useMbaStore()
  
  const today = new Date()
  const currentDate = activeDate ? new Date(activeDate) : today
  const dateStr = toISODate(currentDate)

  // Get deterministic prompt based on date index
  const promptIndex = getDayIndex(JOURNAL_PROMPTS.length, currentDate)
  const currentPrompt = JOURNAL_PROMPTS[promptIndex]

  // Retrieve existing entry for current date
  const existingEntry = journal[dateStr]
  
  const [text, setText] = useState(existingEntry?.text || '')
  const [wordCount, setWordCount] = useState(existingEntry?.wordCount || 0)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  // Sync state with selected date
  useEffect(() => {
    const entry = journal[dateStr]
    setText(entry?.text || '')
    setWordCount(entry?.wordCount || 0)
    setStatus('idle')
  }, [dateStr, journal])

  const calculateWords = (str: string) => {
    const trimmed = str.trim()
    return trimmed ? trimmed.split(/\s+/).length : 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setText(val)
    setWordCount(calculateWords(val))
    setStatus('saving')

    if (saveTimeout) clearTimeout(saveTimeout)

    const timeout = setTimeout(async () => {
      try {
        await saveJournal(dateStr, val, currentPrompt)
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2000)
      } catch (err) {
        console.error(err)
        setStatus('error')
      }
    }, 1500)

    setSaveTimeout(timeout)
  }

  const isFuture = currentDate.getTime() > today.getTime() && dateStr !== toISODate(today)

  return (
    <div className="journal-container font-body">
      <header className="journal-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">
          YOU / Reflect
        </span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>
          Daily Journal
        </h1>
        <p className="text-body text-mba-ink-soft mt-2 prose-measure">
          Build structural recall and synthesize what you learn by writing down daily business reflections.
        </p>
      </header>

      {/* Date Navigation Strip */}
      <DateNav />

      {/* Retention Banner */}
      <div className="retention-banner text-caption mb-6">
        <Info size={16} className="text-mba-accent flex-shrink-0" />
        <span>
          Journal entries are kept for 180 days for active learning reflection. Older entries are automatically pruned.
        </span>
      </div>

      {isFuture ? (
        <div className="empty-state text-center py-12">
          <Calendar size={40} className="text-mba-ink-faint mx-auto mb-4" />
          <h3 className="font-display text-h3 text-mba-ink mb-1">Cannot reflect on the future</h3>
          <p className="text-caption text-mba-ink-soft">
            Reflections can only be written for today or past calendar dates.
          </p>
        </div>
      ) : (
        <div className="journal-workspace">
          {/* Prompt card */}
          <div className="prompt-card mb-5">
            <span className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-2">
              Daily Prompt
            </span>
            <p className="prompt-text font-display text-body text-mba-ink font-medium">
              "{currentPrompt}"
            </p>
          </div>

          {/* Text editor */}
          <div className="editor-card">
            <div className="editor-top-row font-mono text-[11px] text-mba-ink-soft mb-3">
              <span className="flex items-center gap-1">
                <PenTool size={11} /> Write Reflection
              </span>
              <div className="editor-status">
                {status === 'saving' && <span className="animate-pulse">Saving...</span>}
                {status === 'saved' && <span className="text-mba-success flex items-center gap-1"><CheckCircle size={10} /> Saved</span>}
                {status === 'error' && <span className="text-mba-danger">Failed to save</span>}
                {status === 'idle' && <span>Auto-saves on change</span>}
              </div>
            </div>

            <textarea
              value={text}
              onChange={handleChange}
              placeholder="Start writing your thoughts, strategic summaries, or career actions..."
              className="journal-textarea text-body"
              rows={12}
            />

            <div className="editor-footer mt-4 font-mono text-mono-label text-mba-ink-faint">
              <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .journal-header {
          border-left: 3px solid var(--mba-accent);
          padding-left: var(--space-4);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }
        .retention-banner {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: var(--mba-accent-soft);
          border-left: 3px solid var(--mba-accent);
          padding: var(--space-4);
          border-radius: var(--radius-sm);
          color: var(--mba-ink-soft);
        }
        .prompt-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-4) var(--space-5);
          box-shadow: var(--shadow-sm);
        }
        .prompt-text {
          line-height: 1.35;
        }
        .editor-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          box-shadow: var(--shadow-sm);
        }
        .editor-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .journal-textarea {
          width: 100%;
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
          background: var(--mba-surface-sunk);
          color: var(--mba-ink);
          resize: vertical;
          font-family: inherit;
          transition: border-color 150ms ease, background 150ms ease;
        }
        .journal-textarea:focus {
          outline: none;
          border-color: var(--mba-accent);
          background: var(--mba-surface);
        }
        .editor-footer {
          display: flex;
          justify-content: flex-end;
        }
        .empty-state {
          background: var(--mba-surface);
          border: 1px dashed var(--mba-rule);
          border-radius: var(--radius-lg);
          padding: var(--space-8) var(--space-4);
        }
      `}</style>
    </div>
  )
}
