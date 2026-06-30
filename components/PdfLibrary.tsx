'use client'
import React, { useState, useMemo } from 'react'
import { Search, Plus, FileText, Download, Check, AlertCircle } from 'lucide-react'
import { useMbaStore } from '@/lib/stores/mbaStore'

export interface PdfDocument {
  id: string
  title: string
  subjectTags: string[]
  uploadedAt: string
  sourceType: string
  fileUrl: string
  pageCount: number
  description: string
}

interface PdfLibraryProps {
  filterTag?: string // Optional pre-filter tag
}

const TAG_TAXONOMY = [
  'Marketing',
  'Finance',
  'Consulting',
  'Operations',
  'Strategy',
  'People',
  'Newspaper & Current Affairs',
  'Guesstimate & Cases',
  'General Reference',
]

export function PdfLibrary({ filterTag }: PdfLibraryProps) {
  const { libraryDocuments, addLibraryDocument } = useMbaStore()
  const documents = libraryDocuments
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>(
    filterTag ? [filterTag] : []
  )

  React.useEffect(() => {
    if (filterTag) {
      setSelectedTags([filterTag])
    } else {
      setSelectedTags([])
    }
  }, [filterTag])

  const tagColorMap: Record<string, string> = {
    'Marketing': 'var(--chip-marketing)',
    'Finance': 'var(--chip-finance)',
    'Consulting': 'var(--chip-consulting)',
    'Operations': 'var(--chip-operations)',
    'Strategy': 'var(--chip-strategy)',
    'People': 'var(--chip-people)',
    'Newspaper & Current Affairs': '#1E3A5F',
    'Guesstimate & Cases': '#3B7A57',
    'General Reference': '#705335',
  }

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    TAG_TAXONOMY.forEach((tag) => {
      counts[tag] = documents.filter((doc) => doc.subjectTags.includes(tag)).length
    })
    return counts
  }, [documents])
  
  // Upload form state
  const [showUpload, setShowUpload] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadDesc, setUploadDesc] = useState('')
  const [uploadSourceType, setUploadSourceType] = useState('Report')
  const [uploadPageCount, setUploadPageCount] = useState(1)
  const [uploadSelectedTags, setUploadSelectedTags] = useState<string[]>([])
  const [uploadPassword, setUploadPassword] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Toggle tag in filter
  const toggleTag = (tag: string) => {
    if (filterTag) return // If pre-filtered, don't allow changing the main tag
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  // Handle mock upload
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError('')
    setUploadSuccess(false)

    if (uploadPassword !== 'altius123') {
      setUploadError('Invalid admin password.')
      return
    }

    if (!uploadTitle.trim() || !uploadDesc.trim() || uploadSelectedTags.length === 0) {
      setUploadError('Please fill in all fields and select at least one tag.')
      return
    }

    const newDoc: PdfDocument = {
      id: `pdf-${Date.now()}`,
      title: uploadTitle,
      description: uploadDesc,
      sourceType: uploadSourceType,
      pageCount: Number(uploadPageCount) || 1,
      subjectTags: uploadSelectedTags,
      uploadedAt: new Date().toISOString().slice(0, 10),
      fileUrl: '#',
    }

    addLibraryDocument(newDoc)
    setUploadSuccess(true)
    
    // Reset form
    setUploadTitle('')
    setUploadDesc('')
    setUploadSourceType('Report')
    setUploadPageCount(1)
    setUploadSelectedTags([])
    setUploadPassword('')
    
    setTimeout(() => {
      setShowUpload(false)
      setUploadSuccess(false)
    }, 1500)
  }

  const toggleFormTag = (tag: string) => {
    setUploadSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  // Filter and search logic
  const filteredDocs = useMemo(() => {
    return documents
      .filter((doc) => {
        // Tag filter
        if (selectedTags.length > 0) {
          const hasMatchingTag = doc.subjectTags.some((tag) =>
            selectedTags.some((selected) => selected.toLowerCase() === tag.toLowerCase())
          )
          if (!hasMatchingTag) return false
        }
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          const matchesTitle = doc.title.toLowerCase().includes(query)
          const matchesDesc = doc.description.toLowerCase().includes(query)
          if (!matchesTitle && !matchesDesc) return false
        }
        return true
      })
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
  }, [documents, selectedTags, searchQuery])

  return (
    <div className="pdf-library">
      {/* Search and Filters block */}
      <div className="library-controls">
        <div className="search-bar-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input font-body text-body"
            placeholder="Search documents by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tag selection cards grid */}
        {!filterTag && (
          <div className="tag-filter-section">
            <span className="font-mono text-mono-label text-mba-ink-faint block mb-3">Filter by Subject:</span>
            <div className="tag-cards-grid">
              {TAG_TAXONOMY.map((tag) => {
                const isSelected = selectedTags.includes(tag)
                const docCount = tagCounts[tag] || 0
                const tagColor = tagColorMap[tag] || 'var(--mba-accent)'
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`tag-card-btn font-body text-left ${isSelected ? 'active' : ''}`}
                    style={{ '--tag-color': tagColor } as React.CSSProperties}
                  >
                    <div className="tag-card-header">
                      <span className="tag-indicator" style={{ backgroundColor: tagColor }} />
                      <span className="doc-count font-mono text-mono-label">{docCount} doc{docCount !== 1 ? 's' : ''}</span>
                    </div>
                    <span className="tag-card-label font-display font-bold">{tag}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Admin upload trigger */}
      {!filterTag && (
        <div className="admin-actions">
          <button onClick={() => setShowUpload(!showUpload)} className="admin-upload-btn font-mono text-mono-label">
            <Plus size={14} className="mr-1" /> {showUpload ? 'Close Upload Form' : 'Upload Document'}
          </button>
        </div>
      )}

      {/* Upload Form Box */}
      {showUpload && (
        <div className="upload-form-box">
          <h3 className="font-display text-h3 text-mba-ink mb-4">Add PDF to Library</h3>
          
          <form onSubmit={handleUploadSubmit} className="upload-form">
            <div className="form-group">
              <label className="font-mono text-mono-label">Document Title</label>
              <input
                type="text"
                className="form-input font-body"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. RBI Financial Stability Report (June 2024)"
                required
              />
            </div>

            <div className="form-group">
              <label className="font-mono text-mono-label">Description</label>
              <textarea
                className="form-input font-body"
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                placeholder="Write a brief, high-value summary of this document's contents..."
                rows={3}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label className="font-mono text-mono-label">Source Type</label>
                <select
                  className="form-input font-body"
                  value={uploadSourceType}
                  onChange={(e) => setUploadSourceType(e.target.value)}
                >
                  <option>Report</option>
                  <option>Newspaper</option>
                  <option>Case Study</option>
                  <option>Book</option>
                </select>
              </div>

              <div className="form-group half">
                <label className="font-mono text-mono-label">Page Count</label>
                <input
                  type="number"
                  className="form-input font-body"
                  value={uploadPageCount}
                  onChange={(e) => setUploadPageCount(Number(e.target.value))}
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="font-mono text-mono-label block mb-2">Subject Tags</label>
              <div className="form-tags-grid">
                {TAG_TAXONOMY.map((tag) => {
                  const isSelected = uploadSelectedTags.includes(tag)
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleFormTag(tag)}
                      className={`form-tag-btn font-mono text-mono-label ${isSelected ? 'active' : ''}`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="font-mono text-mono-label">Admin Security Password</label>
              <input
                type="password"
                className="form-input font-body"
                value={uploadPassword}
                onChange={(e) => setUploadPassword(e.target.value)}
                placeholder="Enter password to authenticate upload"
                required
              />
            </div>

            {uploadError && (
              <div className="form-alert error font-body">
                <AlertCircle size={14} className="mr-2" /> {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="form-alert success font-body">
                <Check size={14} className="mr-2" /> Document uploaded and synchronized.
              </div>
            )}

            <button type="submit" className="form-submit-btn font-mono text-mono-label mt-2">
              Save Document
            </button>
          </form>
        </div>
      )}

      {/* Documents List */}
      <div className="documents-list">
        {filteredDocs.length === 0 ? (
          <div className="empty-state font-body text-body text-mba-ink-soft">
            No matching documents found in library.
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div key={doc.id} className="doc-item">
              <div className="doc-icon-col">
                <FileText size={24} className="text-mba-accent" />
              </div>
              <div className="doc-content-col">
                <div className="doc-header-row">
                  <h4 className="doc-title font-display text-h3 text-mba-ink">{doc.title}</h4>
                  <div className="doc-meta font-mono text-mono-label text-mba-ink-faint">
                    <span>{doc.pageCount} pages</span>
                    <span className="dot-divider" />
                    <span>{doc.uploadedAt}</span>
                  </div>
                </div>
                <p className="doc-desc font-body text-caption text-mba-ink-soft">{doc.description}</p>
                <div className="doc-footer-row">
                  <div className="doc-tags">
                    {doc.subjectTags.map((tag) => (
                      <span key={tag} className="doc-tag font-mono text-mono-label">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doc-download-btn font-mono text-mono-label"
                  >
                    <Download size={12} className="mr-1" /> View & Download PDF
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .pdf-library {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .library-controls {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .search-bar-wrap {
          display: flex;
          align-items: center;
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          gap: var(--space-3);
        }

        .search-icon {
          color: var(--mba-ink-faint);
        }

        .search-input {
          border: none;
          background: transparent;
          flex: 1;
          color: var(--mba-ink);
          outline: none;
        }

        .tag-filter-section {
          width: 100%;
          margin-bottom: var(--space-6);
        }
        .tag-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: var(--space-3);
        }
        .tag-card-btn {
          border: 1px solid var(--mba-rule);
          background: var(--mba-surface-sunk);
          padding: var(--space-4);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 150ms ease;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          border-left: 3px solid var(--tag-color);
        }
        .tag-card-btn:hover {
          background: var(--mba-accent-soft);
          border-color: var(--tag-color);
        }
        .tag-card-btn.active {
          background: var(--mba-surface);
          border-color: var(--tag-color);
          border-left: 5px solid var(--tag-color);
          box-shadow: var(--shadow-sm);
        }
        .tag-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .tag-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .doc-count {
          font-size: 10px;
          color: var(--mba-ink-faint);
        }
        .tag-card-label {
          font-size: 14px;
          color: var(--mba-ink);
        }

        .admin-actions {
          display: flex;
          justify-content: flex-end;
        }

        .admin-upload-btn {
          border: 1px dashed var(--mba-accent);
          background: transparent;
          color: var(--mba-accent);
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          transition: background 150ms ease;
        }

        .admin-upload-btn:hover {
          background: var(--mba-accent-soft);
        }

        /* ─── Upload Form ─────────────────────────────────────────────────── */
        .upload-form-box {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          animation: fadeSlideIn 200ms ease;
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .form-row {
          display: flex;
          gap: var(--space-4);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .form-group.half {
          flex: 1;
        }

        .form-input {
          padding: var(--space-3);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          background: var(--mba-bg);
          color: var(--mba-ink);
          outline: none;
          font-size: var(--text-caption);
        }

        .form-tags-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: var(--space-2);
        }

        .form-tag-btn {
          padding: var(--space-2);
          border: 1px solid var(--mba-rule);
          background: var(--mba-surface);
          color: var(--mba-ink-soft);
          border-radius: var(--radius-sm);
          cursor: pointer;
          text-align: left;
        }

        .form-tag-btn:hover {
          background: var(--mba-surface-sunk);
        }

        .form-tag-btn.active {
          border-color: var(--mba-accent);
          color: var(--mba-accent);
          background: var(--mba-accent-soft);
        }

        .form-alert {
          display: flex;
          align-items: center;
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          font-size: var(--text-caption);
        }

        .form-alert.error {
          background: #fde8e8;
          color: var(--mba-danger);
          border: 1px solid #f8b4b4;
        }

        .form-alert.success {
          background: #def7ec;
          color: var(--mba-success);
          border: 1px solid #84e1bc;
        }

        .form-submit-btn {
          background: var(--mba-accent);
          color: var(--mba-bg);
          border: none;
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          cursor: pointer;
          text-align: center;
        }

        .form-submit-btn:hover {
          opacity: 0.95;
        }

        /* ─── Documents List ──────────────────────────────────────────────── */
        .documents-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .empty-state {
          padding: var(--space-6);
          text-align: center;
          border: 1px dashed var(--mba-rule);
          border-radius: var(--radius-md);
        }

        .doc-item {
          display: flex;
          gap: var(--space-4);
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          transition: border-color 150ms ease;
        }

        .doc-item:hover {
          border-color: var(--mba-ink-faint);
        }

        .doc-icon-col {
          flex-shrink: 0;
          display: flex;
          align-items: flex-start;
          padding-top: 2px;
        }

        .doc-content-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .doc-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .doc-title {
          font-weight: 600;
          line-height: 1.25;
        }

        .doc-meta {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: 10px;
        }

        .dot-divider {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--mba-ink-faint);
        }

        .doc-desc {
          margin: 0;
        }

        .doc-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--space-2);
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .doc-tags {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        .doc-tag {
          font-size: 10px;
          background: var(--mba-surface-sunk);
          color: var(--mba-ink-soft);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }

        .doc-download-btn {
          color: var(--mba-accent);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: color 150ms ease;
        }

        .doc-download-btn:hover {
          color: var(--mba-ink);
        }
      `}</style>
    </div>
  )
}
