'use client'
import React, { useState } from 'react'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { Award, Compass, HelpCircle, Briefcase, DollarSign, Target, User, Layers } from 'lucide-react'
import Link from 'next/link'

interface RoleDetail {
  id: string
  title: string
  subtitle: string
  description: string
  progression: string
  testing: string
  employers: string[]
  backgroundFit: string
  salary: string
  dayInLife: string
}

const BACKGROUNDS = [
  { id: 'Engineering', label: 'Engineering' },
  { id: 'Commerce', label: 'Commerce / Finance' },
  { id: 'Science', label: 'Science' },
  { id: 'Arts', label: 'Arts' },
  { id: 'Other', label: 'Other' }
]

const ROLES_DATA: RoleDetail[] = [
  {
    id: 'consulting',
    title: 'Management Consultant',
    subtitle: 'Strategic Problem Solving & Corporate Advising',
    description: 'Help fortune 500 CEOs and executives solve their most complex organizational, operational, and financial dilemmas.',
    progression: 'Day 1: Building Excel models, running data analyses, and structuring slides. Month 6: Owning client workstreams and presenting findings. Year 3 (Associate/Manager): Leading small teams, managing client relationships, and designing strategic frameworks.',
    testing: 'Case interviews (profitability, market entry, M&A, pricing), guesstimates, group cases, and structured communication (pyramid principle).',
    employers: ['McKinsey', 'BCG', 'Bain', 'Accenture Strategy', 'Kearney', 'Deloitte', 'PwC', 'EY Parthenon', 'Strategy&', 'A&M', 'Oliver Wyman', 'L.E.K', 'KPMG', 'Simon-Kucher', 'NRI Consulting'],
    backgroundFit: 'Highly valued across all backgrounds (Engineering, Commerce, Arts). Strong analytical capabilities and GPA are the core criteria.',
    salary: '₹28 - 42 LPA (Base) + Performance Bonuses (IIM/ISB Placement Reports 2025/2026)',
    dayInLife: 'My alarm goes off at 6:30 AM in a hotel room in Mumbai. By 8:30 AM, I am at the client\'s office with my team, aligning on the agenda for the day. Morning is spent interviewing division heads to validate our operational hypothesis. At 1:00 PM, we have a working lunch reviewing our cash flow forecasts. Afternoon is a flurry of revisions on our board deck. At 6:00 PM, we present a progress update to the client sponsor. We head back to the hotel around 9:30 PM, where I spend another hour polishing slides before calling it a day.'
  },
  {
    id: 'brand-manager',
    title: 'Brand / Product Manager (FMCG)',
    subtitle: 'Consumer Marketing & Business Ownership',
    description: 'Act as the "CEO of the brand," owning the P&L, consumer insight, positioning, and supply chain coordination for high-turnover consumer goods.',
    progression: 'Day 1: Executing local promotions, tracking distributor sales, and managing agency briefs. Month 6: Launching packaging redesigns and local campaigns. Year 3 (Senior Brand Manager): Designing regional product launches, setting pricing strategy, and managing full P&L budgets.',
    testing: 'Brand manager challenges, marketing strategy case studies, group discussions (GDs), and consumer psychology/insight scenarios.',
    employers: ['HUL', 'P&G', 'ITC', 'Nestlé', 'Mondelez', 'P&G', 'Marico', 'Dabur', 'Godrej', 'Coca-Cola', 'Diageo', 'Pidilite', 'Asian Paints', 'Colgate'],
    backgroundFit: 'Commerce/Finance and Engineering are common. Strong empathy, cultural awareness, creative judgment, and structured logical thinking are critical.',
    salary: '₹22 - 32 LPA (IIM Bangalore/Calcutta Placement Reports 2025/2026)',
    dayInLife: 'At 9:00 AM, I review the weekly sales dashboard for our premium shampoo category. Sales are up in the South region but flat in the West. By 10:30 AM, I am in a call with our creative agency, reviewing copy drafts for our upcoming digital launch. Lunch is spent with the trade marketing lead discussing supermarket shelf placements. The afternoon involves coordinating with supply chain and manufacturing teams to ensure stock availability for the monsoon promo. I finish the day at 7:00 PM after approving final budgets for a national print campaign.'
  },
  {
    id: 'investment-banker',
    title: 'Investment Banker',
    subtitle: 'Mergers & Acquisitions and Corporate Finance',
    description: 'Advise corporations on major transactions, raise equity or debt capital, and execute valuations, mergers, buyouts, and IPOs.',
    progression: 'Day 1: Drafting pitchbooks, gathering historical financial data, and building comparable company models. Month 6: Creating full-scale M&A dynamic models. Year 3 (Associate/VP): Client advisory, negotiating deal structures, and running transaction execution streams.',
    testing: 'Technical corporate finance questions, DCF valuation, accounting drills (linking the 3 statements), debt structures, and deal walkthroughs.',
    employers: ['Goldman Sachs', 'JP Morgan', 'HSBC', 'Avendus Capital', 'Kotak IB', 'Axis Capital', 'IIFL', 'Citi', 'Barclays', 'American Express'],
    backgroundFit: 'Strong preference for Commerce/Finance undergraduates, CA, CFA charterholders, or engineers with demonstrated numerical expertise.',
    salary: '₹26 - 45 LPA (Base) + Significant Deal Bonuses (IIM Ahmedabad/Bangalore Placement Reports 2025/2026)',
    dayInLife: 'I arrive at the desk at 8:30 AM. My morning starts by checking capital market updates and syndicating current valuation multiples. By 10:00 AM, my associate and I are building a detailed financial model for a tech buyout. We spend 3 hours stress-testing assumptions and running WACC sensitivity. At 3:00 PM, we join a client call to discuss a sell-side pitchbook layout. Dinner is ordered to the office at 8:00 PM. We spend the evening reviewing the legal terms and transaction deck. I head home in a cab at 11:30 PM, ensuring the slides are ready for the morning pitch.'
  },
  {
    id: 'gen-man',
    title: 'General Management (TAS / ABG)',
    subtitle: 'Cross-functional Leadership & Conglomerate Tracks',
    description: 'Grow into corporate business heads through fast-track rotational programs across diverse sectors (steel, telecom, retail, chemicals).',
    progression: 'Day 1 (Rotational Associate): Working in rural sales, factory operations, or corporate strategy. Month 12: Executing project delivery in a different business unit. Year 3: Assuming a permanent administrative or operational role managing a business line.',
    testing: 'Group tasks, ethical leadership case interviews, behavioral scenarios, and value-based assessments.',
    employers: ['TAS (Tata Administrative Services)', 'Aditya Birla Group', 'Mahindra Group', 'Reliance', 'Vedanta', 'Adani', 'RPG Group'],
    backgroundFit: 'Open to all backgrounds. Valued traits include resilience, generalist aptitude, project management, and relationship building.',
    salary: '₹24 - 32 LPA (IIM Placement Reports 2025/2026)',
    dayInLife: 'Currently, I am on my rural marketing rotation in Uttar Pradesh. At 8:00 AM, I head out with our local distributor to visit three retail outlets in a semi-urban tier-3 town. We observe stock replenishment cycles and interview store owners about consumer credit. At 1:00 PM, we have tea with a local dealer, resolving supply chain delays. In the afternoon, I sit in my hotel lobby analyzing distributor margins on my laptop. At 6:00 PM, I present my recommendations for rural channel penetration to the circle manager via Teams.'
  },
  {
    id: 'prod-manager',
    title: 'Product Manager (Technology)',
    subtitle: 'Software Lifecycle & User Experience',
    description: 'Define the "what" and the "why" of technology products, acting as the interface between software engineers, UI/UX designers, and business goals.',
    progression: 'Day 1: Writing PRDs (Product Requirement Documents), drafting user stories, and analyzing usage metrics. Month 6: Launching features and running A/B tests. Year 3 (Group PM): Owning product lines, setting long-term roadmaps, and managing release cycles.',
    testing: 'Product design cases, product metrics questions, technical scaling/API concepts, behavioral STAR stories, and prioritization frameworks (RICE).',
    employers: ['Amazon', 'Microsoft', 'Google', 'Uber', 'Salesforce', 'Media.net', 'BrowserStack', 'Cisco'],
    backgroundFit: 'Strong engineering/CS background is highly preferred due to technical communication requirements with developer teams.',
    salary: '₹25 - 38 LPA (IIM/ISB Placement Reports 2025/2026)',
    dayInLife: 'I start the day at 9:30 AM with a daily standup with our engineering team, unblocking a minor API integration issue. By 10:30 AM, I am analyzing user drop-off data in Mixpanel to understand why checkout conversions fell 2%. At noon, I collaborate with a designer on Figma to refine wireframes for the new cart page. Afternoon is dedicated to writing a detailed PRD for our Q3 recommendation algorithm. I sync with the business operations director at 4:30 PM to align on launch metrics, then review dev sprint progress before logging off at 6:30 PM.'
  },
  {
    id: 'analytics',
    title: 'Business Analyst / Analytics',
    subtitle: 'Data Modeling & Business intelligence',
    description: 'Translate raw enterprise data into strategic insights, building predictive models and dashboards that guide C-suite decision-making.',
    progression: 'Day 1: Writing SQL queries, designing Tableau dashboards, and data cleaning. Month 6: Designing predictive regression models. Year 3: Leading analytics teams, setting data strategy, and defining metrics structures.',
    testing: 'SQL test cases, probability/statistics questions, analytics case studies, and Python/R logical challenges.',
    employers: ['Amazon', 'Capgemini', 'TCS', 'Infosys', 'Deloitte', 'PwC'],
    backgroundFit: 'Engineering, Mathematics, or Commerce with analytics certification. Strong technical comfort with database queries and models.',
    salary: '₹18 - 28 LPA (IIM Placement Reports 2025/2026)',
    dayInLife: 'At 9:00 AM, I pull log data from our AWS Redshift warehouse to audit user subscription cycles. The morning is spent writing SQL joins to clean and segment the cohorts. At 1:30 PM, I join our marketing analytics sync to present a customer churn probability model. The afternoon is spent building a custom dashboard in PowerBI for our operations heads. I finish the day at 6:00 PM after running a quick validation test on our data pipeline to ensure accuracy.'
  },
  {
    id: 'sales-development',
    title: 'Sales & Business Development',
    subtitle: 'Revenue Generation & B2B Partnerships',
    description: 'Drive top-line revenue growth by winning corporate accounts, setting distributor networks, or expanding partnership horizons.',
    progression: 'Day 1: Cold calling, drafting client proposals, and tracking CRM leads. Month 6: Negotiating contract margins. Year 3 (National Account Manager): Owning enterprise accounts, managing regional quotas, and designing GTM strategies.',
    testing: 'Roleplays, case studies on sales channels, negotiation drills, and client relationship management scenarios.',
    employers: ['Amazon', 'TCS', 'Capgemini', 'BrowserStack', 'Salesforce'],
    backgroundFit: 'Open to all backgrounds. Demands high persuasion, resilience, emotional intelligence, and analytical channel logic.',
    salary: '₹20 - 30 LPA (Base) + Incentive Commissions (IIM Placement Reports 2025/2026)',
    dayInLife: 'At 9:00 AM, I check my Salesforce leads pipeline and log follow-ups. By 10:30 AM, I am in a pitch meeting with the CTO of a manufacturing firm, demonstrating how our enterprise software optimizes operations. Lunch is spent drafting custom pricing proposals. At 3:00 PM, I coordinate with our technical solution engineers to customize a demo portal. At 5:00 PM, I negotiate contract parameters with a procurement director, closing a ₹50 lakh annual contract. I celebrate the win with the team before leaving at 6:30 PM.'
  },
  {
    id: 'hr-leader',
    title: 'Human Resources (XLRI Centric)',
    subtitle: 'Talent Strategy & Organizational Design',
    description: 'Manage human capital, design incentive systems, lead industrial relations, and structure performance frameworks for large enterprises.',
    progression: 'Day 1: Administering payroll/benefits, managing campus recruitment schedules, and running onboarding. Month 6: Formulating employee engagement programs. Year 3: Designing appraisal frameworks and managing trade union negotiations.',
    testing: 'Case studies on labor relations, ethics tests, psychometric evaluations, and cultural fit interviews.',
    employers: ['TAS', 'HUL', 'P&G', 'Aditya Birla Group', 'Mahindra Group', 'ITC'],
    backgroundFit: 'Strong focus on specialized HR degrees (XLRI PMIR, SCMHRD, TISS). Excellent empathy, communication, and legal/labor knowledge.',
    salary: '₹22 - 32 LPA (XLRI/IIM Placement Reports 2025/2026)',
    dayInLife: 'My morning starts at 8:30 AM by reviewing current recruiting statistics across our regional offices. By 10:00 AM, I lead a meeting to draft an updated performance appraisal policy for our logistics division. At noon, I sync with our legal advisor on a labor compliance query in our Pune factory. Afternoon is spent structuring compensation benefits for our incoming management trainees. At 4:30 PM, I conduct an exit interview with a senior director, documenting critical feedback. I finish at 6:00 PM after planning an employee engagement workshop.'
  }
]

