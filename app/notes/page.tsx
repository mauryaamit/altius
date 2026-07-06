'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { Search, Trash2, Calendar, FileText, ArrowRight } from 'lucide-react'

// Map content types to display labels
const contentTypeLabels: Record<string, string> = {
  case: 'Case Study',
  hotTopic: 'Hot Topic',
  companySpotlight: 'Company Spotlight',
  think: 'Think Question',
}

const pageLabels: Record<string, string> = {
  marketing: 'Marketing',
  finance: 'Finance',
  consulting: 'Consulting',
  operations: 'Operations',
  strategy: 'Strategy',
  people: 'People & Organization',
}

export default function NotesPage() {
  const { notes, deleteNote } = useMbaStore()
  const [searchQuery, setSearchQuery] = useState('')

  const notesList = Object.values(notes)

  // Filter notes based on search query
  const filteredNotes = notesList.filter(
    (n) =>
      n.noteText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.contentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pageLabels[n.page] || n.page).toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group notes by specialization page
  const groupedNotes = filteredNotes.reduce((groups, note) => {
    const key = note.page
    if (!groups[key]) groups[key] = []
    groups[key].push(note)
    return groups
  }, {} as Record<string, typeof notesList>)

  const handleDelete = async (contentRef: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(contentRef)
    }
  }

  // Parse date from contentRef (format is usually page_contentType__YYYY-MM-DD)
  const getNoteDate = (contentRef: string) => {
    const parts = contentRef.split('__')
    if (parts.length > 1) {
      return parts[1]
    }
    return ''
  }

  // Build target link based on note page and content type
  const getNoteLink = (note: any) => {
    const tabMap: Record<string, string> = {
      case: 'case',
      hotTopic: 'hot-topic',
      companySpotlight: 'company',
      think: 'think',
    }
    const tab = tabMap[note.contentType] || 'concepts'
    return `/${note.page}?tab=${tab}`
  }

  return (
    <div className="notes-container font-body">
      <header className="notes-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">
          Your Insights
        </span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>
          Personal Notebook
        </h1>
        <p className="text-body text-mba-ink-soft mt-2 prose-measure">
          Search and review personal annotations, case takeaways, and lecture insights captured across rooms.
        </p>
      </header>

      {notesList.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} className="text-mba-ink-faint mb-4" />
          <h3 className="font-display text-h3 text-mba-ink mb-1">Notebook is empty</h3>
          <p className="text-caption text-mba-ink-soft mb-4">
            Notes you add to cases, hot topics, or think questions will appear here.
          </p>
          <Link href="/" className="explore-btn font-mono text-mono-label">
            Go to Rooms <ArrowRight size={12} className="ml-1" />
          </Link>
        </div>
      ) : (
        <div className="notes-content mt-6">
          {/* Search Bar */}
          <div className="search-wrapper mb-6">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search notes by keyword, title, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input text-body"
            />
          </div>

          {filteredNotes.length === 0 ? (
            <p className="text-caption text-mba-ink-faint py-8 text-center">
              No notes match your search criteria.
            </p>
          ) : (
            <div className="notes-stack">
              {Object.keys(groupedNotes).map((pageKey) => (
                <div key={pageKey} className="group-section mb-8">
                  <h2 className="font-mono text-mono-label text-mba-accent uppercase tracking-widest mb-4 border-b border-mba-rule pb-2">
                    {pageLabels[pageKey] || pageKey}
                  </h2>
                  <div className="grid gap-4">
                    {groupedNotes[pageKey].map((note) => {
                      const date = getNoteDate(note.contentRef)
                      return (
                        <div key={note.id} className="note-item-card">
                          <div className="card-top-row">
                            <div className="type-tag font-mono text-[10px] text-mba-ink-faint">
                              {contentTypeLabels[note.contentType] || note.contentType}
                              {date && ` · ${date}`}
                            </div>
                            <button
                              onClick={() => handleDelete(note.contentRef)}
                              className="delete-icon-btn"
                              aria-label="Delete note"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <Link href={getNoteLink(note)} className="card-title-link">
                            <h3 className="font-display text-h3 text-mba-ink hover:underline">
                              {note.contentTitle}
                            </h3>
                          </Link>

                          <p className="note-text text-body text-mba-ink-soft mt-3 whitespace-pre-wrap">
                            {note.noteText}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .notes-header {
          border-left: 3px solid var(--mba-accent);
          padding-left: var(--space-4);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-8) var(--space-4);
          background: var(--mba-surface);
          border: 1px dashed var(--mba-rule);
          border-radius: var(--radius-lg);
          text-align: center;
        }
        .explore-btn {
          display: inline-flex;
          align-items: center;
          background: var(--mba-accent);
          color: var(--mba-surface);
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-sm);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: opacity 150ms ease;
        }
        .explore-btn:hover {
          opacity: 0.9;
        }
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: var(--space-4);
          color: var(--mba-ink-faint);
        }
        .search-input {
          width: 100%;
          padding: var(--space-3) var(--space-4) var(--space-3) var(--space-7);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          background: var(--mba-surface);
          color: var(--mba-ink);
          transition: border-color 150ms ease;
        }
        .search-input:focus {
          outline: none;
          border-color: var(--mba-accent);
        }
        .note-item-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          box-shadow: var(--shadow-sm);
          position: relative;
        }
        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-2);
        }
        .delete-icon-btn {
          background: none;
          border: none;
          color: var(--mba-ink-faint);
          cursor: pointer;
          transition: color 150ms ease;
          padding: var(--space-1);
        }
        .delete-icon-btn:hover {
          color: var(--mba-danger);
        }
        .card-title-link {
          text-decoration: none;
        }
        .note-text {
          border-left: 2px solid var(--mba-rule);
          padding-left: var(--space-4);
          line-height: var(--leading-body);
        }
      `}</style>
    </div>
  )
}
