import type { ConceptEntry, CaseContent, HotTopicContent, ThinkContent, LibraryEntry, CompanySpotlightContent } from './types'

export const peopleConcepts: ConceptEntry[] = [
  {
    id: 'peop-situational',
    title: 'Situational Leadership',
    category: 'Leadership',
    altitude: {
      hook: 'No single leadership style works for everyone — adapt your style to follower maturity.',
      plain:
        'The Hersey-Blanchard Situational Leadership model states that leaders should adjust their style (Directing, Coaching, Supporting, Delegating) based on the competence and commitment of their followers.',
      depth:
        'Follower maturity levels: D1 (Low competence, high commitment - needs Directing); D2 (Some competence, low commitment - needs Coaching); D3 (High competence, variable commitment - needs Supporting); D4 (High competence, high commitment - needs Delegating). Leading a D1 with supporting style causes frustration; leading a D4 with directing causes micromanagement.'
    }
  },
  {
    id: 'peop-maslow',
    title: 'Maslow\'s Motivation Hierarchy',
    category: 'Motivation',
    altitude: {
      hook: 'Basic needs must be satisfied before higher-level self-actualization can motivate behavior.',
      plain:
        'Maslow\'s Hierarchy of Needs ranks human motivation from basic physiological needs to safety, love/belonging, esteem, and finally self-actualization. Critiques point out that humans do not always follow this linear progression.',
      depth:
        'In the workplace: Physiological (fair pay, comfortable workspace); Safety (job security, safe conditions); Social (team culture, friendships); Esteem (recognition, status); Self-actualization (meaningful work, personal growth). Critique: (1) The hierarchy is not rigid; people will pursue self-actualization (e.g. starving artists) even if basic needs are unmet. (2) It ignores cultural variations (collectivist cultures prioritize social needs over individual safety).'
    }
  },
  {
    id: 'peop-herzberg',
    title: 'Herzberg\'s Two-Factor Theory',
    category: 'Motivation',
    altitude: {
      hook: 'The opposite of dissatisfaction is not satisfaction — manage Hygiene factors vs. Motivators.',
      plain:
        'Herzberg\'s Motivator-Hygiene theory argues that separate factors cause satisfaction (Motivators: achievement, growth, interesting work) and dissatisfaction (Hygiene factors: salary, company policies, working conditions).',
      depth:
        'Hygiene factors do not motivate; they only prevent dissatisfaction. If you have poor hygiene factors, employees are unhappy. But improving hygiene factors beyond a baseline does not increase motivation. Motivators are intrinsic factors that drive extra effort. Compensation behaves as a hygiene factor; interesting work behaves as a motivator.'
    }
  },
  {
    id: 'peop-tuckman',
    title: 'Tuckman\'s Team Development',
    category: 'Leadership',
    altitude: {
      hook: 'Forming, Storming, Norming, Performing — the inevitable stages of building a high-performing team.',
      plain:
        'Bruce Tuckman\'s model outlines how small teams progress through four stages: Forming (orientation), Storming (conflict), Norming (cohesion), and Performing (execution). Adjourning was added later for dissolution.',
      depth:
        'Forming: polite, anxious, establishing ground rules. Storming: members challenge authority, conflict over goals and styles; teams must cross this stage to survive. Norming: consensus emerges, roles are accepted, trust develops. Performing: high efficiency, autonomous execution. Leaders must adjust their style per stage, facilitating conflict resolution in storming rather than suppressing it.'
    }
  },
  {
    id: 'peop-schein',
    title: 'Schein\'s Three Levels of Culture',
    category: 'Culture',
    altitude: {
      hook: 'Culture is not what people say — it is the deep, unspoken assumptions that guide behavior.',
      plain:
        'Edgar Schein models organizational culture in three layers: Artifacts (visible structures, dress code), Espoused Values (official mission statements, values), and Basic Assumptions (unspoken beliefs, defaults).',
      depth:
        'Artifacts are easy to see but hard to decipher (e.g. ping-pong tables). Espoused values are what the company claims to stand for (e.g. corporate slide decks). Basic assumptions are the unconscious, taken-for-granted beliefs that actually dictate actions. Culture change fails when it focuses on artifacts (office redesign) instead of basic assumptions.'
    }
  },
  {
    id: 'peop-performance',
    title: 'Performance & Forced-Ranking',
    category: 'Performance',
    altitude: {
      hook: 'Rank-and-yank — the controversial GE performance model and the transition to continuous feedback.',
      plain:
        'Forced-ranking (Vitality Curve) requires managers to fit employees into a bell curve (e.g., 20% high, 70% average, 10% poor, who are fired). While it drives a performance culture, it kills collaboration.',
      depth:
        'Popularized by Jack Welch at GE. Pro: forces managers to make hard decisions and continuously upgrades talent pool quality. Con: fosters internal competition, creates a toxic culture, and leads to political gaming. Modern HR has shifted toward Continuous Performance Management (CPM), focusing on real-time feedback, developmental goals, and decoupling evaluation from daily coaching.'
    }
  },
  {
    id: 'peop-change',
    title: 'Kotter\'s 8-Step Change Model',
    category: 'Leadership',
    altitude: {
      hook: 'Strategy is easy, change is hard — Kotter\'s roadmap for leading organizational transformation.',
      plain:
        'John Kotter\'s 8 steps for successful change: Create Urgency, Build Coalition, Create Vision, Communicate Vision, Empower Action, Create Short-term Wins, Consolidate Gains, Anchor Change in Culture.',
      depth:
        'Transformation programs fail primarily because managers skip steps or move too fast. First, establish urgency (explain why status quo is dangerous). Second, align key influencers (coalition). Third, build a clear vision. Fourth, repeat the vision constantly. Fifth, remove roadblocks. Sixth, celebrate quick wins to sustain energy. Seventh, don\'t declare victory too early. Eighth, embed change in corporate habits.'
    }
  },
  {
    id: 'peop-conflict',
    title: 'Thomas-Kilmann Conflict Model',
    category: 'Leadership',
    altitude: {
      hook: 'Assertiveness vs. Cooperativeness — choose from 5 conflict resolution styles based on situation.',
      plain:
        'The Thomas-Kilmann Conflict Mode Instrument (TKI) maps conflict responses along two axes (Assertiveness and Cooperativeness), yielding five styles: Competing, Collaborating, Compromising, Avoiding, Accommodating.',
      depth:
        'Competing: High assertiveness, low cooperativeness (use in emergencies). Collaborating: High both (use for win-win solutions on critical issues). Compromising: Medium both (use for quick, temporary agreements). Avoiding: Low both (use when issue is trivial). Accommodating: Low assertiveness, high cooperativeness (use when you are wrong or to build social capital).'
    }
  },
  {
    id: 'peop-compensation',
    title: 'Compensation Philosophy',
    category: 'Performance',
    altitude: {
      hook: 'Pay-for-performance vs. Internal equity — designing compensation to align incentive and retention.',
      plain:
        'Compensation philosophy balances market competitiveness, internal equity (fairness across levels), and performance incentives (bonus, commission, equity/ESOPs) to attract and retain talent.',
      depth:
        'Pay-for-performance (variable pay) aligns worker incentives with corporate profit but increases stress and can lead to short-term optimization. Internal equity supports teamwork and loyalty but can lead to retention risk for top performers. Compensation plans must also balance cash vs equity (ESOPs) based on company maturity.'
    }
  },
  {
    id: 'peop-diversity',
    title: 'D&I Business Case',
    category: 'Culture',
    altitude: {
      hook: 'Diversity is not just compliance — diverse perspectives reduce groupthink and drive innovation.',
      plain:
        'The business case for Diversity & Inclusion (D&I) argues that heterogeneous teams make better decisions, understand broader consumer segments, and increase innovation compared to homogeneous cohorts.',
      depth:
        'Cognitive diversity prevents groupthink (collective blindness). Inclusion ensures these diverse perspectives are actually voiced and valued. Ethical case: equity and representation. Economic case: McKinsey studies show firms in top quartile for ethnic and gender diversity consistently outperform industry margins by 15-30%.'
    }
  },
  {
    id: 'peop-negotiation',
    title: 'Negotiation Fundamentals',
    category: 'Leadership',
    altitude: {
      hook: 'BATNA and ZOPA — the structural core of any distributive or integrative bargaining.',
      plain:
        'Negotiation operates on key parameters: BATNA (Best Alternative to a Negotiated Agreement), ZOPA (Zone of Possible Agreement), Reservation Price (walk-away point), and creating value through trade-offs.',
      depth:
        'BATNA is your source of leverage; if your alternative is strong, you can walk away. ZOPA is the overlap between buyer and seller reservation prices. Distributive bargaining is zero-sum (value claiming, e.g. price negotiation). Integrative bargaining is win-win (value creating, e.g. trade-offs across multiple vectors like payment terms, volume, or warranty).'
    }
  }
];

