'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { TabBar } from '@/components/TabBar'
import { Citation } from '@/components/Citation'
import { AssumptionTable } from '@/components/AssumptionTable'
import { AltitudeBlock } from '@/components/AltitudeBlock'
import { Bookmark, Calendar, ExternalLink } from 'lucide-react'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'specializations', label: 'Specializations' },
  { id: 'newspaper', label: 'Newspaper' },
  { id: 'guesstimate', label: 'Guesstimates' },
  { id: 'gd', label: 'GD Arena' },
  { id: 'pulse', label: 'Pulse' },
  { id: 'english', label: 'English' },
  { id: 'bites', label: 'Bites' }
]

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState('all')
  const { favorites, contentLedger, toggleFavorite } = useMbaStore()

  const favoritedItems = useMemo(() => {
    return Object.values(favorites)
      .map(fav => contentLedger[fav.contentLedgerId])
      .filter(Boolean)
      .sort((a, b) => b.date.localeCompare(a.date)) // newest first
  }, [favorites, contentLedger])

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return favoritedItems
    if (activeTab === 'specializations') {
      return favoritedItems.filter(item => ['marketing', 'finance', 'consulting', 'operations', 'strategy', 'people'].includes(item.page))
    }
    if (activeTab === 'newspaper') {
      return favoritedItems.filter(item => item.page === 'newspaper')
    }
    if (activeTab === 'guesstimate') {
      return favoritedItems.filter(item => item.page === 'guesstimate')
    }
    if (activeTab === 'gd') {
      return favoritedItems.filter(item => item.page === 'gd-arena')
    }
    if (activeTab === 'pulse') {
      return favoritedItems.filter(item => item.page === 'pulse')
    }
    if (activeTab === 'english') {
      return favoritedItems.filter(item => item.page === 'english')
    }
    if (activeTab === 'bites') {
      return favoritedItems.filter(item => item.page === 'bites')
    }
    return favoritedItems
  }, [favoritedItems, activeTab])

  const getPageLink = (page: string) => {
    if (page === 'gd-arena') return '/gd'
    return `/${page}`
  }

  const renderFavoriteCard = (item: any) => {
    const body = item.contentBody
    const type = item.contentType
    const page = item.page
    const dateStr = item.date

    const header = (
      <div className="fav-card-header">
        <div className="fav-meta">
          <span className="fav-page-label font-mono uppercase tracking-widest">{page}</span>
          <span className="dot-divider" />
          <span className="fav-date font-mono">{dateStr}</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Link href={getPageLink(page)} className="fav-link-icon" title="Go to section">
            <ExternalLink size={16} />
          </Link>
          <button
            onClick={() => toggleFavorite(item.id, page, type)}
            className="fav-bookmark-icon active"
            title="Unsave"
          >
            <Bookmark size={16} fill="var(--mba-accent)" />
          </button>
        </div>
      </div>
    )

    // Render based on contentType
    if (type === 'case') {
      return (
        <div key={item.id} className="fav-card fav-case">
          {header}
          <h3 className="font-display text-h3 text-mba-ink mb-2">Case Study: {body.company}</h3>
          <p className="font-body text-caption text-mba-ink-soft mb-3">{body.sector}</p>
          <p className="font-body text-body text-mba-ink-soft mb-4">{body.dilemma}</p>
        </div>
      )
    }

    if (type === 'hotTopic') {
      return (
        <div key={item.id} className="fav-card fav-hot-topic">
          {header}
          <h3 className="font-display text-h3 text-mba-ink mb-3">{body.headline}</h3>
          <p className="font-body text-body text-mba-ink-soft mb-4">{body.whatHappened}</p>
        </div>
      )
    }

    if (type === 'think') {
      return (
        <div key={item.id} className="fav-card fav-think">
          {header}
          <h3 className="font-display text-h3 text-mba-ink mb-3">{body.question}</h3>
          <p className="font-body text-body text-mba-ink-soft mb-4">{body.modelAnswer?.plain}</p>
        </div>
      )
    }

    if (type === 'companySpotlight') {
      return (
        <div key={item.id} className="fav-card fav-spotlight">
          {header}
          <h3 className="font-display text-h3 text-mba-ink mb-2">Company Spotlight: {body.companyName}</h3>
          <p className="font-body text-body text-mba-ink-soft mb-4">{body.identity}</p>
        </div>
      )
    }

    if (type === 'guesstimateProblem') {
      return (
        <div key={item.id} className="fav-card fav-guesstimate">
          {header}
          <h3 className="font-display text-h3 text-mba-ink mb-4">{body.question}</h3>
          <p className="font-mono text-caption text-mba-accent mb-2">Approach 1: {body.approach1.name}</p>
          <p className="font-mono text-body text-mba-ink-soft mb-2">{body.approach1.result}</p>
        </div>
      )
    }

    if (type === 'gdTopic') {
      return (
        <div key={item.id} className="fav-card fav-gd">
          {header}
          <h3 className="font-display text-h3 text-mba-ink mb-3">{body.topic}</h3>
          <p className="font-body text-body text-mba-ink-soft mb-4">{body.framing.slice(0, 150)}...</p>
        </div>
      )
    }

    if (type === 'pulseStory') {
      return (
        <div key={item.id} className="fav-card fav-pulse">
          {header}
          <h3 className="font-display text-h3 text-mba-ink mb-3">{body.filter}: {body.whatHappened.slice(0, 100)}...</h3>
          <p className="font-body text-body text-mba-ink-soft mb-4">{body.whyItMatters}</p>
        </div>
      )
    }

    if (type === 'bite') {
      return (
        <div key={item.id} className="fav-card fav-bite">
          {header}
          <span className="font-mono text-mono-label text-mba-accent uppercase tracking-widest block mb-2">{body.type}</span>
          <h3 className="font-display text-h3 text-mba-ink mb-3">{body.name}</h3>
          <p className="font-body text-body text-mba-ink-soft mb-4">{body.altitude.plain || body.altitude.hook}</p>
        </div>
      )
    }



    if (type === 'vocabularyWord') {
      return (
        <div key={item.id} className="fav-card fav-vocab">
          {header}
          <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-1">Word</span>
          <h3 className="font-display text-h3 text-mba-ink mb-2" style={{ fontSize: '24px' }}>{body.word}</h3>
          <p className="font-body text-body text-mba-ink-soft mb-4">{body.definition}</p>
        </div>
      )
    }

    if (type === 'grammarRule') {
      return (
        <div key={item.id} className="fav-card fav-grammar">
          {header}
          <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-1">Grammar Rule</span>
          <h3 className="font-display text-h3 text-mba-ink mb-3">{body.rule}</h3>
          <p className="font-body text-body text-mba-ink-soft mb-4">{body.commonError}</p>
        </div>
      )
    }

    if (type === 'readingPassage') {
      return (
        <div key={item.id} className="fav-card fav-reading">
          {header}
          <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-1">Reading Passage</span>
          <h3 className="font-display text-h3 text-mba-ink mb-3">{body.title}</h3>
          <p className="font-body text-body text-mba-ink-soft mb-4">{body.passage.slice(0, 150)}...</p>
        </div>
      )
    }

    if (type === 'watPrompt') {
      return (
        <div key={item.id} className="fav-card fav-wat">
          {header}
          <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-1">WAT Essay Prompt</span>
          <h3 className="font-display text-h3 text-mba-ink mb-3">&ldquo;{body.prompt}&rdquo;</h3>
        </div>
      )
    }

    if (type === 'newspaperBrief') {
      return (
        <div key={item.id} className="fav-card fav-news">
          {header}
          <span className="font-mono text-mono-label text-mba-accent uppercase tracking-widest block mb-1">{body.outlet} Brief</span>
          <h3 className="font-display text-h3 text-mba-ink mb-3">{body.headline}</h3>
          <p className="font-body text-body text-mba-ink-soft mb-4">{body.takeaway}</p>
        </div>
      )
    }

    if (type === 'businessNews') {
      return (
        <div key={item.id} className="fav-card fav-news">
          {header}
          <span className="font-mono text-mono-label text-mba-accent uppercase tracking-widest block mb-1">Business News</span>
          <h3 className="font-display text-h3 text-mba-ink mb-3">{body.headline}</h3>
          <p className="font-body text-body text-mba-ink-soft mb-4">{body.context}</p>
        </div>
      )
    }

    return null
  }

  return (
    <div>
      <header className="fav-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">You</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>Favorites</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          Your bookmarked frameworks, business cases, estimation problems, and vocabulary words.
        </p>
      </header>

      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="fav-list-container" style={{ paddingTop: 'var(--space-6)' }}>
        {filteredItems.length === 0 ? (
          <div className="fav-empty-state">
            <Bookmark size={48} className="text-mba-ink-faint mb-4 animate-pulse" />
            <h3 className="font-display text-h3 text-mba-ink font-bold mb-2">No bookmarked items yet</h3>
            <p className="font-body text-body text-mba-ink-soft max-w-sm mx-auto">
              Tap the bookmark icon on any card across the Altius suites to save items here for quick retrieval and review.
            </p>
          </div>
        ) : (
          <div className="fav-grid">
            {filteredItems.map(renderFavoriteCard)}
          </div>
        )}
      </div>

      <style jsx>{`
        .fav-header { border-left: 3px solid var(--mba-accent); padding-left: var(--space-4);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }
        .fav-list-container {
          min-height: 300px;
        }
        .fav-empty-state {
          text-align: center;
          padding: var(--space-8) var(--space-4);
          border: 1px dashed var(--mba-rule);
          border-radius: var(--radius-md);
          background: var(--mba-surface-sunk);
        }
        .fav-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        .fav-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          transition: all 150ms ease;
        }
        .fav-card:hover {
          border-color: var(--mba-ink-soft);
          box-shadow: var(--shadow-sm);
        }
        .fav-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-4);
          border-bottom: 1px solid var(--mba-rule);
          padding-bottom: var(--space-2);
        }
        .fav-meta {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--mba-ink-faint);
        }
        .fav-page-label {
          font-weight: 600;
          color: var(--mba-accent);
          font-size: 10px;
        }
        .dot-divider {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--mba-ink-faint);
        }
        .fav-date {
          font-size: 10px;
        }
        .fav-link-icon, .fav-bookmark-icon {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--mba-ink-faint);
          padding: var(--space-1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: color 150ms ease;
        }
        .fav-link-icon:hover {
          color: var(--mba-ink);
        }
        .fav-bookmark-icon:hover {
          color: var(--mba-danger);
        }
      `}</style>
    </div>
  )
}
