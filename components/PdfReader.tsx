'use client'
import React, { useState } from 'react'
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Bookmark, Search, Moon, Sun, X, List } from 'lucide-react'

interface PdfReaderProps {
  title: string
  date: string
  onClose: () => void
}

interface PageContent {
  page: number
  section: string
  headline: string
  paragraphs: string[]
}

const mockNewspaperPages = (dateStr: string): PageContent[] => [
  {
    page: 1,
    section: 'Front Page & Corporate Headlines',
    headline: `Mint Daily Briefing — ${dateStr}`,
    paragraphs: [
      'IMPACT OF GLOBAL TARIFF WARS ON INDIAN INFRASTRUCTURE SECTOR: Private capital expenditure in road networks and ports expands by 14% as logistical supply routes shift toward South Asia. Analysts point to structural incentives for manufacturing co-packing facilities.',
      'RELIANCE RETAIL ACCELERATES QUICK-COMMERCE VENTURE: Plans to launch 250 dark stores across metro regions by Q4 to secure impulse categories, directly competing with Blinkit and Zepto. Average basket sizes are expected to stabilize at Rs. 650.',
      'RUPEE REBOUNDS ON FII EQUITY INFLOWS: Indian stock indices touch record highs as foreign portfolio investments surge in banking and telecom counters. RBI continues to accumulate reserves to build systemic liquidity buffers.',
    ],
  },
  {
    page: 2,
    section: 'Macroeconomics & Policy Projections',
    headline: 'GDP Growth Outlook and Sourcing Strategy',
    paragraphs: [
      'RBI GOVERNOR SIGNALS RATES TO REMAIN STABLE FOR 2 QUARTERS: Core inflation moderates to 4.2% but volatile food prices require defensive stance. The central bank emphasizes maintaining healthy real interest rates to encourage domestic financial savings.',
      'PLI CAPEX ALLOCATION TOUCHES RS. 1.2 LAKH CRORE: Electronics and solar PV modules dominate disbursement logs. Focus shifts to building domestic supply chains for sub-component assemblies to reduce reliance on import corridors.',
    ],
  },
  {
    page: 3,
    section: 'Market Intelligence & Financial Trends',
    headline: 'Corporate Earnings & Valuation Multiples',
    paragraphs: [
      'NIFTY 50 EV/EBITDA MULTIPLES HOVER AT 16.5X: Valuation premiums remain high compared to emerging market peers, driven by domestic retail mutual fund inflows. Financials and infrastructure segments trade at discount to historical averages.',
      'ACQUISITION RATIONALE IN THE METALS SEGMENT: Tata Steel evaluates distressed steel assets in Eastern India. Integration strategy targets cost synergies of Rs. 400 Crore via logistics optimization and raw material supply integration.',
    ],
  },
  {
    page: 4,
    section: 'Editorial Columns & Executive Summaries',
    headline: 'Competitiveness: The Indian Advantage',
    paragraphs: [
      'COLUMN: CROSSING THE CHASM IN DIGITAL B2B SERVICES: Traditional IT models face pressure as generative AI reduces implementation billing cycles. Firms must transition from headcount-based billing to outcome-based pricing frameworks.',
      'THE RISKS OF OVER-LEVERAGING IN INFRASTRUCTURE: Lenders attach strict debt-service coverage covenants. Financial stress tests indicate projects with debt-to-EBITDA above 4.5x face severe refinance risk in high interest rate cycles.',
    ],
  },
]