export const peopleCase: CaseContent = {
  date: '2024-06-15',
  company: 'Byju\'s (Think & Learn Pvt. Ltd.)',
  sector: 'Edtech / Human Capital',
  background:
    "Byju's expanded from 150 employees in 2015 to 50,000+ at peak in 2022, driven by Covid-fueled growth and aggressive acquisitions (Aakash, WhiteHat Jr., Great Learning). By 2023-24, the company had collapsed into a governance and HR crisis: 15,000+ employees laid off, salaries delayed by months, EPFO defaults, founder control maintained despite board resignations, and NCLT insolvency proceedings initiated by creditors.",
  dataExhibits: [
    {
      parameter: 'Peak employee count',
      value: '50,000+',
      source: { id: 1, source: 'Think & Learn HR Filings, media reports', date: '2022' },
      sensitivity: 'Historical reference',
    },
    {
      parameter: 'Employees laid off (2023-24)',
      value: '~15,000',
      source: { id: 2, source: 'Various media reports (ET, Mint)', date: '2023-24' },
      sensitivity: 'High — morale and attrition signal',
    },
    {
      parameter: 'EPFO dues in default',
      value: 'Rs. 140+ Cr',
      source: { id: 3, source: 'EPFO enforcement action, media reports', date: '2024-01' },
      sensitivity: 'High — legal and reputational risk',
    },
  ],
  dilemma:
    "Byju's collapse raises a core HR and leadership question: at what point does rapid headcount scaling become an organizational liability rather than a growth asset? And what HR governance failures enabled a company to delay employee salaries for months without triggering internal escalation?" ,
  stakeholders: [
    { name: 'Employees', role: 'Workforce', interest: 'Salary payment, severance, career continuity' },
    { name: 'EPFO', role: 'Regulator', interest: 'PF compliance, enforcement' },
    { name: 'Creditors (Glas Trust, Aditya Birla Finance)', role: 'Lenders', interest: 'Principal recovery from insolvency proceedings' },
    { name: 'Raveendran (Founder)', role: 'Promoter', interest: 'Control retention, settlement' },
    { name: 'Edtech sector', role: 'Industry', interest: 'Regulatory precedent, investor sentiment' },
  ],
  lenses: {
    strategy: "Byju's pursued an Ansoff diversification strategy at breakneck speed (K-12 + test prep + coding + professional learning + offline centers) without building the HR infrastructure to support it. The acquisition of Aakash (Rs. 7,300 crore) added 10,000 employees with a completely different culture (offline coaching vs. digital-native). Cultural integration failure is a strategy execution failure, not just an HR failure.",
    finance: 'The liquidity crisis was enabled by aggressive revenue recognition practices (multi-year subscription contracts booked upfront) and debt taken against future receivables. When learner refund requests spiked (a demand-side signal of product dissatisfaction) and FEMA audit revealed foreign remittance irregularities, the financial house of cards collapsed. The $1.2 Bn TLB (Term Loan B) at 6% interest carried no revenue-based covenant — a debt structure mismatch for a loss-making company.',
    marketing: "Byju's spent aggressively on advertising (Rs. 2,000+ crore annually at peak) while simultaneously cutting tutor quality to manage costs. This created a brand-product gap: marketing promised transformative learning; the actual product delivered by undertrained tutors was mediocre. NPS declined sharply, driving refund requests that drained cash.",
    operations: 'The human operations failure was systemic: no centralized HR system across acquisitions, no standardized onboarding, no unified payroll platform, and no escalation mechanism for compensation grievances. A company with 50,000 employees operated as if it were a 500-person startup in HR infrastructure.',
  },
  recommendation:
    'Post-mortem recommendation for any high-growth startup: maintain HR infrastructure investment proportional to headcount, not just revenue. Key metrics to monitor: payroll-to-cash coverage ratio, attrition by tenure band (high attrition in <1 year band signals onboarding failure), Glassdoor rating trajectory, and EPFO/ESI compliance status. The governance failure was a board failure — independent directors should have triggered a compliance audit when salaries were delayed beyond 30 days.',
  commonMistakes: [
    'Treating HR as a cost center to cut during downturns — the compounding effect of morale damage, attrition, and institutional knowledge loss far exceeds the salary savings.',
    'Assuming cultural integration happens naturally post-acquisition — it requires structured 100-day plans, retention bonuses for key talent, and explicit culture-mapping workshops.',
    'Confusing headcount growth with organizational capability — Byju\'s had 50,000 employees and zero institutional memory infrastructure.',
  ],
  citations: [
    { id: 1, source: 'Think & Learn HR Filings, media reports', date: '2022' },
    { id: 2, source: 'ET, Mint — Byju\'s coverage', date: '2023-24' },
    { id: 3, source: 'EPFO enforcement action notices', date: '2024-01' },
  ],
}

