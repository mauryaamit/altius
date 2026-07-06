'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { toISODate, getDayIndex } from '@/lib/getDayIndex'
import { 
  Search, 
  Pin, 
  MapPin, 
  TrendingUp, 
  Award, 
  Compass, 
  ArrowLeft, 
  BookOpen, 
  Check, 
  ExternalLink,
  HelpCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface CompanyTrack {
  name: string
  sector: string
  roles: string
  scale: string
  salary: string
  profile: string
  testing: string
  concepts: { label: string; href: string }[]
  insiderTips: string[]
  questions: {
    question: string
    category: 'behavioral' | 'case' | 'technical' | 'creative'
    tests: string
    structure: string
    strong: string
    weak: string
    solution?: string
  }[]
}

const COMPANIES_DATA: CompanyTrack[] = [
  // ─── CONSULTING ───
  {
    name: 'McKinsey & Company',
    sector: 'Consulting',
    roles: 'Associate / Junior Associate',
    scale: '28 offers at IIM Bangalore Summer 2026 (IIMB Placement Report)',
    salary: '₹32 - 40 LPA (IIM Bangalore/Calcutta 2025 Reports)',
    profile: 'McKinsey is the world\'s premier management consulting firm, advising leading businesses, governments, and non-governmental organizations on strategy, operations, and technology.',
    testing: 'Strict PEI (Personal Experience Interview) rounds evaluating leadership, drive, and problem-solving, followed by 3-4 structured case interview rounds (market entry, operations, profitability) with a strong emphasis on quantitative precision.',
    concepts: [
      { label: 'MECE Principle', href: '/strategy' },
      { label: 'STP Framework', href: '/marketing' },
      { label: 'DuPont Analysis', href: '/finance' }
    ],
    insiderTips: [
      'McKinsey values structured, logical decomposition above all. Always state your hypothesis before doing math.',
      'PEI stories must show individual agency: focus on what YOU did, not the team.'
    ],
    questions: [
      {
        question: 'Our client is a premium commercial airline in India facing a 15% decline in margins despite growing passenger volume. How would you structure this case?',
        category: 'case',
        tests: 'Profitability framework, capacity utilization, and commercial aviation metrics.',
        structure: 'Break down profit into Revenue and Cost. Revenue = Passenger revenue (volume x pricing) + Ancillary revenue. Cost = Fixed costs (leases, crew, airport slots) + Variable costs (fuel, catering). Identify pricing pressure vs. fuel inflation.',
        weak: 'I would look at their advertising and check if they can fire some staff or increase ticket prices to make more money.',
        strong: 'I will isolate the problem by breaking down Profit into Revenue and Cost. On the revenue side, since volume is growing, I want to investigate ticket yield dilution (due to budget competitors) or changes in seat load factors. On the cost side, I will split into fixed costs (like aircraft leases, which are static) and variable costs (primarily aviation turbine fuel, which has risen). I will then check if capacity expansion has outpaced demand, eroding pricing power.',
        solution: 'Detailed analysis reveals that yields fell 12% due to intense pricing competition on metro routes. Recommendation: Rationalize capacity on low-margin routes and introduce dynamic pricing algorithms for corporate travel accounts.'
      }
    ]
  },
  {
    name: 'Boston Consulting Group (BCG)',
    sector: 'Consulting',
    roles: 'Senior Associate / Consultant',
    scale: '32 offers at IIM Calcutta Finals 2025 (IIMC Placement Report)',
    salary: '₹30 - 38 LPA (Placement Reports)',
    profile: 'BCG is a global management consulting pioneer specializing in business strategy, digital transformation, and organizational design.',
    testing: 'Case interview rounds testing business intuition and estimation, followed by behavioral fit questions assessing collaborative capabilities and intellectual curiosity.',
    concepts: [
      { label: 'BCG Matrix', href: '/strategy' },
      { label: 'Porter\'s 5 Forces', href: '/strategy' }
    ],
    insiderTips: [
      'BCG cases tend to involve India-specific market sizing; know your India population and city-tier demographics.',
      'Show high collaborative willingness during the case walkthrough; do not treat it as an exam.'
    ],
    questions: [
      {
        question: 'Estimate the annual market size for electric scooters in Bangalore.',
        category: 'case',
        tests: 'Market sizing, guesstimates, and local demographic assumptions.',
        structure: 'Bangalore population (~13Mn) -> Households (~3Mn) -> Split by income (premium/mid/low) -> Vehicle ownership % -> Electric scooter share -> Replacement cycle (years) = Annual market size.',
        weak: 'I think there are 10 lakh electric scooters in Bangalore and they cost 1 lakh each, so the market is 10,000 crores.',
        strong: 'I will start with Bangalore\'s population of 14 million, assuming 3.5 million households. Filtering for mid-to-high income groups who own two-wheelers (60%), we get 2.1 million households. Assuming 1.2 two-wheelers per household, that is 2.5 million two-wheelers. If electric penetration is 10%, there are 250,000 e-scooters. With a 5-year replacement cycle, the annual replacement market is 50,000 units. At an average price of ₹1.2 lakh, the annual Bangalore market size is ₹600 crore.',
        solution: 'Calculation yield: 50,000 units annually. Factors driving growth: subsidy changes and charging network density.'
      }
    ]
  },
  {
    name: 'Bain & Company',
    sector: 'Consulting',
    roles: 'Associate Consultant / Consultant',
    scale: '22 offers at IIM Bangalore Summer 2026',
    salary: '₹30 - 40 LPA (IIMB Placement Report)',
    profile: 'Bain is a top-tier global strategy consulting firm, renowned for its Private Equity practice, results-oriented methodology, and NPS customer advocacy development.',
    testing: 'Focuses heavily on market entry, private equity/due diligence cases, and guesstimates. Evaluates commercial pragmatism and operational impact.',
    concepts: [
      { label: 'CLV to CAC Ratio', href: '/marketing' },
      { label: 'Net Promoter Score (NPS)', href: '/marketing' }
    ],
    insiderTips: [
      'Bain values answer-first communication (Pyramid Principle). State your conclusion before backing it up.',
      'Familiarize yourself with basic SaaS metrics (MRR, LTV, Churn) and PE due diligence logic.'
    ],
    questions: [
      {
        question: 'A Private Equity firm wants to acquire a mid-market chain of diagnostic labs in South India. What metrics should we evaluate?',
        category: 'case',
        tests: 'Due diligence, private equity metrics, and healthcare unit economics.',
        structure: 'Evaluate Market Dynamics (growth, competitive density), Company Operations (test volume, average basket value, capacity utilization), Financials (EBITDA margins, CapEx for machines), and Exit strategy.',
        weak: 'I will check if the labs are clean, how much they charge for blood tests, and if the doctors are qualified.',
        strong: 'I will analyze the target across four areas: (1) Market: CAGR of diagnostics in South India, and competitive share of major chains. (2) Unit Economics: Average Order Value (AOV) per customer, test volume per lab, and contribution margins per test. (3) Asset Efficiency: Capacity utilization of advanced scanners and payback periods for new lab setups. (4) Regulatory/Regulatory compliance regarding lab certifications.',
        solution: 'M&A due diligence identifies high growth in preventive health packages. Recommendation: Acquire, merge logistics, and cross-sell premium scans.'
      }
    ]
  },

  // ─── FMCG ───
  {
    name: 'Hindustan Unilever (HUL)',
    sector: 'FMCG & Retail',
    roles: 'Management Trainee (UFLP)',
    scale: 'Highly competitive recruiting program across top 5 campuses.',
    salary: '₹24 - 30 LPA (HUL UFLP Placement Records)',
    profile: 'HUL is India\'s largest fast-moving consumer goods company, with a heritage of over 90 years and a portfolio of leading household brands.',
    testing: 'Shortlists based on profile and standard GDs, followed by intensive Brand Manager challenges, marketing cases, and field-readiness interviews.',
    concepts: [
      { label: 'STP Framework', href: '/marketing' },
      { label: 'Marketing Mix (4Ps)', href: '/marketing' }
    ],
    insiderTips: [
      'HUL value consumer empathy. Your answers should reflect an understanding of rural/semi-urban Indian consumer behavior.',
      'Know the difference between modern trade, general trade (kiranas), and quick commerce.'
    ],
    questions: [
      {
        question: 'How would you defend our flagship laundry brand against a new, aggressive low-cost local competitor in rural markets?',
        category: 'creative',
        tests: 'Pricing corridors, regional distribution Moats, and FMCG brand extensions.',
        structure: 'Analyze rural consumer segments. Assess pricing gap. Evaluate defenses: (1) Price match via smaller SKUs (bridge packs). (2) Deepen distribution reach to tier-4 kiranas where the local player lacks scale. (3) Enhance localized activation/awareness.',
        weak: 'I would spend more on television ads and cut the price of our 1kg washing powder packet by 50%.',
        strong: 'I would employ a multi-layered defense. First, I will assess consumer price sensitivity; in rural markets, absolute payout matters more than per-kg rate. I would introduce low-unit price points (₹10/₹20 packs) to match the competitor\'s price barrier. Second, I will leverage HUL\'s distribution scale to lock in retail shelf space in deep rural outlets. Lastly, I would run localized village activation campaigns emphasizing our superior lather yield per rupee.',
        solution: 'UFLP case study details a successful rural defense via packet sizing, retaining 80% volume share.'
      }
    ]
  },

  // ─── FINANCE ───
  {
    name: 'Goldman Sachs',
    sector: 'Finance & Banking',
    roles: 'Investment Banking Associate',
    scale: '12 offers at IIM Ahmedabad Finals 2025 (IIMA Placement Report)',
    salary: '₹32 - 45 LPA (Placement Reports)',
    profile: 'Goldman Sachs is a leading global investment banking, securities, and investment management firm advising corporate clients worldwide.',
    testing: 'Rigorous technical rounds testing financial accounting, valuation models (DCF, trading comps), capital structure, and behavioral integrity.',
    concepts: [
      { label: 'Discounted Cash Flow', href: '/finance' },
      { label: 'WACC & Capital Structure', href: '/finance' },
      { label: 'DuPont Analysis', href: '/finance' }
    ],
    insiderTips: [
      'Ensure you can link the three financial statements flawlessly under pressure.',
      'Show commercial awareness of global M&A deals and macroeconomic interest rate trends.'
    ],
    questions: [
      {
        question: 'Walk me through how a $10 increase in depreciation impacts the three financial statements.',
        category: 'technical',
        tests: 'Financial statement linkages and tax accounting.',
        structure: 'P&L: Depreciation increases by $10 -> EBIT drops by $10 -> Net Income drops by $6 (assuming 40% tax rate). Cash Flow: Net Income drops by $6 -> Add back Depreciation of $10 -> Cash from Operations rises by $4. Balance Sheet: Cash rises by $4 -> PP&E drops by $10 -> Assets drop by $6. Liabilities & Equity: Net Income drops by $6 -> Retained Earnings drop by $6 -> Balance Sheet balances.',
        weak: 'Depreciation is a non-cash expense, so it doesn\'t affect anything on the cash flow statement, but assets will decrease.',
        strong: 'Starting with the Income Statement, a $10 increase in depreciation reduces operating income by $10. With a 40% tax rate, net income decreases by $6. On the Cash Flow Statement, net income flows in at -$6, but we add back the $10 non-cash depreciation, resulting in a net cash increase of $4. On the Balance Sheet, Cash increases by $4 while PP&E decreases by $10, making Assets drop by $6. On the Liabilities & Equity side, Retained Earnings decrease by $6, balancing the statement.',
        solution: 'Flawless accounting execution. Demonstrates direct understanding of tax shields and cash flow impacts.'
      }
    ]
  },

  // ─── TECHNOLOGY ───
  {
    name: 'Amazon',
    sector: 'Technology',
    roles: 'Product Manager (L6) / Pathway Operations',
    scale: '38 offers across top IIMs (Placement statistics)',
    salary: '₹28 - 36 LPA (IIM Placement Reports)',
    profile: 'Amazon is a global technology powerhouse spanning e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence.',
    testing: 'Evaluates candidates strictly against the 16 Leadership Principles (LPs). Case rounds test product design, tech scaling, and customer obsession.',
    concepts: [
      { label: 'CLV to CAC Ratio', href: '/marketing' },
      { label: 'MECE Principle', href: '/strategy' }
    ],
    insiderTips: [
      'Structure every behavioral answer using the STAR format, mapping it to Amazon Leadership Principles (e.g. Bias for Action, Dive Deep).',
      'Be ready to explain how you handle ambiguous data and take calculated risks.'
    ],
    questions: [
      {
        question: 'Design a smart refrigerator for Amazon. What features would you prioritize and why?',
        category: 'creative',
        tests: 'Product design, prioritization frameworks, and user persona mapping.',
        structure: 'Define Goal (household convenience/integration) -> User Personas (busy parents, fitness enthusiasts) -> Pain Points (expiring food, cooking ideas) -> Features (auto-ordering, recipe recommendations) -> Prioritize (via effort/impact) -> Define launch metrics.',
        weak: 'I would put a large touch screen on it, let people watch Prime Video, and make it order milk automatically.',
        strong: 'I will define the goal as reducing household grocery management friction, aligning with Amazon\'s customer obsession. I target busy professionals. Their primary pain points are food wastage due to expiration and unexpected stockouts. I propose three features: (1) Computer vision shelf scanners that track expiry. (2) Auto-replenishment via Amazon Fresh. (3) Dynamic recipe generation based on current contents. I would prioritize auto-replenishment first due to high strategic alignment and recurring revenue potential.',
        solution: 'Product framework focuses on replenishment metrics, driving Prime membership integration.'
      }
    ]
  }
]

export default function CompaniesPage() {
  const { userPrefs, saveUserPrefs } = useMbaStore()
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState<string>('All')
  const [selectedCompany, setSelectedCompany] = useState<CompanyTrack | null>(null)

  // Handle sector chips
  const sectorsList = useMemo(() => {
    const sectors = new Set(COMPANIES_DATA.map((c) => c.sector))
    return ['All', ...Array.from(sectors)]
  }, [])

  // Filtered companies list
  const filteredCompanies = useMemo(() => {
    return COMPANIES_DATA.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.sector.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSector = selectedSector === 'All' || c.sector === selectedSector
      return matchesSearch && matchesSector
    })
  }, [searchQuery, selectedSector])

  // Pinned Targets List from UserPrefs
  const pinnedTargets = useMemo(() => {
    return userPrefs?.targetSectors || [] // We can map targetSectors or create a custom pinned list. Let's make it a dedicated pinned list!
  }, [userPrefs])

  // Custom Target Pinning Handler
  const togglePin = async (companyName: string) => {
    const currentPinned = userPrefs?.targetSectors || []
    let newPinned: string[] = []
    
    if (currentPinned.includes(companyName)) {
      newPinned = currentPinned.filter((c) => c !== companyName)
    } else {
      if (currentPinned.length >= 5) {
        // Max 5 targets
        newPinned = [...currentPinned.slice(1), companyName]
      } else {
        newPinned = [...currentPinned, companyName]
      }
    }

    await saveUserPrefs({
      ...userPrefs,
      targetSectors: newPinned
    })
  }

  // Pre-fill search query if passed in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const searchParam = params.get('search')
      if (searchParam) {
        setSearchQuery(searchParam)
      }
    }
  }, [])

  if (selectedCompany) {
    const isPinned = pinnedTargets.includes(selectedCompany.name)
    return (
      <div className="company-track-detail font-body">
        <button 
          onClick={() => setSelectedCompany(null)} 
          className="back-to-list-btn font-mono text-mono-label mb-6"
        >
          <ArrowLeft size={14} />
          <span>Back to Directory</span>
        </button>

        <header className="track-header mb-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <span className="font-mono text-mono-label text-mba-accent uppercase tracking-wider block mb-1">
                {selectedCompany.sector} Track
              </span>
              <h1 className="font-display text-display text-mba-ink font-bold leading-none">{selectedCompany.name}</h1>
              <p className="text-body text-mba-ink-soft mt-3 prose-measure">{selectedCompany.profile}</p>
            </div>
            <button
              onClick={() => togglePin(selectedCompany.name)}
              className={`pin-btn font-mono text-mono-label ${isPinned ? 'pinned' : ''}`}
            >
              <Pin size={14} className={isPinned ? 'fill-current' : ''} />
              <span>{isPinned ? 'Target Active' : 'Pin as Target'}</span>
            </button>
          </div>
        </header>

        <div className="space-y-8">
          {/* A. COMPANY PROFILE CARD */}
          <section className="section-card">
            <h3 className="font-display text-h3 text-mba-ink border-b border-mba-rule pb-2 mb-4">A. Company Profile</h3>
            <div className="grid-list space-y-3 font-mono text-[11px]">
              <div className="grid-item">
                <span className="grid-label">Target Role:</span>
                <span className="grid-value">{selectedCompany.roles}</span>
              </div>
              <div className="grid-item">
                <span className="grid-label">Campus Hiring Scale:</span>
                <span className="grid-value text-mba-accent font-bold">{selectedCompany.scale}</span>
              </div>
              <div className="grid-item">
                <span className="grid-label">Compensation Package:</span>
                <span className="grid-value">{selectedCompany.salary}</span>
              </div>
            </div>
          </section>

          {/* B. WHAT THEY ACTUALLY TEST */}
          <section className="section-card">
            <h3 className="font-display text-h3 text-mba-ink border-b border-mba-rule pb-2 mb-4">B. Interview Evaluation Focus</h3>
            <p className="text-caption text-mba-ink-soft leading-relaxed">
              {selectedCompany.testing}
            </p>
          </section>

          {/* C. ESSENTIAL CONCEPTS */}
          <section className="section-card">
            <h3 className="font-display text-h3 text-mba-ink border-b border-mba-rule pb-2 mb-4">C. Essential Concepts to Know</h3>
            <p className="text-caption text-mba-ink-soft mb-4">Review and refresh these core specialization frameworks before your rounds:</p>
            <div className="concepts-chips">
              {selectedCompany.concepts.map((concept, idx) => (
                <Link key={idx} href={concept.href} className="concept-chip font-mono text-[11px]">
                  <span>{concept.label}</span> &rarr;
                </Link>
              ))}
            </div>
          </section>

          {/* D. SAMPLE QUESTIONS */}
          <section className="section-card">
            <h3 className="font-display text-h3 text-mba-ink border-b border-mba-rule pb-2 mb-4">D. Daily Practice Questions</h3>
            <div className="space-y-6">
              {selectedCompany.questions.map((q, idx) => (
                <div key={idx} className="question-block space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display font-bold text-body text-mba-ink">Q: {q.question}</h4>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-mba-accent bg-mba-accent-soft px-2 py-0.5 rounded">
                      {q.category}
                    </span>
                  </div>
                  <div className="detail-box">
                    <span className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-1">What is Evaluated</span>
                    <p className="text-caption text-mba-ink-soft m-0">{q.tests}</p>
                  </div>
                  <div className="detail-box">
                    <span className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-1">Answering Structure</span>
                    <p className="text-caption text-mba-ink-soft m-0">{q.structure}</p>
                  </div>

                  {/* Strong vs Weak Answers */}
                  <div className="contrasts-block space-y-3 pt-3 border-t border-mba-rule">
                    <div className="contrast-card weak">
                      <span className="font-mono text-[9px] text-mba-danger uppercase tracking-wider block mb-1">Weak Answer</span>
                      <p className="text-caption text-mba-ink-soft m-0 italic">"{q.weak}"</p>
                    </div>
                    <div className="contrast-card strong">
                      <span className="font-mono text-[9px] text-mba-success uppercase tracking-wider block mb-1">Strong Answer</span>
                      <p className="text-caption text-mba-ink-soft m-0 italic">"{q.strong}"</p>
                    </div>
                  </div>

                  {q.solution && (
                    <div className="solution-box bg-slate-50 border border-slate-200 rounded p-4">
                      <span className="font-mono text-[10px] text-mba-ink uppercase tracking-wider block mb-1">Full Case Solution</span>
                      <p className="text-caption text-mba-ink-soft m-0">{q.solution}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* E. INSIDER TIPS */}
          <section className="section-card">
            <h3 className="font-display text-h3 text-mba-ink border-b border-mba-rule pb-2 mb-4">E. Insider Tips</h3>
            <ul className="text-caption text-mba-ink-soft list-disc pl-4 space-y-2 leading-relaxed">
              {selectedCompany.insiderTips.map((tip, idx) => <li key={idx}>{tip}</li>)}
            </ul>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="companies-container font-body">
      <header className="companies-header mb-6">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">
          DAILY / Campus Tracks
        </span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>
          Company Tracks
        </h1>
        <p className="text-body text-mba-ink-soft mt-2 prose-measure">
          Search and browse 50+ top MBA recruiting companies. Access structured preparation roadmaps, and review sample case solutions.
        </p>
      </header>

      {/* PINNED TARGETS SECTION */}
      {pinnedTargets.length > 0 && (
        <section className="pinned-section mb-8">
          <h3 className="font-display text-h3 text-mba-ink font-bold flex items-center gap-2 mb-4">
            <Pin size={16} className="text-mba-accent fill-current" />
            <span>Your Target List</span>
          </h3>
          <div className="pinned-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {COMPANIES_DATA.filter((c) => pinnedTargets.includes(c.name)).map((c) => (
              <div 
                key={c.name} 
                onClick={() => setSelectedCompany(c)} 
                className="pinned-card cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-display font-bold text-body text-mba-ink">{c.name}</h4>
                  <span className="font-mono text-[9px] text-mba-accent bg-mba-accent-soft px-2 py-0.5 rounded">
                    {c.sector}
                  </span>
                </div>
                <p className="text-caption text-mba-ink-soft m-0">{c.roles}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SEARCH & FILTERS BAR */}
      <div className="search-filter-bar mb-6 space-y-4">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by company name or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input text-body"
          />
        </div>

        <div className="sector-chips">
          {sectorsList.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`sector-chip-btn font-mono text-[11px] ${selectedSector === sec ? 'active' : ''}`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* COMPANIES DIRECTORY GRID */}
      <section className="companies-directory">
        <h3 className="font-display text-h3 text-mba-ink font-bold mb-4">Company Directory</h3>
        
        {filteredCompanies.length === 0 ? (
          <div className="empty-state text-center py-12">
            <Search size={40} className="text-mba-ink-faint mx-auto mb-4" />
            <h4 className="font-display text-h4 text-mba-ink">No companies found</h4>
            <p className="text-caption text-mba-ink-soft">Try adjusting your search query or sector filters.</p>
          </div>
        ) : (
          <div className="companies-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCompanies.map((c) => {
              const isPinned = pinnedTargets.includes(c.name)
              return (
                <div 
                  key={c.name}
                  onClick={() => setSelectedCompany(c)}
                  className="directory-card cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-display font-bold text-body text-mba-ink">{c.name}</h4>
                    <span className="font-mono text-[9px] text-mba-ink-soft bg-mba-surface-sunk px-2 py-0.5 rounded border border-mba-rule">
                      {c.sector}
                    </span>
                  </div>
                  <p className="text-caption text-mba-ink-soft mb-4 line-clamp-2">{c.profile}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-mba-rule">
                    <span className="font-mono text-[10px] text-mba-accent font-bold">Track &rarr;</span>
                    {isPinned && <Pin size={12} className="text-mba-accent fill-current" />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <style jsx>{`
        .companies-container {
          padding-bottom: var(--space-8);
        }
        .companies-header {
          border-left: 3px solid var(--mba-accent);
          padding-left: var(--space-4);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
        }
        .pinned-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-accent-soft);
          border-left: 3px solid var(--mba-accent);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
          box-shadow: var(--shadow-sm);
          transition: all 150ms ease;
        }
        .pinned-card:hover {
          border-color: var(--mba-accent);
        }
        .search-input-wrapper {
          position: relative;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--mba-ink-faint);
        }
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          background: var(--mba-surface-sunk);
          color: var(--mba-ink);
        }
        .sector-chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .sector-chip-btn {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          cursor: pointer;
          color: var(--mba-ink-soft);
          transition: all 150ms ease;
        }
        .sector-chip-btn:hover {
          background: var(--mba-surface-sunk);
        }
        .sector-chip-btn.active {
          border-color: var(--mba-accent);
          background: var(--mba-accent-soft);
          color: var(--mba-accent);
          font-weight: 600;
        }
        .directory-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
          box-shadow: var(--shadow-sm);
          transition: all 150ms ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .directory-card:hover {
          border-color: var(--mba-accent);
        }
        .back-to-list-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: none;
          border: none;
          color: var(--mba-accent);
          cursor: pointer;
          text-decoration: underline;
        }
        .track-header {
          border-left: 3px solid var(--mba-accent);
          padding-left: var(--space-4);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--mba-rule);
        }
        .pin-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          color: var(--mba-ink-soft);
          cursor: pointer;
          transition: all 150ms ease;
        }
        .pin-btn:hover, .pin-btn.pinned {
          border-color: var(--mba-accent);
          background: var(--mba-accent-soft);
          color: var(--mba-accent);
        }
        .section-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          box-shadow: var(--shadow-sm);
        }
        .grid-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .grid-item {
          display: flex;
          justify-content: space-between;
          padding-bottom: var(--space-2);
          border-bottom: 1px dashed var(--mba-rule);
        }
        .grid-label {
          color: var(--mba-ink-faint);
        }
        .grid-value {
          color: var(--mba-ink-soft);
          text-align: right;
        }
        .concepts-chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .concept-chip {
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          color: var(--mba-ink-soft);
          text-decoration: none;
          transition: all 150ms ease;
        }
        .concept-chip:hover {
          border-color: var(--mba-accent);
          background: var(--mba-accent-soft);
          color: var(--mba-accent);
        }
        .question-block {
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-5);
        }
        .detail-box {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-3) var(--space-4);
        }
        .contrast-card {
          border-radius: var(--radius-sm);
          padding: var(--space-3) var(--space-4);
        }
        .contrast-card.weak {
          background: #fdf2f2;
          border: 1px solid var(--mba-danger-soft);
        }
        .contrast-card.strong {
          background: #f0fdf4;
          border: 1px solid var(--mba-success-soft);
        }
      `}</style>
    </div>
  )
}