export function PdfReader({ title, date, onClose }: PdfReaderProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [showToc, setShowToc] = useState(false)

  const pages = mockNewspaperPages(date)
  const totalPages = pages.length
  const activePageData = pages.find((p) => p.page === currentPage) || pages[0]

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 70))

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const toggleBookmark = () => {
    setBookmarks((prev) =>
      prev.includes(currentPage)
        ? prev.filter((p) => p !== currentPage)
        : [...prev, currentPage].sort((a, b) => a - b)
    )
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Simple highlight generator for mock text rendering
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="search-highlight">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    )
  }

  return (
    <div className={`pdf-reader-overlay ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* 1. Header Toolbar */}
      <header className="reader-toolbar font-mono">
        <div className="toolbar-left">
          <button onClick={onClose} className="toolbar-btn" aria-label="Close reader">
            <X size={18} />
          </button>
          <span className="doc-title font-body font-bold text-caption">{title}</span>
        </div>

        <div className="toolbar-center">
          {/* Zoom controls */}
          <button onClick={handleZoomOut} className="toolbar-btn" aria-label="Zoom out">
            <ZoomOut size={16} />
          </button>
          <span className="zoom-value">{zoom}%</span>
          <button onClick={handleZoomIn} className="toolbar-btn" aria-label="Zoom in">
            <ZoomIn size={16} />
          </button>

          <div className="divider-line" />

          {/* Page navigation */}
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="toolbar-btn" aria-label="Previous page">
            <ChevronLeft size={18} />
          </button>
          <span className="page-indicator">
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="toolbar-btn" aria-label="Next page">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="toolbar-right">
          {/* Search Input */}
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search page..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input font-body"
            />
          </div>

          <button
            onClick={() => setShowToc(!showToc)}
            className={`toolbar-btn ${showToc ? 'active' : ''}`}
            aria-label="Table of contents"
          >
            <List size={16} />
          </button>

          <button
            onClick={toggleBookmark}
            className={`toolbar-btn ${bookmarks.includes(currentPage) ? 'bookmarked' : ''}`}
            aria-label="Bookmark page"
          >
            <Bookmark size={16} fill={bookmarks.includes(currentPage) ? 'currentColor' : 'none'} />
          </button>

          <button onClick={() => setIsDarkMode(!isDarkMode)} className="toolbar-btn" aria-label="Toggle dark mode">
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* 2. Main Area (Sidebar TOC + Document Page) */}
      <div className="reader-body">
        {/* Table of Contents / Bookmarks Sidebar */}
        {showToc && (
          <aside className="reader-sidebar font-body">
            <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-3">Sections</h3>
            <ul className="toc-list">
              {pages.map((p) => (
                <li key={p.page}>
                  <button
                    onClick={() => {
                      setCurrentPage(p.page)
                      setShowToc(false)
                    }}
                    className={`toc-item-btn text-left ${currentPage === p.page ? 'active' : ''}`}
                  >
                    <span className="font-mono text-caption mr-2">{p.page}.</span>
                    <span className="text-caption">{p.section}</span>
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mt-6 mb-3">Bookmarks</h3>
            {bookmarks.length === 0 ? (
              <p className="text-caption text-mba-ink-faint">No bookmarked pages.</p>
            ) : (
              <ul className="bookmarks-list font-mono text-caption">
                {bookmarks.map((pNum) => (
                  <li key={pNum}>
                    <button onClick={() => setCurrentPage(pNum)} className="bookmark-item-btn">
                      Page {pNum} — {pages[pNum - 1]?.section || 'Briefing'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}

        {/* Document Canvas Page Container */}
        <main className="document-container">
          <div
            className="document-page shadow-md"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 100ms ease',
            }}
          >
            {/* Page Header */}
            <div className="page-header font-mono">
              <span>MINT FINANCIAL PAPER</span>
              <span>{date}</span>
            </div>

            {/* Page Content */}
            <div className="page-inner font-body">
              <span className="page-section-tag font-mono">{activePageData.section}</span>
              <h2 className="page-headline font-display">{activePageData.headline}</h2>
              <div className="page-divider" />
              
              <div className="page-paragraphs text-body">
                {activePageData.paragraphs.map((pText, i) => (
                  <p key={i}>
                    {highlightText(pText, searchQuery)}
                  </p>
                ))}
              </div>
            </div>

            {/* Page Footer */}
            <div className="page-footer font-mono">
              <span>DELHI EDITION</span>
              <span>PAGE {currentPage} OF {totalPages}</span>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .pdf-reader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 100;
          background: #e2dfd5; /* parchment grey-cream background for reader context */
          display: flex;
          flex-direction: column;
          color: var(--mba-ink);
        }

        .pdf-reader-overlay.dark-mode {
          background: #14120f;
          color: #e5e2db;
        }

        /* ─── Toolbar ────────────────────────────────────────────────────── */
        .reader-toolbar {
          height: 56px;
          border-bottom: 1px solid var(--mba-rule);
          background: var(--mba-bg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-4);
          z-index: 10;
          flex-shrink: 0;
        }

        .pdf-reader-overlay.dark-mode .reader-toolbar {
          background: #1f1b16;
          border-color: #2e2820;
        }

        .toolbar-left, .toolbar-center, .toolbar-right {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .doc-title {
          font-weight: 600;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .zoom-value {
          font-size: 12px;
          min-width: 36px;
          text-align: center;
        }

        .page-indicator {
          font-size: 12px;
          min-width: 90px;
          text-align: center;
        }

        .divider-line {
          width: 1px;
          height: 20px;
          background: var(--mba-rule);
        }

        .toolbar-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: var(--mba-ink-soft);
          transition: background 150ms ease, color 150ms ease;
        }

        .toolbar-btn:hover {
          background: var(--mba-accent-soft);
          color: var(--mba-ink);
        }

        .toolbar-btn.active {
          background: var(--mba-accent-soft);
          color: var(--mba-accent);
        }

        .toolbar-btn.bookmarked {
          color: #d97706; /* amber bookmark highlight */
        }

        .toolbar-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Search Input */
        .search-wrap {
          display: flex;
          align-items: center;
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: 0 var(--space-2);
          height: 32px;
          width: 150px;
        }

        .pdf-reader-overlay.dark-mode .search-wrap {
          background: #2e2820;
          border-color: #3e362c;
        }

        .search-icon {
          color: var(--mba-ink-faint);
          margin-right: var(--space-2);
          flex-shrink: 0;
        }

        .search-input {
          border: none;
          background: transparent;
          width: 100%;
          outline: none;
          font-size: 12px;
          color: var(--mba-ink);
        }

        /* ─── Reader Body ────────────────────────────────────────────────── */
        .reader-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        /* Sidebar */
        .reader-sidebar {
          width: 260px;
          background: var(--mba-bg);
          border-right: 1px solid var(--mba-rule);
          padding: var(--space-5);
          overflow-y: auto;
          flex-shrink: 0;
        }

        .pdf-reader-overlay.dark-mode .reader-sidebar {
          background: #1f1b16;
          border-color: #2e2820;
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .toc-item-btn {
          width: 100%;
          background: none;
          border: none;
          padding: var(--space-2);
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: var(--mba-ink-soft);
          display: flex;
          align-items: flex-start;
          transition: background 150ms ease;
        }

        .toc-item-btn:hover {
          background: var(--mba-surface-sunk);
        }

        .toc-item-btn.active {
          background: var(--mba-accent-soft);
          color: var(--mba-accent);
          font-weight: 500;
        }

        .bookmarks-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .bookmark-item-btn {
          background: none;
          border: none;
          color: var(--mba-accent);
          cursor: pointer;
          text-align: left;
          padding: var(--space-1) 0;
        }

        .bookmark-item-btn:hover {
          text-decoration: underline;
        }

        /* Canvas Container */
        .document-container {
          flex: 1;
          overflow: auto;
          padding: var(--space-6) var(--space-4);
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .document-page {
          width: 600px;
          min-height: 800px;
          background: #ffffff; /* Page page is always clean paper white */
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: #1f1b16; /* Clean ink color for maximum text clarity */
          padding: var(--space-7);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .pdf-reader-overlay.dark-mode .document-page {
          background: #faf9f6; /* slightly soft warm white to prevent blinding contrast in dark mode */
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #8c8273;
          border-bottom: 1px solid #e5e2db;
          padding-bottom: var(--space-3);
          margin-bottom: var(--space-5);
        }

        .page-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .page-section-tag {
          font-size: 10px;
          color: var(--mba-accent);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: var(--space-2);
        }

        .page-headline {
          font-size: var(--text-h2);
          font-weight: 700;
          line-height: 1.25;
          margin: 0 0 var(--space-4);
          color: #1f1b16;
        }

        .page-divider {
          height: 1px;
          background: #1f1b16;
          margin-bottom: var(--space-5);
        }

        .page-paragraphs {
          line-height: 1.6;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          text-align: justify;
        }

        .page-paragraphs p {
          margin: 0;
          font-size: 14px;
        }

        .page-footer {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #8c8273;
          border-top: 1px solid #e5e2db;
          padding-top: var(--space-3);
          margin-top: var(--space-6);
        }

        :global(.search-highlight) {
          background: #fde047; /* bright yellow highlighter mark */
          color: #000000;
          padding: 0 2px;
          border-radius: 2px;
        }

        @media (max-width: 640px) {
          .document-page {
            width: 95vw;
            padding: var(--space-5);
            min-height: auto;
          }
          .toolbar-center {
            display: none; /* Hide page jump keys in slim mobile toolbar view */
          }
        }
      `}</style>
    </div>
  )
}
