import React from 'react'
import type { Specialization } from '@/lib/content/types'
import { marketingLibrary } from '@/lib/content/marketing'
import { financeLibrary } from '@/lib/content/finance'
import { consultingLibrary } from '@/lib/content/consulting'
import { operationsLibrary } from '@/lib/content/operations'
import { strategyLibrary } from '@/lib/content/strategy'
import { peopleLibrary } from '@/lib/content/people'
import { BookOpen, ExternalLink } from 'lucide-react'

const libraryMap: Record<Specialization, typeof marketingLibrary> = {
  marketing:  marketingLibrary,
  finance:    financeLibrary,
  consulting: consultingLibrary,
  operations: operationsLibrary,
  strategy:   strategyLibrary,
  people:     peopleLibrary,
}

export function LibraryTab({ specialization }: { specialization: Specialization }) {
  const books = libraryMap[specialization] || []

  return (
    <section aria-label="Library">
      <p className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-6">
        {books.length} essential reads
      </p>

      <div className="library-list">
        {books.map((book) => (
          <article key={book.id} className="library-item">
            <div className="library-item-header">
              <BookOpen size={16} className="library-icon" aria-hidden="true" />
              <div>
                <h3 className="font-body text-h3 text-mba-ink" style={{fontWeight: 600}}>
                  {book.title}
                  {book.url && (
                    <a href={book.url} target="_blank" rel="noopener noreferrer" className="library-link">
                      <ExternalLink size={12} />
                    </a>
                  )}
                </h3>
                <p className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mt-1">
                  {book.author} &middot; {book.year}
                  {book.pages && <span> &middot; {book.pages}p</span>}
                </p>
              </div>
            </div>
            <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
              {book.description}
            </p>
            <div className="library-tags">
              {book.tags.map((tag) => (
                <span key={tag} className="library-tag font-mono text-mono-label">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .library-list { display: flex; flex-direction: column; gap: 0; }
        .library-item {
          padding: var(--space-5) 0;
          border-bottom: 1px solid var(--mba-rule);
        }
        .library-item:last-child { border-bottom: none; }
        .library-item-header { display: flex; align-items: flex-start; gap: var(--space-3); }
        .library-icon { color: var(--mba-ink-faint); flex-shrink: 0; margin-top: 3px; }
        .library-link {
          display: inline-flex;
          align-items: center;
          margin-left: var(--space-2);
          color: var(--mba-accent);
          text-decoration: none;
        }
        .library-tags { display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap; }
        .library-tag {
          font-size: var(--text-mono-label);
          color: var(--mba-ink-faint);
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: 2px 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
      `}</style>
    </section>
  )
}
