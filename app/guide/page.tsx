'use client'
import React, { useState } from 'react'
import Link from 'next/link'

// ─── Data ────────────────────────────────────────────────────────────────────

const DAILY_PAGES = [
  {
    name: 'Marketing',
    href: '/marketing',
    chipColor: 'var(--chip-marketing)',
    role: 'Understand how brands compete, consumers behave, and markets move.',
    subsections: [
      { label: 'Concepts', desc: 'Permanent frameworks: STP, 4Ps, CLV, Brand Equity, Blue Ocean and 14+ more. Your reference shelf for any marketing interview.' },
      { label: 'Case', desc: 'One real company dilemma daily. Read the background, think through it, then compare your approach to the model solution.' },
      { label: 'Hot Topic', desc: 'One live marketing development. Root cause, stakeholders, implications, and 3 future scenarios with cited data.' },
      { label: 'Company', desc: 'One company profile daily: what they do, key metrics with dates, the marketing angle, and why it matters for GD/interview.' },
      { label: 'Think', desc: 'One abstract marketing question. Work through it before reading the model answer and alternate perspectives.' },
      { label: 'Library', desc: 'Your uploaded reference PDFs for marketing.' },
    ],
    bestUsed: 'Reviewing before a marketing-focused interview or SIP process for FMCG/D2C companies.',
  },
  {
    name: 'Finance',
    href: '/finance',
    chipColor: 'var(--chip-finance)',
    role: 'Build fluency in valuation, capital markets, and financial analysis.',
    subsections: [
      { label: 'Concepts', desc: 'DCF, WACC, LBO, M&A synergies, ratio analysis and 14+ core frameworks. The foundation every finance interviewer tests.' },
      { label: 'Case', desc: 'One finance case daily: a real valuation, deal, or crisis with data exhibits and a model solution across 4 lenses.' },
      { label: 'Hot Topic', desc: 'One live financial development — RBI policy, market move, or corporate action — with real numbers and sector impact.' },
      { label: 'Company', desc: 'One company\'s financial profile: capital structure, margins, key ratios, a notable recent transaction, cited and dated.' },
      { label: 'Think', desc: 'One financial reasoning question, model answer, and contrarian perspective.' },
      { label: 'Library', desc: 'Your finance PDFs.' },
    ],
    bestUsed: 'Preparing for Goldman Sachs, JP Morgan, Avendus, Citi, or any BFSI recruiter; or understanding the financial angle before any case.',
  },
  {
    name: 'Consulting',
    href: '/consulting',
    chipColor: 'var(--chip-consulting)',
    role: 'Learn to structure ambiguous problems the way McKinsey, BCG, and Bain interviewers expect.',
    subsections: [
      { label: 'Concepts', desc: 'MECE principle, issue trees, profitability framework, market entry, Porter\'s Five Forces and 9+ more. Critically — when each framework fails and what to use instead.' },
      { label: 'Case', desc: 'One consulting-style case daily: background, data, dilemma, 4-lens breakdown, common mistakes, and what top 1% teams do differently.' },
      { label: 'Hot Topic', desc: 'One current strategic challenge facing an industry or company.' },
      { label: 'Company', desc: 'One consulting firm or their key client\'s strategic situation.' },
      { label: 'Think', desc: 'One "how would a consultant approach this" question.' },
      { label: 'Library', desc: 'Your consulting PDFs and case prep materials.' },
    ],
    bestUsed: 'Daily in the 4-6 weeks before SIP or final placement consulting interviews. Pair with the Companies page BCG/McKinsey/Bain tracks.',
  },
  {
    name: 'Operations',
    href: '/operations',
    chipColor: 'var(--chip-operations)',
    role: 'Understand supply chains, process design, and operational efficiency — the backbone of every business case.',
    subsections: [
      { label: 'Concepts', desc: 'Lean, Six Sigma, Theory of Constraints, supply chain design, Little\'s Law and 12+ more.' },
      { label: 'Case', desc: 'One operations-focused case: a supply chain failure, automation decision, or capacity challenge.' },
      { label: 'Hot Topic', desc: 'A live operations/logistics/manufacturing development.' },
      { label: 'Company', desc: 'One company\'s operational model, what makes it distinctive, and its biggest operational risk.' },
      { label: 'Think', desc: 'An operations reasoning question.' },
      { label: 'Library', desc: 'Your operations PDFs.' },
    ],
    bestUsed: 'Preparing for conglomerate, manufacturing, e-commerce, or logistics roles — TAS, Amazon, Flipkart, Tata Steel, etc.',
  },
  {
    name: 'Strategy',
    href: '/strategy',
    chipColor: 'var(--chip-strategy)',
    role: 'Think about businesses at the highest level — competitive dynamics, platform models, and long-term positioning.',
    subsections: [
      { label: 'Concepts', desc: 'Ansoff Matrix, BCG Matrix, Porter\'s Generic Strategies, Blue Ocean, platform vs pipeline models and 11+ more.' },
      { label: 'Case', desc: 'A strategic dilemma facing a real company — market entry, M&A, disruption response, or pivot decision.' },
      { label: 'Hot Topic', desc: 'A live strategic development with business implications and future scenarios.' },
      { label: 'Company', desc: 'One company\'s competitive position and strategic moat.' },
      { label: 'Opportunity', desc: 'A daily founder-thinking problem: a real-world gap, root cause, and 3 solution approaches. Trains the "see opportunity in chaos" instinct.' },
      { label: 'Think', desc: 'A strategy reasoning question.' },
      { label: 'Library', desc: 'Your strategy PDFs.' },
    ],
    bestUsed: 'Preparing for Accenture Strategy, BCG, McKinsey, or general management roles; great for WAT practice too.',
  },
  {
    name: 'HR & OB',
    href: '/people',
    chipColor: 'var(--chip-people)',
    role: 'Build depth in organizational behavior, leadership, and people management — essential for XLRI, HR roles, and any leadership question.',
    subsections: [
      { label: 'Concepts', desc: 'Situational Leadership, Maslow/Herzberg, Tuckman stages, Psychological Safety, BATNA/ZOPA, DEI as business strategy and 10+ more.' },
      { label: 'Case', desc: 'One HR/OB case: a performance management dilemma, culture change challenge, or leadership failure.' },
      { label: 'Hot Topic', desc: 'A live people/org/talent development.' },
      { label: 'Company', desc: 'One company\'s notable culture, HR practice, or people strategy.' },
      { label: 'Think', desc: 'An OB/leadership reasoning question.' },
      { label: 'Library', desc: 'Your HR & OB PDFs.' },
    ],
    bestUsed: 'Preparing for XLRI interviews, HR roles, or any "tell me about leadership" personal interview question at any company.',
  },
  {
    name: 'Guesstimate',
    href: '/guesstimate',
    chipColor: 'var(--chip-strategy)',
    role: 'Build the market-sizing instinct that every consulting, product, and FMCG interview tests.',
    subsections: [
      { label: 'Estimate', desc: '3 fresh problems daily — ranging from easy to hard, across sectors. Each solved with top-down AND bottom-up methods, cross-checked, with assumption tables.' },
      { label: 'Interpret', desc: 'One data table or chart: read it, find the insight, then see the model answer. Trains the "given numbers, what do they mean?" skill.' },
      { label: 'Reference Data', desc: 'A permanent shelf of demographic, economic, and sector data for use as guesstimate assumptions: India population by state, GDP, EV penetration, metro city sizes, and more.' },
    ],
    bestUsed: '15 minutes every morning, or intensively in the week before any consulting or FMCG interview.',
  },
  {
    name: 'GD Arena',
    href: '/gd',
    chipColor: 'var(--chip-consulting)',
    role: 'Prepare for Group Discussion rounds with real arguments, real data, and a practiced closing structure.',
    subsections: [
      { label: 'Topics', desc: 'Filter by Current Affairs / Business / Abstract / Tech & Society / Ethics / Industry / Ethical Dilemma. Each topic includes context, For arguments (with cited data), Against arguments, and a Way Forward synthesis. Opening line suggestions included.' },
    ],
    bestUsed: 'Practice speaking each topic aloud — GD performance is about fluency and structure under time pressure, not just knowing the points.',
  },
  {
    name: 'Digest',
    href: '/digest',
    chipColor: 'var(--chip-marketing)',
    role: 'Stay current on business and economic developments through an MBA-focused lens — not general news.',
    subsections: [
      { label: 'Stories', desc: 'Filter by Markets / Policy / Corporate / Trade / Tech. Each story: What happened → Key numbers (cited and dated) → Why it matters for business → Sector impact → One forward-looking line.' },
    ],
    bestUsed: '10 minutes every morning before checking any other news. The filter chips let you focus only on sectors relevant to your target role.',
  },
  {
    name: 'Newspaper',
    href: '/newspaper',
    chipColor: 'var(--chip-operations)',
    role: 'The full Mint e-paper and curated business news in one place.',
    subsections: [
      { label: "Today's Brief", desc: '4-6 curated MBA-relevant stories with context and business angle, refreshed daily.' },
      { label: 'Business News', desc: 'In-depth business stories with full context, not headline-only cards.' },
      { label: 'Daily Mint', desc: 'Direct link to the full Livemint e-paper for today.' },
    ],
    bestUsed: 'Reading Today\'s Brief replaces general news-reading for MBA-relevant current awareness. The full e-paper is for deeper dives.',
  },
  {
    name: 'Insights',
    href: '/insights',
    chipColor: 'var(--chip-finance)',
    role: 'One cognitive bias, economic effect, or mental model per day — explained with real examples and an MBA application.',
    subsections: [
      { label: 'Daily Insight', desc: 'Hook (one sentence) → Plain (analogy-driven explanation) → Go Deeper (collapsed, 400-600 words of depth). One RecallCheck question.' },
    ],
    bestUsed: 'Read slowly, once per day. The Go Deeper section is worth expanding for any concept that connects to your target sector.',
  },
]