export default function RoleExplorerPage() {
  const userPrefs = useMbaStore((state) => state.userPrefs)

  // Quick Matcher State
  const [backgroundSelected, setBackgroundSelected] = useState<string>(userPrefs?.background || '')
  const [interest, setInterest] = useState<string>('')
  const [goal, setGoal] = useState<string>('')
  
  const [matchedRoles, setMatchedRoles] = useState<RoleDetail[]>([])
  const [hasMatched, setHasMatched] = useState(false)

  const handleMatch = () => {
    if (!backgroundSelected || !interest || !goal) return

    let recommendedIds: string[] = []

    // Quick Matcher Lookup Logic
    if (interest === 'ambiguous' && goal === 'partner') {
      recommendedIds = ['consulting']
    } else if (interest === 'brands' && goal === 'leader') {
      recommendedIds = ['brand-manager']
    } else if (interest === 'numbers' && goal === 'partner') {
      recommendedIds = ['investment-banker']
    } else if (interest === 'numbers' && goal === 'leader') {
      recommendedIds = ['analytics', 'prod-manager']
    } else if (interest === 'people' && goal === 'leader') {
      recommendedIds = ['gen-man', 'hr-leader']
    } else if (interest === 'products' && (goal === 'entrepreneur' || goal === 'leader')) {
      recommendedIds = ['prod-manager']
    } else if (interest === 'people' && (goal === 'entrepreneur' || goal === 'open')) {
      recommendedIds = ['sales-development', 'gen-man']
    } else {
      // General fallbacks based on background
      if (backgroundSelected === 'Engineering') {
        recommendedIds = ['prod-manager', 'consulting']
      } else if (backgroundSelected === 'Commerce') {
        recommendedIds = ['investment-banker', 'brand-manager']
      } else {
        recommendedIds = ['consulting', 'gen-man']
      }
    }

    const matches = ROLES_DATA.filter((r) => recommendedIds.includes(r.id))
    setMatchedRoles(matches.length > 0 ? matches : [ROLES_DATA[0], ROLES_DATA[3]])
    setHasMatched(true)
  }

  const handleResetMatcher = () => {
    setInterest('')
    setGoal('')
    setMatchedRoles([])
    setHasMatched(false)
  }

  return (
    <div className="roles-container font-body">
      <header className="roles-header mb-6">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">
          DAILY / Career Fit
        </span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>
          Role Explorer
        </h1>
        <p className="text-body text-mba-ink-soft mt-2 prose-measure">
          Understand undergraduate alignment, day-in-the-life realities, and placement statistics to map your target MBA function.
        </p>
      </header>

      {/* QUICK MATCHER WIDGET */}
      <section className="matcher-section mb-10">
        <div className="matcher-card">
          <div className="matcher-top">
            <Compass size={22} className="text-mba-accent" />
            <h3 className="font-display text-h3 text-mba-ink">Quick Sector Matcher</h3>
          </div>
          <p className="text-caption text-mba-ink-soft mb-5">
            Select your background and preferences to filter down which fields fit your goals best. (Quick filter, not a prediction).
          </p>

          {!hasMatched ? (
            <div className="matcher-questions space-y-5">
              <div>
                <label className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-2">
                  1. What did you do before your MBA?
                </label>
                <div className="chips-row">
                  {BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setBackgroundSelected(bg.id)}
                      className={`option-chip font-mono text-[11px] ${backgroundSelected === bg.id ? 'active' : ''}`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-2">
                  2. What business activity energizes you most?
                </label>
                <div className="chips-row">
                  <button
                    onClick={() => setInterest('ambiguous')}
                    className={`option-chip font-mono text-[11px] ${interest === 'ambiguous' ? 'active' : ''}`}
                  >
                    Solving ambiguous problems
                  </button>
                  <button
                    onClick={() => setInterest('brands')}
                    className={`option-chip font-mono text-[11px] ${interest === 'brands' ? 'active' : ''}`}
                  >
                    Building brands
                  </button>
                  <button
                    onClick={() => setInterest('numbers')}
                    className={`option-chip font-mono text-[11px] ${interest === 'numbers' ? 'active' : ''}`}
                  >
                    Working with numbers
                  </button>
                  <button
                    onClick={() => setInterest('people')}
                    className={`option-chip font-mono text-[11px] ${interest === 'people' ? 'active' : ''}`}
                  >
                    Managing people
                  </button>
                  <button
                    onClick={() => setInterest('products')}
                    className={`option-chip font-mono text-[11px] ${interest === 'products' ? 'active' : ''}`}
                  >
                    Creating products
                  </button>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-2">
                  3. Where do you want to be in 5 years?
                </label>
                <div className="chips-row">
                  <button
                    onClick={() => setGoal('partner')}
                    className={`option-chip font-mono text-[11px] ${goal === 'partner' ? 'active' : ''}`}
                  >
                    Partner/Director at a firm
                  </button>
                  <button
                    onClick={() => setGoal('leader')}
                    className={`option-chip font-mono text-[11px] ${goal === 'leader' ? 'active' : ''}`}
                  >
                    Senior leader at a company
                  </button>
                  <button
                    onClick={() => setGoal('entrepreneur')}
                    className={`option-chip font-mono text-[11px] ${goal === 'entrepreneur' ? 'active' : ''}`}
                  >
                    Entrepreneur
                  </button>
                  <button
                    onClick={() => setGoal('open')}
                    className={`option-chip font-mono text-[11px] ${goal === 'open' ? 'active' : ''}`}
                  >
                    Open
                  </button>
                </div>
              </div>

              <button
                disabled={!backgroundSelected || !interest || !goal}
                onClick={handleMatch}
                className="match-btn font-mono text-mono-label mt-4"
              >
                Find Recommended Sectors
              </button>
            </div>
          ) : (
            <div className="matcher-results">
              <span className="font-mono text-[10px] text-mba-success uppercase tracking-wider block mb-2">Recommended Tracks</span>
              <div className="results-grid mb-6">
                {matchedRoles.map((role) => (
                  <div key={role.id} className="result-item">
                    <h4 className="font-display font-bold text-body text-mba-ink mb-1">{role.title}</h4>
                    <p className="text-caption text-mba-ink-soft mb-3">{role.subtitle}</p>
                    <a
                      href={`#${role.id}`}
                      className="explore-btn-link font-mono text-[11px] text-mba-accent hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore this role</span> &rarr;
                    </a>
                  </div>
                ))}
              </div>
              <button onClick={handleResetMatcher} className="reset-btn font-mono text-mono-label">
                &larr; Retake sector questionnaire
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ROLES DIRECTORY LIST */}
      <section className="roles-list space-y-12">
        <h2 className="font-display text-h2 text-mba-ink border-b border-mba-rule pb-3">MBA Roles Directory</h2>
        
        {ROLES_DATA.map((role) => (
          <div key={role.id} id={role.id} className="role-card scroll-margin">
            <div className="role-card-header mb-4">
              <div>
                <h3 className="font-display text-h3 text-mba-ink font-bold">{role.title}</h3>
                <span className="font-mono text-[11px] text-mba-ink-soft block mt-1">{role.subtitle}</span>
              </div>
              <div className="salary-box font-mono">
                <DollarSign size={14} className="text-mba-accent" />
                <span>{role.salary.split('(')[0].trim()}</span>
              </div>
            </div>

            <p className="text-body text-mba-ink mb-6">{role.description}</p>

            <div className="role-details-grid mb-6">
              <div className="detail-block">
                <div className="block-title font-mono text-[10px]">
                  <Layers size={12} /> What You Actually Do
                </div>
                <p className="text-caption text-mba-ink-soft">{role.progression}</p>
              </div>

              <div className="detail-block">
                <div className="block-title font-mono text-[10px]">
                  <Target size={12} /> Interview Evaluation
                </div>
                <p className="text-caption text-mba-ink-soft">{role.testing}</p>
              </div>

              <div className="detail-block">
                <div className="block-title font-mono text-[10px]">
                  <User size={12} /> Undergraduate Fit
                </div>
                <p className="text-caption text-mba-ink-soft">{role.backgroundFit}</p>
              </div>
            </div>

            {/* DAY IN LIFE block */}
            <div className="day-in-life-block mb-6">
              <span className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-2">Day in the Life</span>
              <p className="text-caption text-mba-ink-soft italic leading-relaxed">
                "{role.dayInLife}"
              </p>
            </div>

            {/* HIRING FIRMS */}
            <div className="employers-block">
              <span className="font-mono text-[10px] text-mba-ink-faint uppercase tracking-wider block mb-2">Top Recruiters</span>
              <div className="employers-chips">
                {role.employers.map((emp) => (
                  <Link
                    key={emp}
                    href={`/companies?search=${encodeURIComponent(emp)}`}
                    className="employer-chip font-mono text-[11px]"
                  >
                    {emp}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <style jsx>{`
        .roles-container {
          padding-bottom: var(--space-8);
        }
        .roles-header {
          border-left: 3px solid var(--mba-accent);
          padding-left: var(--space-4);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
        }
        .matcher-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          box-shadow: var(--shadow-sm);
        }
        .matcher-top {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-1);
        }
        .chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .option-chip {
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          cursor: pointer;
          color: var(--mba-ink-soft);
          transition: all 150ms ease;
        }
        .option-chip:hover {
          background: var(--mba-surface);
        }
        .option-chip.active {
          border-color: var(--mba-accent);
          background: var(--mba-accent-soft);
          color: var(--mba-accent);
          font-weight: 600;
        }
        .match-btn {
          width: 100%;
          background: var(--mba-accent);
          color: #ffffff;
          border: none;
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-weight: 600;
          transition: opacity 150ms ease;
        }
        .match-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .results-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 640px) {
          .results-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .result-item {
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
        }
        .reset-btn {
          background: none;
          border: none;
          color: var(--mba-accent);
          cursor: pointer;
          text-decoration: underline;
        }
        .role-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-6);
          box-shadow: var(--shadow-sm);
        }
        .scroll-margin {
          scroll-margin-top: var(--space-6);
        }
        .role-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-4);
          border-bottom: 1px solid var(--mba-rule);
          padding-bottom: var(--space-4);
        }
        .salary-box {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          font-size: 11px;
          color: var(--mba-ink-soft);
          flex-shrink: 0;
        }
        .role-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 768px) {
          .role-details-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
        .detail-block {
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
        }
        .block-title {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--mba-accent);
          font-weight: bold;
          margin-bottom: var(--space-2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .day-in-life-block {
          background: #FAF9F6;
          border-left: 3px solid var(--mba-accent-soft);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
        }
        .employers-chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .employer-chip {
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          color: var(--mba-ink-soft);
          text-decoration: none;
          transition: border-color 150ms ease, background 150ms ease;
        }
        .employer-chip:hover {
          border-color: var(--mba-accent);
          background: var(--mba-accent-soft);
        }
      `}</style>
    </div>
  )
}