export const peopleHotTopic: HotTopicContent = {
  date: '2024-06-15',
  headline: 'India Inc Debates "Right to Disconnect" as 70-Hour Work Week Controversy Reignites',
  whatHappened:
    'Following Narayan Murthy\'s 70-hour work week statement (October 2023) and L&T Chairman SN Subrahmanyan\'s "work 90 hours, stare at your wife" comment (January 2025), India\'s policy discourse around workplace well-being and right-to-disconnect legislation intensified. Belgium and Portugal have enacted right-to-disconnect laws; India has no equivalent.',
  rootCause:
    'India\'s economic aspiration narrative ("Viksit Bharat" 2047, productivity imperative) creates institutional pressure toward long working hours, while younger workforce cohorts are increasingly prioritizing work-life integration. The generational tension maps onto deeper questions about organizational culture, management philosophy, and HR policy design.',
  stakeholders: [
    { name: 'Senior corporate leaders', gains: 'Cultural authority reinforced', loses: 'Talent attraction from younger cohorts who reject hustle culture' },
    { name: 'Young professionals (Gen Z / Millennial)', gains: 'Growing public discourse validating boundaries', loses: 'Career risk in organizations that reward visible long hours' },
    { name: 'HR professionals', gains: 'Legitimacy for well-being programs and flexible policies', loses: 'Caught between CEO culture mandates and talent retention needs' },
    { name: 'Startups', gains: 'Competitive if they offer better WLI vs. legacy large employers', loses: 'Investor pressure to maintain "hustle" cultures' },
  ],
  businessImplications:
    'Evidence from organizational behavior research shows diminishing returns to working hours beyond 50 hours/week — output per hour declines significantly above 55 hours (Stanford study, Pencavel 2014). The business case for reasonable working hours is not moral but operational: sustained overwork reduces cognitive performance, innovation, and retention.',
  scenarios: [
    { label: 'Best', description: 'India enacts a right-to-disconnect framework; major employers adopt formal after-hours communication policies; talent retention improves at companies with better WLI policies, creating market pressure for adoption.' },
    { label: 'Worst', description: 'Discourse remains symbolic; no policy change; younger talent increasingly migrates to GCC (Global Capability Center) roles or international employers with better WLI; productivity paradox deepens.' },
    { label: 'Likely', description: 'Large multinationals operating GCCs adopt global WLI standards voluntarily; Indian startups diverge — mature companies improve policies, early-stage startups maintain hustle culture; no national legislation in 3-5 year horizon.' },
  ],
  citations: [
    { id: 1, source: 'Pencavel, The Productivity of Working Hours (Stanford Discussion Paper)', date: '2014' },
    { id: 2, source: 'WHO/ILO, Working Long Hours and Ischemic Heart Disease Report', date: '2021' },
  ],
}