const REFERENCE_PAGES = [
  {
    name: 'English',
    href: '/english',
    role: 'Strengthen the written and spoken English that matters in interviews, GDs, and WAT.',
    subsections: [
      { label: 'Vocabulary', desc: '3-5 new words daily with roots, examples, and a recall test.' },
      { label: 'Grammar', desc: 'One rule per day following a structured curriculum. Error drills included.' },
      { label: 'Reading', desc: 'One passage (250-400 words) with inference questions.' },
      { label: 'Write Better', desc: 'Daily WAT prompt + SPELT framework + model essay + 5-8 professional phrases.' },
    ],
    bestUsed: '20 minutes every morning. English compounds — small daily exposure beats cramming.',
  },
  {
    name: 'Interview',
    href: '/interview',
    role: 'Prepare for every format of the MBA placement interview.',
    subsections: [
      { label: 'PI Bank', desc: 'Personal Interview question bank in 7 categories: background, Why MBA, why sector, achievements/failures, leadership, ethics, current affairs. Each with what the interviewer actually probes for.' },
      { label: 'WAT / AWT', desc: 'Written Ability Test practice with timer, SPELT guide, and model essays.' },
      { label: 'SIP Prep', desc: 'Summer internship specific prep: timeline, case formats, PPO conversion tips.' },
      { label: 'Resume', desc: 'CV structure guidance, strong vs weak bullet contrasts, quantification rules.' },
    ],
    bestUsed: 'Daily from 6-8 weeks before placement season. The PI Bank is worth reading fully at least once, then revisiting targeted questions the week before interviews.',
  },
  {
    name: 'India Facts',
    href: '/india-facts',
    role: 'A permanent, sourced reference for every India statistic you might use in a GD, guesstimate, or interview.',
    subsections: [
      { label: 'Macro', desc: 'GDP, growth, fiscal deficit, inflation — every key number with source and date.' },
      { label: 'Demographics', desc: 'Population, sex ratio, age structure, urban-rural split.' },
      { label: 'Global Standing', desc: "India's ranks across 15+ indices: Ease of Doing Business, HDI, Global Innovation Index, and more." },
    ],
    bestUsed: 'Reviewing before any GD or guesstimate. Bookmark the stats you want to remember.',
  },
  {
    name: 'Library',
    href: '/library',
    role: 'Your personal PDF shelf — organized by subject.',
    subsections: [
      { label: 'Upload', desc: 'Upload your own compendiums, case packs, and reference materials.' },
      { label: 'Filter', desc: 'Filter by Marketing / Finance / Consulting / Operations / Strategy / HR & OB / Newspaper & Current Affairs / Guesstimate & Cases / General Reference.' },
    ],
    bestUsed: 'Centralizing all the PDFs you accumulate during MBA — beats hunting through WhatsApp groups.',
  },
  {
    name: 'Companies',
    href: '/companies',
    role: 'Company-specific preparation tracks for 50+ top MBA recruiters.',
    subsections: [
      { label: 'Tracks', desc: "Each company: what they actually test, interview format, essential concepts to know, daily sample questions in their style, insider tips. Organized by sector." },
      { label: 'Pin', desc: 'Pin up to 5 target companies for quick access.' },
    ],
    bestUsed: 'Once you know which companies you\'re targeting, deep-dive into those specific tracks 2-3 weeks before their interview day.',
  },
  {
    name: 'Roles',
    href: '/roles',
    role: 'Figure out which role suits you — and what it takes to get it.',
    subsections: [
      { label: 'Matcher', desc: '3 questions → 2-3 suggested roles. Or browse all 8 MBA roles directly.' },
      { label: 'Role Pages', desc: 'What you actually do, what the interview tests, who hires for it, salary range (sourced and dated), and a realistic day-in-the-life narrative.' },
    ],
    bestUsed: 'Year 1, before SIP season, when you\'re still exploring which function to target.',
  },
]

