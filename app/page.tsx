'use client'
import React, { useEffect, useMemo } from 'react'
import { DayCard } from '@/components/DayCard'
import { OnboardingOverlay } from '@/components/OnboardingOverlay'
import { formatDisplayDate, toISODate } from '@/lib/getDayIndex'
import type { DayCardData } from '@/lib/content/types'
import { Flame } from 'lucide-react'

import { useMbaStore } from '@/lib/stores/mbaStore'
import { DateNav } from '@/components/DateNav'
import {
  getDynamicContentForDate,
  getGuesstimateProblemsForDate,
  getGDTopicForDate,
  getPulseStoryForDate,
  getBiteForDate,
  getEnglishContentForDate,
  getNewspaperBriefForDate
} from '@/lib/content/getDynamicContent'

export default function AltiusHomePage() {
  const { activeDate, streak, bumpStreak } = useMbaStore()
  const [mounted, setMounted] = React.useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Bump streak on client-side load
    bumpStreak()
  }, [bumpStreak])

  const today = new Date()
  const currentDate = activeDate ? new Date(activeDate) : today
  const isToday = !activeDate || toISODate(currentDate) === toISODate(today)
  const displayDate = formatDisplayDate(currentDate)

  // Compute dynamic day cards from ledger content
  const dynamicDayCards = useMemo<DayCardData[]>(() => {
    // A. Specializations
    const marketing = getDynamicContentForDate('case', 'marketing', currentDate) as any
    const finance = getDynamicContentForDate('case', 'finance', currentDate) as any
    const consulting = getDynamicContentForDate('case', 'consulting', currentDate) as any
    const strategy = getDynamicContentForDate('case', 'strategy', currentDate) as any
    const operations = getDynamicContentForDate('case', 'operations', currentDate) as any
    const people = getDynamicContentForDate('case', 'people', currentDate) as any

    // B. Newspaper
    const briefs = getNewspaperBriefForDate(currentDate)
    const topBrief = briefs[0]

    // C. English
    const english = getEnglishContentForDate(currentDate)

    // D. Guesstimate
    const guesstimates = getGuesstimateProblemsForDate(currentDate)
    const topGuesstimate = guesstimates[0]

    // E. GD Arena
    const gd = getGDTopicForDate('business', currentDate)

    // F. Pulse
    const pulse = getPulseStoryForDate('markets', currentDate)

    // G. Bites
    const bite = getBiteForDate(currentDate)

    return [
      {
        room: 'Marketing',
        slug: 'marketing',
        specialization: 'marketing',
        headline: marketing ? `${marketing.company}: ${marketing.sector}` : 'The CLV lens on D2C brand economics',
        teaser: marketing ? marketing.dilemma.slice(0, 120) + '...' : 'Why acquisition cost is meaningless without a lifetime value anchor.',
        hasNewContent: true,
      },
      {
        room: 'Finance',
        slug: 'finance',
        specialization: 'finance',
        headline: finance ? `${finance.company}: ${finance.sector}` : 'Paytm after PPBL: survival arithmetic',
        teaser: finance ? finance.dilemma.slice(0, 120) + '...' : 'Runway, burn rate, and the bank-partner migration calculus.',
        hasNewContent: true,
      },
      {
        room: 'Newspaper',
        slug: 'newspaper',
        headline: topBrief ? `${topBrief.outlet}: ${topBrief.headline}` : 'Mint: India\'s logistics cost drops to 7.8% of GDP',
        teaser: topBrief ? topBrief.takeaway.slice(0, 120) + '...' : 'What the new national logistics policy means for multi-modal corridor investments.',
        hasNewContent: true,
      },
      {
        room: 'Consulting',
        slug: 'consulting',
        specialization: 'consulting',
        headline: consulting ? `${consulting.company}: ${consulting.sector}` : 'IndiGo and the premium sub-brand trap',
        teaser: consulting ? consulting.dilemma.slice(0, 120) + '...' : 'When a low-cost carrier tries to speak two languages at once.',
        hasNewContent: true,
      },
      {
        room: 'Strategy',
        slug: 'strategy',
        specialization: 'strategy',
        headline: strategy ? `${strategy.company}: ${strategy.sector}` : 'Jio\'s portfolio: telecom utility or digital OS?',
        teaser: strategy ? strategy.dilemma.slice(0, 120) + '...' : 'BCG Matrix meets India\'s most consequential platform strategy.',
        hasNewContent: true,
      },
      {
        room: 'Operations',
        slug: 'operations',
        specialization: 'operations',
        headline: operations ? `${operations.company}: ${operations.sector}` : 'Cold chain white space: Rs. 92,000 crore lost annually',
        teaser: operations ? operations.dilemma.slice(0, 120) + '...' : 'Three entry strategies for India\'s most under-built infrastructure.',
        hasNewContent: true,
      },
      {
        room: 'People',
        slug: 'people',
        specialization: 'people',
        headline: people ? `${people.company}: ${people.sector}` : 'Psychological safety as a competitive moat',
        teaser: people ? people.dilemma.slice(0, 120) + '...' : 'Project Aristotle\'s finding: team norms predict outcomes, not talent.',
        hasNewContent: true,
      },
      {
        room: 'English',
        slug: 'english',
        headline: english ? `Vocab: ${english.vocabulary[0].word} | Grammar: ${english.grammar[0].rule}` : 'Word: Inimitable | Grammar: Dangling modifiers',
        teaser: english ? `Learn "${english.vocabulary[0].word}" and master ${english.grammar[0].rule} drills today.` : 'Today\'s vocabulary entry and the grammar rule most memos violate.',
        hasNewContent: true,
      },
      {
        room: 'Guesstimate',
        slug: 'guesstimate',
        headline: topGuesstimate ? topGuesstimate.question : 'How many ATMs are operational in India right now?',
        teaser: topGuesstimate ? `Approach: ${topGuesstimate.approach1.name}` : 'Two estimation approaches, a cross-check, and the actual number.',
        hasNewContent: true,
      },
      {
        room: 'GD Arena',
        slug: 'gd',
        headline: gd ? gd.topic : 'Are gig workers employees or entrepreneurs?',
        teaser: gd ? gd.framing.slice(0, 120) + '...' : 'For/Against framework with five data points per side.',
        hasNewContent: true,
      },
      {
        room: 'Interview Prep',
        slug: 'interview',
        headline: 'Ethics bank: the classic conflict-of-interest scenario',
        teaser: 'Four pointers and two pitfalls for the trickiest category.',
        hasNewContent: false,
      },
      {
        room: 'Pulse',
        slug: 'pulse',
        headline: pulse ? pulse.whatHappened.slice(0, 80) + '...' : 'RBI holds rates; real return turns positive',
        teaser: pulse ? pulse.whyItMatters.slice(0, 120) + '...' : 'What it means for credit growth, housing, and fixed income.',
        hasNewContent: true,
      },
      {
        room: 'India Facts',
        slug: 'india-facts',
        headline: 'Macro: GDP, WPI, CPI, and the fiscal deficit number that matters',
        teaser: 'Key economic indicators updated with latest RBI and MoSPI data.',
        hasNewContent: false,
      },

      {
        room: 'Bites',
        slug: 'bites',
        headline: bite ? bite.name : 'Survivorship Bias: why returning planes told the wrong story',
        teaser: bite ? bite.altitude.hook : 'Wald\'s WWII insight and what it means for startup postmortems.',
        hasNewContent: true,
      },
    ]
  }, [currentDate])

  if (!mounted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: 'var(--mba-ink-faint)', fontFamily: 'var(--font-body)' }}>
        Loading dashboard...
      </div>
    )
  }

  return (
    <>
      <OnboardingOverlay />
      <header className="home-header">
        <p className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-2">
          {displayDate}
        </p>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>
          {isToday ? "Today's Desk" : "Historical Desk"}
        </h1>
        {isToday && (
          <div className="streak-row">
            <Flame size={14} className="streak-icon" aria-hidden="true" />
            <span className="font-mono text-mono-label text-mba-ink-soft">
              {streak || 0} day streak
            </span>
          </div>
        )}
      </header>

      <DateNav />

      <section aria-label="Desk content" className="desk-stack">
        {dynamicDayCards.map((card, i) => (
          <DayCard key={card.slug} data={card} index={i} isLead={i === 0} />
        ))}
      </section>

      <style jsx>{`
        .home-header { border-left: 3px solid var(--mba-accent); padding-left: var(--space-4);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
          margin-bottom: var(--space-6);
        }

        .streak-row {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          margin-top: var(--space-3);
          padding: 4px 10px;
          background: var(--mba-surface-sunk);
          border-radius: var(--radius-sm);
          border: 1px solid var(--mba-rule);
        }

        .streak-icon {
          color: var(--mba-warning);
        }

        .desk-stack {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
      `}</style>
    </>
  )
}
