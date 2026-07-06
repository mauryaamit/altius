'use client'
import React, { useState, useEffect, useRef } from 'react'
import { PenTool, Check, RefreshCw, AlertCircle, Trash2 } from 'lucide-react'
import { useMbaStore } from '@/lib/stores/mbaStore'

interface NoteEditorProps {
  contentRef: string
  contentTitle: string
  contentType: string
  page: string
}

export function NoteEditor({ contentRef, contentTitle, contentType, page }: NoteEditorProps) {
  const { notes, saveNote, deleteNote } = useMbaStore()
  const existingNote = notes[contentRef]

  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState(existingNote?.noteText || '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Keep local state in sync if note in store changes (e.g. on sync)
  useEffect(() => {
    if (existingNote && existingNote.noteText !== text && status === 'idle') {
      setText(existingNote.noteText)
    }
  }, [existingNote])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    setStatus('saving')

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      if (newText.trim() === '') {
        try {
          await deleteNote(contentRef)
          setStatus('idle')
        } catch (err) {
          console.error(err)
          setStatus('error')
        }
      } else {
        try {
          await saveNote(contentRef, contentTitle, contentType, page, newText)
          setStatus('saved')
          setTimeout(() => setStatus('idle'), 2000)
        } catch (err) {
          console.error(err)
          setStatus('error')
        }
      }
    }, 1500)
  }

  const handleDelete = async () => {
    if (confirm('Delete this note?')) {
      try {
        await deleteNote(contentRef)
        setText('')
        setStatus('idle')
        setIsOpen(false)
      } catch (err) {
        console.error(err)
        setStatus('error')
      }
    }
  }

  return (
    <div className="note-editor-wrapper font-body">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`note-toggle-btn font-mono text-mono-label ${isOpen || text ? 'active' : ''}`}
        aria-label="Toggle notes panel"
      >
        <PenTool size={13} />
        <span>{text ? 'Edit Note' : 'Add Note'}</span>
      </button>

      {isOpen && (
        <div className="note-card mt-3 animate-slide-down">
          <div className="card-header mb-2">
            <span className="font-mono text-mono-label text-mba-ink-soft">
              Personal Notebook
            </span>
            <div className="status-indicator">
              {status === 'saving' && (
                <span className="text-mba-ink-faint flex items-center gap-1 font-mono text-[10px]">
                  <RefreshCw size={10} className="animate-spin" /> Saving...
                </span>
              )}
              {status === 'saved' && (
                <span className="text-mba-success flex items-center gap-1 font-mono text-[10px]">
                  <Check size={10} /> Saved
                </span>
              )}
              {status === 'error' && (
                <span className="text-mba-danger flex items-center gap-1 font-mono text-[10px]">
                  <AlertCircle size={10} /> Shaky
                </span>
              )}
            </div>
          </div>

          <textarea
            value={text}
            onChange={handleChange}
            placeholder="Write key takeaways, thoughts or follow-up items..."
            className="note-textarea text-caption"
            rows={4}
          />

          {text && (
            <div className="card-footer mt-2">
              <button onClick={handleDelete} className="delete-btn font-mono text-mono-label">
                <Trash2 size={12} className="mr-1" /> Delete Note
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .note-editor-wrapper {
          margin-top: var(--space-4);
          margin-bottom: var(--space-4);
        }
        .note-toggle-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: transparent;
          border: 1px dashed var(--mba-rule);
          color: var(--mba-ink-soft);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 150ms ease;
        }
        .note-toggle-btn:hover {
          color: var(--mba-accent);
          border-color: var(--mba-accent);
          background: var(--mba-accent-soft);
        }
        .note-toggle-btn.active {
          color: var(--mba-accent);
          border-color: var(--mba-accent);
          border-style: solid;
        }
        .note-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          box-shadow: var(--shadow-sm);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .note-textarea {
          width: 100%;
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-3);
          background: var(--mba-surface-sunk);
          color: var(--mba-ink);
          resize: vertical;
          font-family: inherit;
          transition: border-color 150ms ease, background 150ms ease;
        }
        .note-textarea:focus {
          outline: none;
          border-color: var(--mba-accent);
          background: var(--mba-surface);
        }
        .card-footer {
          display: flex;
          justify-content: flex-end;
        }
        .delete-btn {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          color: var(--mba-danger);
          cursor: pointer;
          padding: var(--space-1);
        }
        .delete-btn:hover {
          text-decoration: underline;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 150ms ease-out forwards;
        }
      `}</style>
    </div>
  )
}