const YOU_PAGES = [
  { name: 'Notes', href: '/notes', desc: 'Inline annotations attached to specific content. Browse all your notes, filter by page, search by text.' },
  { name: 'Journal', href: '/journal', desc: 'Your daily freeform reflection space. Date-keyed, with rotating prompts. The best MBA students treat reflection as a skill, not an afterthought.' },
  { name: 'Favorites', href: '/favorites', desc: 'Content you\'ve bookmarked or hearted. Organize into collections. This is your curated prep library — build it over the semester.' },
  { name: 'Progress', href: '/progress', desc: 'Your RecallCheck results aggregated: concepts due for review, your streak, weak spots to revisit. Spaced repetition surfaces what you marked "Shaky" or "No" at the right interval.' },
  { name: 'Settings', href: '/settings', desc: 'Text size (Compact / Default / Large), account details, data storage info.' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      <p className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest" style={{ marginBottom: 'var(--space-2)' }}>
        {label}
      </p>
      <div style={{ height: 1, background: 'var(--mba-rule)' }} />
    </div>
  )
}

function DailyPageCard({ page }: { page: typeof DAILY_PAGES[0] }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="guide-card" role="article">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: page.chipColor, flexShrink: 0, display: 'inline-block' }} aria-hidden="true" />
        <h3 className="font-display text-mba-ink" style={{ fontSize: 18, fontWeight: 600 }}>
          <Link href={page.href} style={{ color: 'var(--mba-accent)', textDecoration: 'none' }}>{page.name}</Link>
        </h3>
      </div>
      <p className="font-body text-body text-mba-ink-soft" style={{ marginBottom: 'var(--space-3)' }}>{page.role}</p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="font-mono text-mono-label"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mba-accent)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', padding: 0, marginBottom: expanded ? 'var(--space-3)' : 0 }}
        aria-expanded={expanded}
      >
        {expanded ? '▲ Collapse' : '▼ Show subsections'}
      </button>

      {expanded && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-3) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {page.subsections.map((sub) => (
            <li key={sub.label} style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <span className="font-body text-mba-ink" style={{ fontWeight: 600, minWidth: 90, flexShrink: 0, fontSize: 13 }}>{sub.label}</span>
              <span className="font-body text-mba-ink-soft" style={{ fontSize: 13 }}>{sub.desc}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="font-body text-mba-ink-soft" style={{ fontSize: 13, fontStyle: 'italic', borderTop: '1px solid var(--mba-rule)', paddingTop: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
        <strong style={{ fontStyle: 'normal', color: 'var(--mba-ink-faint)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Best used when: </strong>
        {page.bestUsed}
      </p>
    </div>
  )
}

function RefPageCard({ page }: { page: typeof REFERENCE_PAGES[0] }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="guide-card" role="article">
      <h3 className="font-display text-mba-ink" style={{ fontSize: 18, fontWeight: 600, marginBottom: 'var(--space-2)' }}>
        <Link href={page.href} style={{ color: 'var(--mba-accent)', textDecoration: 'none' }}>{page.name}</Link>
      </h3>
      <p className="font-body text-body text-mba-ink-soft" style={{ marginBottom: 'var(--space-3)' }}>{page.role}</p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="font-mono text-mono-label"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mba-accent)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', padding: 0, marginBottom: expanded ? 'var(--space-3)' : 0 }}
        aria-expanded={expanded}
      >
        {expanded ? '▲ Collapse' : '▼ Show subsections'}
      </button>

      {expanded && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-3) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {page.subsections.map((sub) => (
            <li key={sub.label} style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <span className="font-body text-mba-ink" style={{ fontWeight: 600, minWidth: 90, flexShrink: 0, fontSize: 13 }}>{sub.label}</span>
              <span className="font-body text-mba-ink-soft" style={{ fontSize: 13 }}>{sub.desc}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="font-body text-mba-ink-soft" style={{ fontSize: 13, fontStyle: 'italic', borderTop: '1px solid var(--mba-rule)', paddingTop: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
        <strong style={{ fontStyle: 'normal', color: 'var(--mba-ink-faint)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Best used when: </strong>
        {page.bestUsed}
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GuidePage() {
  return (
    <div className="guide-root">
      {/* Page Header */}
      <header className="guide-header">
        <p className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest" style={{ marginBottom: 'var(--space-2)' }}>
          Guide · How Altius Works
        </p>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: 1.15, marginBottom: 'var(--space-4)' }}>
          Your MBA placement prep, organized.
        </h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure">
          Altius is built around one idea: that daily, structured exposure to quality business content — cases, frameworks, company knowledge, and current affairs — compounds into interview-ready competence. Here's what each section does and how to get the most from it.
        </p>
        <div style={{ height: 1, background: 'var(--mba-rule)', marginTop: 'var(--space-6)' }} />
      </header>

      {/* Section A: DAILY */}
      <section aria-label="Daily pages" style={{ marginBottom: 'var(--space-10)' }}>
        <SectionEyebrow label="A — Daily · content that refreshes every day" />
        <p className="font-body text-body text-mba-ink-soft" style={{ marginBottom: 'var(--space-6)' }}>
          Every page in this group gives you something new each morning. Use the Yesterday / Tomorrow navigation to revisit any past day.
        </p>
        <div className="guide-grid">
          {DAILY_PAGES.map((page) => (
            <DailyPageCard key={page.name} page={page} />
          ))}
        </div>
      </section>

      {/* Section B: REFERENCE */}
      <section aria-label="Reference pages" style={{ marginBottom: 'var(--space-10)' }}>
        <SectionEyebrow label="B — Reference · content that stays" />
        <p className="font-body text-body text-mba-ink-soft" style={{ marginBottom: 'var(--space-6)' }}>
          These pages don't change daily. Return to them whenever you need a framework, a fact, or a practice drill.
        </p>
        <div className="guide-grid">
          {REFERENCE_PAGES.map((page) => (
            <RefPageCard key={page.name} page={page} />
          ))}
        </div>
      </section>

      {/* Section C: YOU */}
      <section aria-label="Personal pages" style={{ marginBottom: 'var(--space-10)' }}>
        <SectionEyebrow label="C — You · your personal space" />
        <p className="font-body text-body text-mba-ink-soft" style={{ marginBottom: 'var(--space-6)' }}>
          These pages are private to you — your thinking, your progress, your saved content.
        </p>
        <div className="guide-grid">
          {YOU_PAGES.map((page) => (
            <div key={page.name} className="guide-card">
              <h3 className="font-display text-mba-ink" style={{ fontSize: 18, fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                <Link href={page.href} style={{ color: 'var(--mba-accent)', textDecoration: 'none' }}>{page.name}</Link>
              </h3>
              <p className="font-body text-body text-mba-ink-soft">{page.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section D: 15 minutes */}
      <section aria-label="Daily ritual" style={{ marginBottom: 'var(--space-10)' }}>
        <SectionEyebrow label="D — How to use Altius in 15 minutes a day" />
        <div className="guide-ritual-block">
          <div style={{ width: 3, background: 'var(--mba-accent)', borderRadius: 2, flexShrink: 0, alignSelf: 'stretch' }} />
          <div style={{ flex: 1 }}>
            <div className="ritual-item">
              <p className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest" style={{ marginBottom: 'var(--space-1)' }}>Morning (10 min)</p>
              <p className="font-body text-body text-mba-ink-soft">
                Open <Link href="/digest" style={{ color: 'var(--mba-accent)', textDecoration: 'none' }}>Digest</Link> → read 2-3 stories. Open <Link href="/insights" style={{ color: 'var(--mba-accent)', textDecoration: 'none' }}>Insights</Link> → read today's concept, expand Go Deeper if it connects to your target role.
              </p>
            </div>
            <div className="ritual-item">
              <p className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest" style={{ marginBottom: 'var(--space-1)' }}>Focused Study (30-45 min, 3-4× per week)</p>
              <p className="font-body text-body text-mba-ink-soft">
                Pick ONE specialization page. Read the Case fully. Attempt the Think question before reading the model answer. Review 2-3 Concepts from that page.
              </p>
            </div>
            <div className="ritual-item">
              <p className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest" style={{ marginBottom: 'var(--space-1)' }}>Interview Week</p>
              <p className="font-body text-body text-mba-ink-soft">
                Shift to <Link href="/companies" style={{ color: 'var(--mba-accent)', textDecoration: 'none' }}>Companies</Link>. Deep-dive your target company tracks. Run through 5 <Link href="/interview" style={{ color: 'var(--mba-accent)', textDecoration: 'none' }}>PI Bank</Link> questions aloud. Practice one <Link href="/guesstimate" style={{ color: 'var(--mba-accent)', textDecoration: 'none' }}>Guesstimate</Link> problem end-to-end before looking at the solution.
              </p>
            </div>
            <div className="ritual-item" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <p className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest" style={{ marginBottom: 'var(--space-1)' }}>Before a GD Round</p>
              <p className="font-body text-body text-mba-ink-soft">
                Open <Link href="/gd" style={{ color: 'var(--mba-accent)', textDecoration: 'none' }}>GD Arena</Link>, find a topic in the relevant category, read For AND Against, practice the opening line aloud, then write a 30-word closing synthesis without looking at the Way Forward section.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .guide-root {
          padding-bottom: var(--space-10);
        }
        .guide-header {
          padding-bottom: var(--space-8);
          margin-bottom: var(--space-8);
        }
        .guide-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .guide-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: box-shadow 150ms ease;
        }
        .guide-card:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        }
        .guide-ritual-block {
          background: var(--mba-surface-sunk);
          border-radius: var(--radius-md);
          display: flex;
          gap: var(--space-5);
          padding: var(--space-5);
        }
        .ritual-item {
          padding-bottom: var(--space-4);
          border-bottom: 1px dashed var(--mba-rule);
          margin-bottom: var(--space-4);
        }
        @media (min-width: 640px) {
          .guide-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: var(--space-4);
          }
        }
      `}</style>
    </div>
  )
}
