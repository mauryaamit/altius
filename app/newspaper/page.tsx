'use client'
import React, { useState, useMemo } from 'react'
import { TabBar } from '@/components/TabBar'
import { Calendar, Bookmark, Heart } from 'lucide-react'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { DateNav } from '@/components/DateNav'
import { toISODate } from '@/lib/getDayIndex'
import { getNewspaperBriefForDate, getBusinessNewsForDate } from '@/lib/content/getDynamicContent'
import { Citation } from '@/components/Citation'

const TABS = [
  { id: 'today', label: "Today's Brief" },
  { id: 'business', label: 'Business News' },
  { id: 'mint', label: 'Daily Mint' },
]

export default function NewspaperPage() {
  const [activeTab, setActiveTab] = useState('today')
  const { activeDate, toggleFavorite, isFavorite } = useMbaStore()
  const currentDate = activeDate ? new Date(activeDate) : new Date()
  const dateStr = toISODate(currentDate)

  const [mounted, setMounted] = useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Get daily briefs dynamically (3 per day)
  const briefs = useMemo(() => {
    return getNewspaperBriefForDate(currentDate)
  }, [currentDate])

  // Get business news cards dynamically (2 per day)
  const businessNews = useMemo(() => {
    return getBusinessNewsForDate(currentDate)
  }, [currentDate])

  if (!mounted) {
    return (
      <div className="font-body text-caption text-mba-ink-faint p-8">
        Loading Newspaper room...
      </div>
    )
  }

  return (
    <div className="newspaper-page-root">
      <header className="news-header">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">Current Affairs</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>Newspaper</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          Daily indexing, analysis, and synthesis of high-value business news and macroeconomics.
        </p>
      </header>

      {activeTab !== 'mint' && <DateNav />}

      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div style={{ paddingTop: 'var(--space-6)' }}>
        {activeTab === 'today' && (
          <div className="stories-stack">
            {briefs.map((story) => {
              const ledgerId = `newspaper_newspaperBrief_${story.id}_${dateStr}`
              const isHeart = isFavorite(ledgerId, 'heart')
              const isBookmark = isFavorite(ledgerId, 'bookmark')

              return (
                <article key={story.id} className="story-card">
                  <div className="story-meta font-mono text-mono-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span className="story-outlet">{story.outlet}</span>
                      <span className="dot-divider" />
                      <span className="story-date flex items-center">
                        <Calendar size={10} className="mr-1" /> {story.date}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <button
                        onClick={() => toggleFavorite(ledgerId, 'newspaper', 'newspaperBrief', 'heart')}
                        className="fav-toggle-btn"
                        aria-label={isHeart ? 'Remove from favorites' : 'Add to favorites'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isHeart ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                      >
                        <Heart size={15} fill={isHeart ? 'var(--mba-accent)' : 'none'} />
                      </button>
                      <button
                        onClick={() => toggleFavorite(ledgerId, 'newspaper', 'newspaperBrief', 'bookmark')}
                        className="fav-toggle-btn"
                        aria-label={isBookmark ? 'Remove from bookmarks' : 'Add to bookmarks'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmark ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                      >
                        <Bookmark size={15} fill={isBookmark ? 'var(--mba-accent)' : 'none'} />
                      </button>
                    </div>
                  </div>

                  <h3 className="story-headline font-display text-h3 text-mba-ink">
                    {story.headline}
                  </h3>

                  <div className="story-takeaway-block">
                    <span className="font-mono text-mono-label text-mba-ink-soft uppercase tracking-wider block mb-2">Key Takeaway</span>
                    <p className="font-body text-body text-mba-ink-soft">
                      {story.takeaway}
                    </p>
                  </div>

                  <div className="story-footer">
                    <a
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="story-link font-mono text-mono-label"
                    >
                      Original Article
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {activeTab === 'business' && (
          <div className="stories-stack">
            {businessNews.map((card) => {
              const ledgerId = `newspaper_businessNews_${card.id}_${dateStr}`
              const isHeart = isFavorite(ledgerId, 'heart')
              const isBookmark = isFavorite(ledgerId, 'bookmark')

              return (
                <article key={card.id} className="story-card">
                  <div className="story-meta font-mono text-mono-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="story-outlet">Business Pulse</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <button
                        onClick={() => toggleFavorite(ledgerId, 'newspaper', 'businessNews', 'heart')}
                        className="fav-toggle-btn"
                        aria-label={isHeart ? 'Remove from favorites' : 'Add to favorites'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isHeart ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                      >
                        <Heart size={15} fill={isHeart ? 'var(--mba-accent)' : 'none'} />
                      </button>
                      <button
                        onClick={() => toggleFavorite(ledgerId, 'newspaper', 'businessNews', 'bookmark')}
                        className="fav-toggle-btn"
                        aria-label={isBookmark ? 'Remove from bookmarks' : 'Add to bookmarks'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmark ? 'var(--mba-accent)' : 'var(--mba-ink-faint)', display: 'flex', alignItems: 'center' }}
                      >
                        <Bookmark size={15} fill={isBookmark ? 'var(--mba-accent)' : 'none'} />
                      </button>
                    </div>
                  </div>

                  <h3 className="story-headline font-display text-h3 text-mba-ink">
                    {card.headline}
                  </h3>

                  <div className="fact-box mb-4 p-3 bg-mba-surface-sunk border-l-2 border-mba-accent rounded-sm">
                    <span className="font-mono text-mono-label text-mba-accent uppercase tracking-wider block mb-1">Key Fact</span>
                    <div className="font-body text-body text-mba-ink" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span>{card.fact}</span>
                      <Citation data={{ id: 1, source: card.citation.source, date: card.citation.date }} />
                    </div>
                  </div>

                  <div className="story-takeaway-block">
                    <span className="font-mono text-mono-label text-mba-ink-soft uppercase tracking-wider block mb-2">MBA Context & Impact</span>
                    <p className="font-body text-body text-mba-ink-soft">
                      {card.context}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {activeTab === 'mint' && (
          <div className="daily-mint-container font-body text-center p-8 bg-mba-surface-sunk border border-mba-rule rounded-md">
            <span className="font-mono text-mono-label text-mba-accent uppercase tracking-widest block mb-2">Today's Newspaper</span>
            <h3 className="font-display text-h3 text-mba-ink font-bold mb-3">Read the full Livemint e-paper</h3>
            <p className="font-body text-body text-mba-ink-soft mb-6 max-w-md mx-auto">
              Access the comprehensive daily edition of Mint directly in the browser to browse current business sections, corporate earnings releases, and editorial opinions.
            </p>
            <a
              href="https://epaper.livemint.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="read-btn font-mono text-mono-label text-center inline-block"
              style={{ textDecoration: 'none', padding: '10px 20px', background: 'var(--mba-accent)', color: 'var(--mba-surface)', borderRadius: 'var(--radius-sm)' }}
            >
              Open Livemint e-Paper
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        .news-header {
          border-left: 3px solid var(--mba-accent);
          padding-left: var(--space-4);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }

        .stories-stack {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .story-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-left: 3px solid var(--mba-accent);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          transition: border-color 150ms ease;
        }

        .story-card:hover {
          border-color: var(--mba-ink-faint);
        }

        .story-meta {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--mba-ink-faint);
          margin-bottom: var(--space-2);
        }

        .story-outlet {
          font-weight: 600;
          color: var(--mba-accent);
        }

        .dot-divider {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--mba-ink-faint);
        }

        .story-headline {
          font-weight: 600;
          line-height: 1.25;
          margin-bottom: var(--space-4);
        }

        .story-takeaway-block {
          background: var(--mba-surface-sunk);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
          margin-bottom: var(--space-4);
        }

        .story-footer {
          display: flex;
          justify-content: flex-start;
        }

        .story-link {
          color: var(--mba-accent);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: color 150ms ease;
        }

        .story-link:hover {
          color: var(--mba-ink);
        }

        .read-btn {
          border: none;
          background: var(--mba-accent);
          color: #ffffff;
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: opacity 150ms ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .read-btn:hover {
          opacity: 0.95;
        }

        .fav-toggle-btn {
          transition: transform 0.2s ease;
        }
        .fav-toggle-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}