export const peopleThink: ThinkContent = {
  date: '2024-06-15',
  question: 'You are the new CHRO of a 5,000-person manufacturing company with a 35% annual attrition rate in frontline operator roles. The CEO wants it fixed in 12 months. What is your diagnosis and action plan?',
  modelAnswer: {
    hook: '35% attrition in frontline manufacturing is not an HR problem — it is a business continuity risk, and diagnosing it wrong will produce the wrong interventions.',
    plain:
      'Before recommending any interventions, establish what is driving attrition. High frontline attrition typically traces to four root causes: below-market compensation, poor supervisory relationships, unsafe/uncomfortable working conditions, or better alternatives within commute distance. Each requires a different fix.',
    depth:
      'Diagnostic framework: (1) Exit interview analysis (most companies have bad exit data — restructure exit process for honest responses; consider third-party exit interviews). (2) Compensation benchmarking: are operator wages at the median or below for the specific geography and industry? Even a 10-15% lag vs. market creates high sensitivity when wage transparency is high in manufacturing clusters. (3) Supervisor quality audit: survey anonymous satisfaction with direct manager; high variation across supervisors usually reveals specific toxic actors. (4) Competitor mapping: what alternative employers within 15 km offer? If a large new manufacturer (Amazon warehouse, new automotive plant) opened nearby, market pull is the driver. (5) Stay interview: survey current 2-3 year tenure operators on what would make them leave. Action plan by quarter: Q1 — Diagnosis (exit data, benchmarking, competitor mapping). Q2 — Compensation adjustment if below median (most impactful, fastest signal). Q3 — Supervisor development / performance management of outliers; introduce structured onboarding for new hires (attrition is highest in first 90 days). Q4 — Measurement: track 30/60/90-day retention of new hires as leading indicator. Annual attrition is a lagging metric — fix the leading indicators.',
  },
  alternatePerspective:
    'The 12-month mandate itself may be the problem. Some attrition in frontline roles is structural and healthy — 15-20% may reflect normal workforce dynamism. The CEO\'s goal of "fixing" it may mean different things: reducing cost of attrition (faster onboarding, lower replacement cost) vs. reducing attrition rate (which requires addressing fundamental working conditions or compensation). Clarify the actual business impact they are trying to solve — is it productivity loss? Quality defects during operator ramp-up? Or raw attrition percentage as an HR metric?',
  citations: [
    { id: 1, source: 'Gallup, State of the Global Workplace Report', date: '2023' },
    { id: 2, source: 'McKinsey, The Great Attrition / Talent Report', date: '2022' },
  ],
}

