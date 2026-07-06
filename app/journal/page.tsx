'use client'
import React, { useState, useEffect } from 'react'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { toISODate, getDayIndex, formatDisplayDate } from '@/lib/getDayIndex'
import { DateNav } from '@/components/DateNav'
import { 
  PenTool, 
  CheckCircle, 
  Info, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Lock,
  CalendarDays
} from 'lucide-react'

const JOURNAL_PROMPTS = [
  "How can you apply today's core specialization concepts to a challenge in your current organization?",
  "What strategic trade-offs did you observe in today's case study, and how would you have negotiated them?",
  "Reflect on today's Hot Topic. How does this regulatory or market shift impact your industry?",
  "If you were the CEO in today's Company Spotlight, what would be your top priority for the next 12 months?",
  "What is the most counter-intuitive insight you encountered today, and why did it surprise you?",
  "How does today's learning connect to your long-term career goals as a business leader?",
  "Reflect on a decision in your career that failed or succeeded due to one of the concepts you reviewed today."
]

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function JournalPage() {
  const { activeDate, journal, saveJournalEntry, setActiveDate } = useMbaStore()
  
  const today = new Date()
  const currentDate = activeDate ? new Date(activeDate) : today
  const dateStr = toISODate(currentDate)

  // Subsections toggle: 'journal' | 'diary'
  const [section, setSection] = useState<'journal' | 'diary'>('journal')

  // Calendar display state
  const [calYear, setCalYear] = useState(currentDate.getFullYear())
  const [calMonth, setCalMonth] = useState(currentDate.getMonth())
  const [showCalendar, setShowCalendar] = useState(false)

  // Editor states
  const [journalText, setJournalText] = useState('')
  const [diaryText, setDiaryText] = useState('')
  
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  // Sync editors when activeDate or journal collection changes
  useEffect(() => {
    const entry = journal[dateStr]
    // fallback to legacy text field if journalText doesn't exist yet
    setJournalText(entry?.journalText || entry?.text || '')
    setDiaryText(entry?.diaryText || '')
    setStatus('idle')
    
    // Sync calendar picker month/year with active date
    setCalYear(currentDate.getFullYear())
    setCalMonth(currentDate.getMonth())
  }, [dateStr, journal])

  // Get deterministic prompt
  const promptIndex = getDayIndex(JOURNAL_PROMPTS.length, currentDate)
  const currentPrompt = JOURNAL_PROMPTS[promptIndex]

  const calculateWords = (str: string) => {
    const trimmed = str.trim()
    return trimmed ? trimmed.split(/\s+/).length : 0
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    if (section === 'journal') {
      setJournalText(val)
    } else {
      setDiaryText(val)
    }
    
    setStatus('saving')
    if (saveTimeout) clearTimeout(saveTimeout)

    const timeout = setTimeout(async () => {
      try {
        if (section === 'journal') {
          await saveJournalEntry(dateStr, 'journal', val, currentPrompt)
        } else {
          await saveJournalEntry(dateStr, 'diary', val)
        }
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2000)
      } catch (err) {
        console.error(err)
        setStatus('error')
      }
    }, 1200)

    setSaveTimeout(timeout)
  }

  // Calendar computation helper
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay() // 0 = Sunday, 1 = Monday...

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11)
      setCalYear((y) => y - 1)
    } else {
      setCalMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0)
      setCalYear((y) => y + 1)
    } else {
      setCalMonth((m) => m + 1)
    }
  }

  const handleSelectDay = (day: number) => {
    const selected = new Date(calYear, calMonth, day)
    // Prevent selecting future date
    if (selected.getTime() > today.getTime() && toISODate(selected) !== toISODate(today)) return
    setActiveDate(selected)
    setShowCalendar(false)
  }

  const isFutureDate = (day: number) => {
    const d = new Date(calYear, calMonth, day)
    return d.getTime() > today.getTime() && toISODate(d) !== toISODate(today)
  }

  const isFutureActiveDate = currentDate.getTime() > today.getTime() && dateStr !== toISODate(today)

  return (
    <div className="journal-container font-body">
      <header className="journal-header mb-6">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">
          YOU / Reflect
        </span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>
          Personal Desk
        </h1>
        <p className="text-body text-mba-ink-soft mt-2 prose-measure">
          Write daily guided reflections or capture personal diary logs in a secure, local-first environment.
        </p>
      </header>

      {/* Date Navigation & Calendar Toggle */}
      <div className="date-strip-row mb-6">
        <div className="flex-grow">
          <DateNav />
        </div>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className={`calendar-toggle-btn font-mono text-mono-label ${showCalendar ? 'active' : ''}`}
        >
          <CalendarDays size={16} />
          <span>Calendar</span>
        </button>
      </div>

      {/* INTERACTIVE CALENDAR DROPDOWN */}
      {showCalendar && (
        <div className="calendar-dropdown mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="calendar-controls font-mono">
            <button onClick={handlePrevMonth} className="nav-btn"><ChevronLeft size={16} /></button>
            <span className="month-year-label">{MONTH_NAMES[calMonth]} {calYear}</span>
            <button onClick={handleNextMonth} className="nav-btn"><ChevronRight size={16} /></button>
          </div>

          <div className="calendar-grid">
            {/* Week Headers */}
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((h, i) => (
              <div key={i} className="grid-header font-mono">{h}</div>
            ))}

            {/* Padding Days */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`pad-${idx}`} className="grid-cell empty"></div>
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1
              const cellDateStr = `${calYear}-${(calMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`
              const cellEntry = journal[cellDateStr]
              
              const hasJournal = !!(cellEntry?.journalText || cellEntry?.text)
              const hasDiary = !!cellEntry?.diaryText
              const isSelected = dateStr === cellDateStr
              const isCellFuture = isFutureDate(dayNum)

              return (
                <button
                  key={`day-${dayNum}`}
                  disabled={isCellFuture}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`grid-cell day-cell font-mono ${isSelected ? 'selected' : ''} ${isCellFuture ? 'future' : ''}`}
                >
                  <span className="day-number">{dayNum}</span>
                  <div className="cell-dots">
                    {hasJournal && <span className="dot dot-journal"></span>}
                    {hasDiary && <span className="dot dot-diary"></span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Segment tabs */}
      <div className="section-tabs mb-6">
        <button
          onClick={() => { setSection('journal'); setStatus('idle'); }}
          className={`section-tab font-mono text-mono-label ${section === 'journal' ? 'active' : ''}`}
        >
          <BookOpen size={14} />
          <span>Guided Journal</span>
        </button>
        <button
          onClick={() => { setSection('diary'); setStatus('idle'); }}
          className={`section-tab font-mono text-mono-label ${section === 'diary' ? 'active' : ''}`}
        >
          <Lock size={14} />
          <span>Personal Diary</span>
        </button>
      </div>

      {/* Retention Banner */}
      <div className="retention-banner text-caption mb-6">
        <Info size={16} className="text-mba-accent flex-shrink-0" />
        <span>
          To maintain active recall, entries are kept for 180 days. Older entries are pruned automatically.
        </span>
      </div>

      {isFutureActiveDate ? (
        <div className="empty-state text-center py-12">
          <Calendar size={40} className="text-mba-ink-faint mx-auto mb-4" />
          <h3 className="font-display text-h3 text-mba-ink mb-1">Cannot reflect on the future</h3>
          <p className="text-caption text-mba-ink-soft">
            Reflections can only be written for today or past calendar dates. Use the calendar picker to browse.
          </p>
        </div>
      ) : (
        <div className="journal-workspace">
          {/* Prompt card (only for Journal section) */}
          {section === 'journal' && (
            <div className="prompt-card mb-5">
              <span className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-2">
                Daily Business Reflection Prompt
              </span>
              <p className="prompt-text font-display text-body text-mba-ink font-medium">
                "{currentPrompt}"
              </p>
            </div>
          )}

          {/* Text editor */}
          <div className="editor-card">
            <div className="editor-top-row font-mono text-[11px] text-mba-ink-soft mb-3">
              <span className="flex items-center gap-1">
                <PenTool size={11} /> 
                {section === 'journal' ? 'Write Guided Reflection' : 'Write Personal Diary Log'}
              </span>
              <div className="editor-status">
                {status === 'saving' && <span className="animate-pulse">Saving...</span>}
                {status === 'saved' && <span className="text-mba-success flex items-center gap-1"><CheckCircle size={10} /> Saved</span>}
                {status === 'error' && <span className="text-mba-danger">Failed to save</span>}
                {status === 'idle' && <span>Auto-saves on change</span>}
              </div>
            </div>

            <textarea
              value={section === 'journal' ? journalText : diaryText}
              onChange={handleTextChange}
              placeholder={
                section === 'journal' 
                  ? "Start writing your thoughts, strategic summaries, or career actions..."
                  : "Write about your day, personal progress, feelings, or notes. This is secure and private..."
              }
              className="journal-textarea text-body"
              rows={12}
            />

            <div className="editor-footer mt-4 font-mono text-mono-label text-mba-ink-faint">
              <span>
                {section === 'journal' ? calculateWords(journalText) : calculateWords(diaryText)} words
              </span>
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
        }
        .date-strip-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .calendar-toggle-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          color: var(--mba-ink-soft);
          cursor: pointer;
          transition: all 150ms ease;
        }
        .calendar-toggle-btn:hover, .calendar-toggle-btn.active {
          border-color: var(--mba-accent);
          background: var(--mba-accent-soft);
          color: var(--mba-accent);
        }
        .calendar-dropdown {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          box-shadow: var(--shadow-md);
        }
        .calendar-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
        }
        .nav-btn {
          background: none;
          border: none;
          color: var(--mba-ink-soft);
          cursor: pointer;
          padding: var(--space-1);
        }
        .month-year-label {
          font-weight: bold;
          color: var(--mba-ink);
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
          text-align: center;
        }
        .grid-header {
          font-size: 10px;
          font-weight: bold;
          color: var(--mba-ink-faint);
          padding: var(--space-1) 0;
        }
        .grid-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: none;
          background: none;
          position: relative;
        }
        .day-cell {
          cursor: pointer;
          border-radius: var(--radius-sm);
          color: var(--mba-ink-soft);
          transition: all 150ms ease;
        }
        .day-cell:hover:not(:disabled) {
          background: var(--mba-surface-sunk);
        }
        .day-cell.selected {
          background: var(--mba-accent);
          color: #ffffff;
          font-weight: bold;
        }
        .day-cell.future {
          color: var(--mba-ink-faint);
          cursor: not-allowed;
          opacity: 0.4;
        }
        .day-number {
          font-size: 12px;
        }
        .cell-dots {
          display: flex;
          gap: 2px;
          position: absolute;
          bottom: 4px;
        }
        .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
        }
        .dot-journal {
          background: var(--mba-success);
        }
        .dot-diary {
          background: var(--mba-accent);
        }
        .section-tabs {
          display: flex;
          border-bottom: 2px solid var(--mba-rule);
        }
        .section-tab {
          flex: 1;
          background: none;
          border: none;
          padding: var(--space-3) 0;
          color: var(--mba-ink-faint);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          position: relative;
          transition: color 150ms ease;
        }
        .section-tab:hover {
          color: var(--mba-ink-soft);
        }
        .section-tab.active {
          color: var(--mba-accent);
          font-weight: 600;
        }
        .section-tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--mba-accent);
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
