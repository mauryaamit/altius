'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { TabBar } from '@/components/TabBar'
import { Citation } from '@/components/Citation'
import { Bookmark, Heart, FolderPlus, Trash2, Copy, Check, ExternalLink } from 'lucide-react'

const DOMAIN_TABS = [
  { id: 'all', label: 'All Room Types' },
  { id: 'specializations', label: 'Specializations' },
  { id: 'newspaper', label: 'Newspaper' },
  { id: 'guesstimate', label: 'Guesstimates' },
  { id: 'gd', label: 'GD Arena' },
  { id: 'pulse', label: 'Pulse' },
  { id: 'english', label: 'English' },
  { id: 'bites', label: 'Bites' }
]

export default function FavoritesPage() {
  const { favorites, contentLedger, toggleFavorite, addToCollection, removeFromCollection } = useMbaStore()
  
  // State for toggling Bookmarks vs Hearts view
  const [activeType, setActiveType] = useState<'bookmark' | 'heart'>('bookmark')
  
  // State for filtering by domain/room
  const [activeDomain, setActiveDomain] = useState('all')

  // State for collection selection
  const [selectedCollection, setSelectedCollection] = useState<string>('All')
  const [newCollectionName, setNewCollectionName] = useState('')

  // State for export feedback
  const [exportSuccess, setExportSuccess] = useState(false)

  // 1. Get unique list of all collections across all favorites
  const allCollections = useMemo(() => {
    const set = new Set<string>()
    set.add('All')
    set.add('Uncategorized')
    Object.values(favorites).forEach((fav) => {
      if (fav.collections) {
        fav.collections.forEach((c) => set.add(c))
      }
    })
    return Array.from(set)
  }, [favorites])

  // 2. Filter favorited items based on bookmarks/hearts type, selected collection, and domain tab
  const filteredItems = useMemo(() => {
    return Object.values(favorites)
      .filter((fav) => fav.type === activeType)
      .filter((fav) => {
        if (selectedCollection === 'All') return true
        if (selectedCollection === 'Uncategorized') {
          return !fav.collections || fav.collections.length === 0
        }
        return fav.collections?.includes(selectedCollection)
      })
      .map((fav) => {
        const ledgerItem = contentLedger[fav.contentLedgerId]
        if (!ledgerItem) return null
        return {
          ...ledgerItem,
          favoriteKey: fav.id, // e.g. ledgerId_type
          collections: fav.collections || []
        }
      })
      .filter(Boolean)
      .filter((item: any) => {
        if (activeDomain === 'all') return true
        if (activeDomain === 'specializations') {
          return ['marketing', 'finance', 'consulting', 'operations', 'strategy', 'people'].includes(item.page)
        }
        if (activeDomain === 'newspaper') return item.page === 'newspaper'
        if (activeDomain === 'guesstimate') return item.page === 'guesstimate'
        if (activeDomain === 'gd') return item.page === 'gd-arena'
        if (activeDomain === 'pulse') return item.page === 'pulse'
        if (activeDomain === 'english') return item.page === 'english'
        if (activeDomain === 'bites') return item.page === 'bites'
        return true
      })
      .sort((a: any, b: any) => b.date.localeCompare(a.date))
  }, [favorites, contentLedger, activeType, selectedCollection, activeDomain])

  const getPageLink = (page: string) => {
    if (page === 'gd-arena') return '/gd'
    return `/${page}`
  }

  // Handle adding a new collection to the list manually
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault()
    const name = newCollectionName.trim()
    if (!name) return
    // Select the new collection automatically
    setSelectedCollection(name)
    setNewCollectionName('')
  }

  // Export collection as Markdown plain text to clipboard
  const handleExportCollection = async () => {
    if (filteredItems.length === 0) return

    let markdown = `# Altius Study Digest: ${selectedCollection} (${activeType === 'heart' ? 'Favorites' : 'Read Later'})\n\n`
    
    filteredItems.forEach((item: any, idx: number) => {
      const body = item.contentBody
      markdown += `## ${idx + 1}. [${item.page.toUpperCase()}] ${body.company || body.headline || body.companyName || body.question || body.topic || body.name || body.word || 'Briefing'}\n`
      markdown += `*Date: ${item.date}*\n\n`
      
      if (body.dilemma) markdown += `> **Strategic Dilemma:** ${body.dilemma}\n\n`
      if (body.whatHappened) markdown += `**What Happened:** ${body.whatHappened}\n\n`
      if (body.whyItMatters) markdown += `**Why It Matters:** ${body.whyItMatters}\n\n`
      if (body.modelAnswer?.plain) markdown += `**Core Takeaway:** ${body.modelAnswer.plain}\n\n`
      if (body.definition) markdown += `**Definition:** ${body.definition}\n\n`
      
      markdown += `---\n\n`
    })

    try {
      await navigator.clipboard.writeText(markdown)
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy digest:', err)
    }
  }

  const renderCard = (item: any) => {
    const body = item.contentBody
    const type = item.contentType
    const page = item.page
    const dateStr = item.date
    const favKey = item.favoriteKey

    const cardHeader = (
      <div className="fav-card-header mb-3 pb-2 border-b border-mba-rule flex justify-between items-center">
        <div className="fav-meta font-mono text-[10px] text-mba-ink-faint flex items-center gap-2">
          <span className="fav-page-label text-mba-accent font-bold uppercase">{page}</span>
          <span className="dot-divider w-1 h-1 rounded-full bg-mba-rule" />
          <span>{dateStr}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href={getPageLink(page)} className="fav-link-icon text-mba-ink-faint hover:text-mba-ink p-1">
            <ExternalLink size={14} />
          </Link>
          <button
            onClick={() => toggleFavorite(item.id, page, type, activeType)}
            className="fav-bookmark-icon text-mba-accent p-1"
            title="Remove from this tab"
          >
            {activeType === 'heart' ? (
              <Heart size={14} fill="var(--mba-accent)" />
            ) : (
              <Bookmark size={14} fill="var(--mba-accent)" />
            )}
          </button>
        </div>
      </div>
    )

    return (
      <div key={item.favoriteKey} className="fav-card bg-mba-surface border border-mba-rule rounded-md p-5 flex flex-col justify-between">
        <div>
          {cardHeader}
          {/* Content Summary based on contentType */}
          {type === 'case' && (
            <>
              <h3 className="font-display text-h3 text-mba-ink mb-1">Case Study: {body.company}</h3>
              <p className="font-body text-caption text-mba-ink-soft mb-2">{body.sector}</p>
              <p className="font-body text-body text-mba-ink-soft mb-3">{body.dilemma}</p>
            </>
          )}
          {type === 'hotTopic' && (
            <>
              <h3 className="font-display text-h3 text-mba-ink mb-2">{body.headline}</h3>
              <p className="font-body text-body text-mba-ink-soft mb-3">{body.whatHappened}</p>
            </>
          )}
          {type === 'think' && (
            <>
              <h3 className="font-display text-h3 text-mba-ink mb-2">{body.question}</h3>
              <p className="font-body text-body text-mba-ink-soft mb-3">{body.modelAnswer?.plain}</p>
            </>
          )}
          {type === 'companySpotlight' && (
            <>
              <h3 className="font-display text-h3 text-mba-ink mb-1">Spotlight: {body.companyName}</h3>
              <p className="font-body text-body text-mba-ink-soft mb-3">{body.identity}</p>
            </>
          )}
          {type === 'guesstimateProblem' && (
            <>
              <h3 className="font-display text-h3 text-mba-ink mb-2">{body.question}</h3>
              <p className="font-mono text-caption text-mba-accent">Result: {body.approach1?.result}</p>
            </>
          )}
          {type === 'gdTopic' && (
            <>
              <h3 className="font-display text-h3 text-mba-ink mb-2">{body.topic}</h3>
              <p className="font-body text-body text-mba-ink-soft mb-3">{body.framing?.slice(0, 120)}...</p>
            </>
          )}
          {type === 'pulseStory' && (
            <>
              <h3 className="font-display text-h3 text-mba-ink mb-2">{body.filter}: {body.whatHappened?.slice(0, 90)}...</h3>
            </>
          )}
          {type === 'bite' && (
            <>
              <span className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-1">{body.type}</span>
              <h3 className="font-display text-h3 text-mba-ink mb-2">{body.name}</h3>
              <p className="font-body text-body text-mba-ink-soft mb-3">{body.altitude?.plain || body.altitude?.hook}</p>
            </>
          )}
          {type === 'vocabularyWord' && (
            <>
              <h3 className="font-display text-h3 text-mba-ink mb-1">{body.word}</h3>
              <p className="font-body text-body text-mba-ink-soft mb-3">{body.definition}</p>
            </>
          )}
          {type === 'grammarRule' && (
            <>
              <h3 className="font-display text-h3 text-mba-ink mb-1">{body.rule}</h3>
              <p className="font-body text-body text-mba-ink-soft mb-3">{body.commonError}</p>
            </>
          )}
        </div>

        {/* Collections Manager for this item */}
        <div className="card-collections-manager mt-4 pt-3 border-t border-mba-rule font-mono text-[10px]">
          <div className="text-mba-ink-faint mb-2">COLLECTIONS:</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {item.collections.map((colName: string) => (
              <span key={colName} className="collection-chip flex items-center bg-mba-surface-sunk border border-mba-rule px-2 py-0.5 rounded text-mba-ink-soft">
                {colName}
                <button
                  onClick={() => removeFromCollection(favKey, colName)}
                  className="ml-1 text-mba-danger hover:text-red-700"
                >
                  &times;
                </button>
              </span>
            ))}
            {item.collections.length === 0 && (
              <span className="text-mba-ink-faint italic">No collections assigned</span>
            )}
          </div>
          
          <select
            onChange={(e) => {
              if (e.target.value) {
                addToCollection(favKey, e.target.value)
                e.target.value = ''
              }
            }}
            className="collection-select bg-mba-surface border border-mba-rule rounded p-1 text-[10px] text-mba-ink"
            defaultValue=""
          >
            <option value="" disabled>+ Add to collection</option>
            {allCollections
              .filter((c) => c !== 'All' && c !== 'Uncategorized' && !item.collections.includes(c))
              .map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            <option value="NEW_PROMPT">+ Create collection</option>
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-page font-body">
      <header className="fav-header border-l-3 border-mba-accent pl-4 pb-6 border-b border-mba-rule mb-6">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">YOU</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>Bookmarks & Favorites</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          Manage saved content, organize insights into customized study collections, and export digests.
        </p>
      </header>

      {/* Bookmarks vs Hearts Split Navigation */}
      <div className="tab-split-strip flex border-b border-mba-rule mb-6">
        <button
          onClick={() => {
            setActiveType('bookmark')
            setSelectedCollection('All')
          }}
          className={`split-tab-btn font-mono text-[11px] uppercase tracking-wider pb-3 px-4 ${activeType === 'bookmark' ? 'active' : ''}`}
        >
          <Bookmark size={12} className="inline mr-1" /> Bookmarks (Read Later)
        </button>
        <button
          onClick={() => {
            setActiveType('heart')
            setSelectedCollection('All')
          }}
          className={`split-tab-btn font-mono text-[11px] uppercase tracking-wider pb-3 px-4 ${activeType === 'heart' ? 'active' : ''}`}
        >
          <Heart size={12} className="inline mr-1" /> Hearts (Favorites)
        </button>
      </div>

      <div className="favorites-layout grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left column: Collections filter list */}
        <aside className="collections-sidebar md:col-span-1 border-r border-mba-rule pr-6">
          <h2 className="font-mono text-mono-label text-mba-accent uppercase tracking-widest mb-4">
            Collections
          </h2>
          <ul className="collections-list flex flex-col gap-1 font-mono text-[11px] mb-6">
            {allCollections.map((col) => (
              <li key={col}>
                <button
                  onClick={() => setSelectedCollection(col)}
                  className={`collection-filter-btn text-left w-full py-2 px-3 rounded transition-all ${selectedCollection === col ? 'bg-mba-accent text-white font-bold' : 'text-mba-ink-soft hover:bg-mba-surface-sunk'}`}
                >
                  {col}
                </button>
              </li>
            ))}
          </ul>

          {/* Create custom collection box */}
          <form onSubmit={handleCreateCollection} className="create-collection-form border-t border-mba-rule pt-4">
            <label className="font-mono text-[9px] text-mba-ink-faint block uppercase mb-2">New Collection</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="e.g. McKinsey Prep"
                className="col-input bg-mba-surface border border-mba-rule rounded p-1 text-[11px] flex-grow text-mba-ink"
              />
              <button type="submit" className="add-col-btn bg-mba-surface border border-mba-rule p-1 rounded hover:bg-mba-surface-sunk" aria-label="Add collection">
                <FolderPlus size={14} className="text-mba-accent" />
              </button>
            </div>
          </form>
        </aside>

        {/* Right column: Items grid and header controls */}
        <main className="items-main md:col-span-3">
          {/* Action Row */}
          <div className="action-header-row flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="font-display text-h2 text-mba-ink">
              {selectedCollection} <span className="font-mono text-caption text-mba-ink-faint">({filteredItems.length} items)</span>
            </h2>

            {filteredItems.length > 0 && (
              <button
                onClick={handleExportCollection}
                className="export-btn font-mono text-[10px] uppercase tracking-wider flex items-center bg-mba-surface border border-mba-rule py-1.5 px-3 rounded hover:bg-mba-surface-sunk transition-all"
              >
                {exportSuccess ? (
                  <>
                    <Check size={11} className="text-mba-success mr-1.5 animate-bounce" /> Digest Copied
                  </>
                ) : (
                  <>
                    <Copy size={11} className="text-mba-accent mr-1.5" /> Export Study Digest
                  </>
                )}
              </button>
            )}
          </div>

          {/* Domain tabs filter strip */}
          <div className="domain-tabs-wrapper mb-6 border-b border-mba-rule">
            <TabBar tabs={DOMAIN_TABS} activeTab={activeDomain} onTabChange={setActiveDomain} />
          </div>

          {/* Items stack */}
          {filteredItems.length === 0 ? (
            <div className="empty-state text-center py-16 border border-dashed border-mba-rule rounded-md bg-mba-surface-sunk">
              <Bookmark size={40} className="text-mba-ink-faint mx-auto mb-3 animate-pulse" />
              <h3 className="font-display text-h3 text-mba-ink mb-1">No items found</h3>
              <p className="text-caption text-mba-ink-soft max-w-xs mx-auto">
                No saved briefings match the selected collection or room filters in this tab.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(renderCard)}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .split-tab-btn {
          border: none;
          background: transparent;
          color: var(--mba-ink-faint);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 150ms ease;
        }
        .split-tab-btn.active {
          color: var(--mba-accent);
          border-bottom-color: var(--mba-accent);
          font-weight: 600;
        }
        .collection-filter-btn {
          border: none;
          background: transparent;
          cursor: pointer;
        }
        .col-input:focus {
          outline: none;
          border-color: var(--mba-accent);
        }
        .export-btn {
          color: var(--mba-ink-soft);
          cursor: pointer;
        }
        .collection-chip button {
          border: none;
          background: transparent;
          font-size: 11px;
          cursor: pointer;
        }
        .collection-select {
          outline: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