export const peopleLibrary: LibraryEntry[] = [
  {
    id: 'lib-people-1',
    title: 'Drive: The Surprising Truth About What Motivates Us',
    author: 'Daniel H. Pink',
    year: 2009,
    tags: ['people'],
    description: 'Autonomy, Mastery, Purpose as the three pillars of intrinsic motivation. Pink distills Self-Determination Theory for a management audience.',
    pages: 256,
  },
  {
    id: 'lib-people-2',
    title: 'The Fearless Organization',
    author: 'Amy C. Edmondson',
    year: 2018,
    tags: ['people', 'consulting'],
    description: 'The definitive book on psychological safety at work. Edmondson translates her 20 years of research into practical leadership tools.',
    pages: 256,
  },
]

export const peopleCompany: CompanySpotlightContent = {
  companyName: 'Tata Group',
  identity: 'Multinational conglomerate spanning steel, autos, technology, and consumer goods',
  founded: 1868,
  headquarters: 'Mumbai, Maharashtra, India',
  metrics: [
    { label: 'Total Group Assets', value: 'Rs. 25,00,000 Cr', asOf: 'March 2025', citationId: 101 },
    { label: 'Annual Group Revenue', value: 'Rs. 13,00,000 Cr', asOf: 'March 2025', citationId: 101 },
    { label: 'Total Employee Count', value: '1.02 Million', asOf: 'December 2025', citationId: 102 },
    { label: 'Trust Ownership Stake', value: '66%', asOf: 'December 2025', citationId: 103 }
  ],
  competitors: [
    { name: 'Adani Group', positioningNote: 'Competes in infrastructure and capital projects, focusing on aggressive growth and leverage.' },
    { name: 'Reliance Industries', positioningNote: 'Competes in retail and digital platforms, positioning on consumer scale and technology leadership.' }
  ],
  industryContext: 'The Indian corporate governance structure is heavily influenced by promoter-led family businesses. The Tata Group stands out due to its unique trust-based ownership structure, where philanthropic trusts control the holding company Tata Sons.',
  functionLens: 'Tata Group\'s leadership and culture model is built on institutional trust, employee welfare, and the Tata Administrative Services (TAS) flagship talent pipeline. Formulated during the industrialization era, Tata\'s organizational culture embeds the belief that the "community is the purpose of the enterprise, not just a shareholder." This values-led positioning leads to high employee retention, corporate trust, and brand equity. TAS operates as a centralized fast-track leadership program, rotating high-potential managers across diverse operating companies (Tata Motors, Tata Steel, IHCL). However, this decentralization creates a challenge: how to maintain cultural alignment and ethical standards across 100+ independent operating companies, which requires balancing corporate Sons-level governance with operating board autonomy.',
  whyItMatters: 'Tata Group is the premier example of values-led corporate culture, trust-based stakeholder governance, and centralized talent pipelines. Cite the Tata Group in discussions on corporate governance, employee retention strategy, and organizational alignment across large, diversified conglomerates.',
  citations: [
    { id: 101, source: 'Tata Sons Official Corporate Profile', date: '2025-05' },
    { id: 102, source: 'Tata Group Human Resources Directory', date: '2025-12' },
    { id: 103, source: 'Corporate Governance Review: The Tata Sons Trust Structure', date: '2025' }
  ]
};
