'use client'
import React, { useState } from 'react'
import { BookOpen, Search } from 'lucide-react'
import { TabBar } from '@/components/TabBar'
import { PdfLibrary } from '@/components/PdfLibrary'
import { marketingLibrary } from '@/lib/content/marketing'
import { financeLibrary } from '@/lib/content/finance'
import { strategyLibrary } from '@/lib/content/strategy'
import { consultingLibrary } from '@/lib/content/consulting'
import { operationsLibrary } from '@/lib/content/operations'
import { peopleLibrary } from '@/lib/content/people'
import type { LibraryEntry, Specialization } from '@/lib/content/types'

// Merge all functional libraries
const ALL_BOOKS: LibraryEntry[] = [
  ...marketingLibrary,
  ...financeLibrary,
  ...strategyLibrary,
  ...consultingLibrary,
  ...operationsLibrary,
  ...peopleLibrary,
]

const FUNCTIONS: (Specialization | 'All')[] = [
  'All',
  'strategy',
  'finance',
  'marketing',
  'consulting',
  'operations',
  'people',
]

const FUNCTION_LABELS: Record<Specialization | 'All', string> = {
  All: 'All Categories',
  marketing: 'Marketing',
  finance: 'Finance',
  consulting: 'Consulting',
  operations: 'Operations',
  strategy: 'Strategy',
  people: 'People & Org',
}

const TABS = [
  { id: 'pdfs', label: 'PDF Documents' },
  { id: 'books', label: 'Reference Books' },
]

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('pdfs')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<Specialization | 'All'>('All')

  // Deduplicate books by ID just in case
  const uniqueBooks = Array.from(new Map(ALL_BOOKS.map((book) => [book.id, book])).values())

  const filteredBooks = uniqueBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTag = selectedTag === 'All' || book.tags.includes(selectedTag as Specialization)

    return matchesSearch && matchesTag
  })

  return (
    <div>
      <header className="lib-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">Knowledge</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>Library</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          Curated collection of business books, academic papers, reports, and foundational texts.
        </p>
      </header>

      {/* Primary tab bar to switch between PDFs and Books */}
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Shared Tag Filters for both PDFs and Books */}
      <div className="search-filter-section mt-6 mb-2" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div className="tag-filters">
          {FUNCTIONS.map((fn) => (
            <button
              key={fn}
              className={`tag-filter-btn font-mono text-mono-label ${selectedTag === fn ? 'active' : ''}`}
              onClick={() => setSelectedTag(fn)}
            >
              {FUNCTION_LABELS[fn]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ paddingTop: 'var(--space-4)' }}>
        {activeTab === 'pdfs' ? (
          <PdfLibrary filterTag={selectedTag === 'All' ? undefined : (selectedTag === 'people' ? 'People' : FUNCTION_LABELS[selectedTag])} />
        ) : (
          <div className="books-section">
            {/* Search Bar for books */}
            <div className="search-filter-section" style={{ borderBottom: 'none', paddingBottom: 0, marginTop: 0 }}>
              <div className="search-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  className="font-body search-input"
                  placeholder="Search by title, author, key term..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Grid of Books */}
            <div className="books-grid">
              {filteredBooks.map((book) => (
                <article key={book.id} className="book-card">
                  <div className="book-card-header">
                    <span className="font-mono text-mono-label text-mba-ink-faint uppercase">
                      {book.author} • {book.year}
                    </span>
                  </div>

                  <h3 className="font-display text-h3 text-mba-ink book-title" style={{ fontWeight: 600 }}>
                    {book.title}
                  </h3>

                  <p className="font-body text-body text-mba-ink-soft book-desc">
                    {book.description}
                  </p>

                  <div className="book-card-footer">
                    <div className="book-tags">
                      {book.tags.map((tag) => (
                        <span key={tag} className={`book-tag-chip font-mono text-mono-label tag-${tag}`}>
                          {tag}
                        </span>
                      ))}
                      {book.pages && (
                        <span className="font-mono text-mono-label text-mba-ink-faint">
                          {book.pages} pages
                        </span>
                      )}
                    </div>

                    <a
                      href={book.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="book-action-btn font-mono text-mono-label"
                    >
                      <BookOpen size={14} className="mr-1" />
                      Read
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <p className="font-body text-body text-mba-ink-faint py-8 text-center">
                No books found matching your search.
              </p>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .lib-header {
          border-left: 3px solid var(--mba-accent); padding-left: var(--space-4); padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }
        .search-filter-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          margin-bottom: var(--space-7);
        }
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: var(--space-4);
          color: var(--mba-ink-faint);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: var(--space-3) var(--space-4) var(--space-3) var(--space-8);
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          color: var(--mba-ink);
          font-size: var(--text-body);
        }
        .search-input:focus {
          outline: none;
          border-color: var(--mba-accent);
          box-shadow: 0 0 0 2px var(--mba-accent-soft);
        }
        .tag-filters {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }
        .tag-filter-btn {
          border: 1px solid var(--mba-rule);
          background: var(--mba-surface-sunk);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          color: var(--mba-ink-soft);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tag-filter-btn:hover {
          border-color: var(--mba-accent);
          color: var(--mba-accent);
        }
        .tag-filter-btn.active {
          background: var(--mba-accent);
          border-color: var(--mba-accent);
          color: var(--mba-bg);
        }
        .books-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
        }
        @media (max-width: 640px) {
          .books-grid {
            grid-template-columns: 1fr;
          }
        }
        .book-card {
          display: flex;
          flex-direction: column;
          padding: var(--space-5);
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
        }
        .book-card-header {
          margin-bottom: var(--space-2);
        }
        .book-title {
          font-size: var(--text-h3);
          color: var(--mba-ink);
          margin-bottom: var(--space-3);
          line-height: 1.3;
        }
        .book-desc {
          font-size: var(--text-body);
          color: var(--mba-ink-soft);
          margin-bottom: var(--space-5);
          flex-grow: 1;
          line-height: var(--leading-body);
        }
        .book-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--mba-rule);
          padding-top: var(--space-4);
          margin-top: auto;
        }
        .book-tags {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
        }
        .book-tag-chip {
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
          font-weight: 500;
          font-size: 9px;
        }
        .tag-marketing { background: var(--mba-accent-soft); color: var(--chip-marketing); }
        .tag-finance { background: var(--mba-accent-soft); color: var(--chip-finance); }
        .tag-strategy { background: var(--mba-accent-soft); color: var(--chip-strategy); }
        .tag-consulting { background: var(--mba-accent-soft); color: var(--chip-consulting); }
        .tag-operations { background: var(--mba-accent-soft); color: var(--chip-operations); }
        .tag-people { background: var(--mba-accent-soft); color: var(--chip-people); }
        
        .book-action-btn {
          display: inline-flex;
          align-items: center;
          color: var(--mba-accent);
          text-decoration: none;
          font-weight: 500;
        }
        .book-action-btn:hover {
          color: var(--mba-ink);
        }
      `}</style>
    </div>
  )
}
