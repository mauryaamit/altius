import type { ConceptEntry, CaseContent, HotTopicContent, ThinkContent, OpportunityContent, LibraryEntry, CompanySpotlightContent } from './types'

export const strategyConcepts: ConceptEntry[] = [
  {
    id: 'strat-ansoff',
    title: 'Ansoff Matrix',
    category: 'Growth Strategy',
    altitude: {
      hook: 'Four paths to growth — balance risk against market and product familiarity.',
      plain:
        'The Ansoff Matrix structures growth strategies into four quadrants: Market Penetration (existing products, existing markets), Market Development (existing products, new markets), Product Development (new products, existing markets), and Diversification (new products, new markets).',
      depth:
        'Market Penetration has the lowest risk (e.g., increasing purchase frequency, loyalty programs). Market Development carries medium risk (e.g., entering new geographies, targeting new buyer personas). Product Development carries medium risk (e.g., Apple launching Watch to iPhone owners). Diversification has the highest risk (no familiarity with product or market) but represents the only path to jump-start corporate growth when core markets are mature.'
    }
  },
  {
    id: 'strat-bcg',
    title: 'BCG Growth-Share Matrix (*)',
    category: 'Portfolio Strategy',
    altitude: {
      hook: 'Prioritize resource allocation across a portfolio of business units based on market share and growth.',
      plain:
        'The BCG Matrix categorizes business units into four quadrants: Stars (high growth, high share), Cash Cows (low growth, high share), Question Marks (high growth, low share), and Dogs (low growth, low share). It guides portfolio investment decisions.',
      depth:
        'Cash Cows fund the portfolio; Stars are future cash cows; Question Marks represent high-uncertainty bets; Dogs should typically be divested or harvested. \n\n**When it is the WRONG choice:** The BCG Matrix is the wrong tool when: (1) Market share does not correlate with profitability (e.g., premium/niche strategies where low market share yields high margins like Porsche). (2) Synergy links between business units are ignored; a "Dog" might provide a critical support capability or block a competitor from accessing a "Star." (3) High-growth markets have zero entry barriers, meaning today\'s "Stars" are quickly commoditized. A **GE-McKinsey 9-Box Matrix** is a more robust alternative.'
    }
  },
  {
    id: 'strat-swot',
    title: 'SWOT Analysis (*)',
    category: 'Strategic Analysis',
    altitude: {
      hook: 'The classic framework for scanning Strengths, Weaknesses, Opportunities, and Threats.',
      plain:
        'SWOT categorizes internal factors (Strengths, Weaknesses) and external dynamics (Opportunities, Threats). It is widely used as an initial brainstorming tool but lacks analytical depth.',
      depth:
        'Strengths and Weaknesses focus on internal resources, capabilities, and gaps. Opportunities and Threats focus on external industry trends, regulatory changes, and competitive shifts. \n\n**When it is the WRONG choice:** SWOT is regarded by top strategists and MBA interviews as a weak, superficial tool. It is the wrong choice when: (1) Evaluating complex strategic choices, because it lists items without prioritization, weight, or causal links. (2) Used as a final analysis rather than an initial, brief categorization. It leads to confirmation bias (listing strengths you want to see). A custom issue tree deconstructing **VRIO** for internal and **PESTEL** for external forces is far superior.'
    }
  },
  {
    id: 'strat-porter-generic',
    title: 'Porter\'s Generic Strategies',
    category: 'Competitive Advantage',
    altitude: {
      hook: 'Cost Leadership vs. Differentiation vs. Focus — choose one position or risk getting stuck in the middle.',
      plain:
        'Michael Porter argues that a firm achieves sustainable competitive advantage by choosing one of three generic strategies: Cost Leadership (being the lowest-cost producer), Differentiation (offering unique value at a premium), or Focus (targeting a narrow segment with cost or differentiation).',
      depth:
        'Firms that try to do all three generic strategies risk getting "stuck in the middle," possessing neither the scale to compete on cost nor the uniqueness to command a premium (e.g. Sears). Cost leadership requires scale and process efficiency. Differentiation requires brand equity and product innovation. Focus strategies target underserved niches.'
    }
  },
  {
    id: 'strat-blue-ocean',
    title: 'Blue Ocean Strategy',
    category: 'Strategic Analysis',
    altitude: {
      hook: 'Stop competing in crowded red oceans — create uncontested market space and make competition irrelevant.',
      plain:
        'Instead of battling rivals in existing markets, firms should create new demand by offering high-value, lower-cost solutions through Value Innovation.',
      depth:
        'Value Innovation simultaneously pursues differentiation and low cost. The primary tool is the Strategy Canvas, plotting industry factors and drawing a new value curve. The Four Actions Framework asks: Eliminate, Reduce, Raise, Create. (Note: Blue Ocean is a duplicate here, but strategy and marketing both claim it; focus here on Value Innovation canvas).'
    }
  },
  {
    id: 'strat-mckinsey-7s',
    title: 'McKinsey 7S Framework',
    category: 'Organizational Strategy',
    altitude: {
      hook: 'Align seven internal elements to ensure successful strategy execution.',
      plain:
        'The McKinsey 7S model aligns Hard elements (Strategy, Structure, Systems) and Soft elements (Shared Values, Skills, Staff, Style) to ensure organizational effectiveness and change readiness.',
      depth:
        'Shared Values is at the center of the framework, guiding all other elements. Hard elements are easy to identify and change. Soft elements are harder to influence but are critical to execution. If the 7S elements are not aligned, strategy execution will stall regardless of how good the strategic design is.'
    }
  },
  {
    id: 'strat-core-competence',
    title: 'Core Competence Theory',
    category: 'Competitive Advantage',
    altitude: {
      hook: 'Core competences are the deep collective learning of an organization — coordinate diverse production skills.',
      plain:
        'Developed by Hamel and Prahalad (1990), Core Competence argues that competitive advantage is built on unique skills and technologies that provide access to markets, are difficult to imitate, and add customer value.',
      depth:
        'A core competence is not a single product; it is an underlying capability (e.g. Honda\'s engine design capability, Canon\'s optics). Core competencies allow a firm to spawn diverse end-products, sharing R&D costs and out-innovating competitors who focus strictly on product portfolios.'
    }
  },
  {
    id: 'strat-vrin',
    title: 'Resource-Based View (VRIO)',
    category: 'Competitive Advantage',
    altitude: {
      hook: 'moats come from within — value, rarity, inimitability, and organization.',
      plain:
        'The Resource-Based View (RBV) argues that firms achieve sustainable competitive advantage if they possess resources that are Valuable, Rare, Inimitable, and Non-substitutable (VRIN). VRIO adds Organized.',
      depth:
        'Valuable: exploits opportunities or neutralizes threats. Rare: controlled by a small number of firms. Inimitable: competitors face significant cost disadvantages in replicating it (due to historical path-dependency, causal ambiguity, or social complexity). Organized: firm has the organizational structure to capture value. VRIO determines if a resource is a temporary advantage or a long-term moat.'
    }
  },
  {
    id: 'strat-disruptive',
    title: 'Disruptive Innovation',
    category: 'Strategic Analysis',
    altitude: {
      hook: 'How incumbents get blind-sided — disruptive innovation starts in low-end or new markets.',
      plain:
        'Clayton Christensen\'s theory explains how small entrants with fewer resources challenge established businesses (incumbents) by targeting ignored low-end or new customer segments, then moving upmarket.',
      depth:
        'Incumbents naturally focus on sustaining innovations for their most profitable, demanding customers, overshooting the needs of the mainstream. Disruptive technologies are initially inferior but cheaper, simpler, and more convenient. By the time they improve to satisfy mainstream buyers, the incumbent is displaced.'
    }
  },
  {
    id: 'strat-platforms',
    title: 'Platform vs. Pipeline Models',
    category: 'Growth Strategy',
    altitude: {
      hook: 'Ecosystems beat linear value chains — platforms facilitate value creation between third parties.',
      plain:
        'Traditional pipelines create value linear (supplier -> factory -> distributor -> buyer). Platforms do not own the inventory; they create value by matching producers and consumers, leveraging network effects.',
      depth:
        'Network Effects (Metcalfe\'s Law) dictate platform value: the value increases exponentially with the number of users on both sides (two-sided networks). The key challenge is the chicken-and-egg launch problem. Platform economics focus on minimizing transaction friction and managing quality through reviews and standards.'
    }
  },
  {
    id: 'strat-integration',
    title: 'Vertical vs. Horizontal Integration',
    category: 'Growth Strategy',
    altitude: {
      hook: 'Buy the supply chain or buy the competitor? Balance operational control against market share.',
      plain:
        'Vertical Integration involves expanding backward into suppliers or forward into distributors to control the value chain. Horizontal Integration is acquiring competitors at the same level to consolidate market share.',
      depth:
        'Vertical integration secures supply and reduces transaction costs, but raises capital requirements and reduces flexibility (due to operating leverage). Horizontal integration creates market power, scale economies, and revenue synergies, but raises antitrust risks and integration friction.'
    }
  },
  {
    id: 'strat-scenario',
    title: 'Scenario Planning',
    category: 'Strategic Analysis',
    altitude: {
      hook: 'Strategy under extreme uncertainty — model multiple plausible futures to test resilience.',
      plain:
        'Scenario Planning is a structured method for designing strategies that are resilient across multiple plausible future states, rather than betting the firm\'s survival on a single forecast.',
      depth:
        'Steps: (1) Identify focal issue. (2) Identify key driving forces. (3) Select the two most critical, highly uncertain forces to form a 2x2 grid (e.g., high regulation vs low regulation, high interest rates vs low interest rates). (4) Develop detailed narratives for the four scenarios. (5) Evaluate strategic options against each scenario to identify robust "no-regret" actions.'
    }
  }
];

export const strategyCase: CaseContent = {
  date: '2024-06-15',
  company: 'Jio Platforms',
  sector: 'Telecom / Digital Ecosystem',
  background:
    "Reliance Jio launched in September 2016 with free voice calls and data, triggering the most disruptive telecom price war in Indian history. By FY24, Jio commands 474 million subscribers and has expanded into JioFiber, JioCinema (post-Viacom18 merger), JioMart, JioSaavn, and the forthcoming Jio AI Cloud. The group's strategy raises a fundamental question: is Jio building a telecom company or an operating system for India's digital economy?",
  dataExhibits: [
    {
      parameter: 'Jio subscriber base (June 2024)',
      value: '474 Mn',
      source: { id: 1, source: 'TRAI Subscriber Report', date: '2024-06' },
      sensitivity: 'Low (near duopoly achieved)',
    },
    {
      parameter: 'Jio average revenue per user (ARPU)',
      value: 'Rs. 181.7/month',
      source: { id: 2, source: 'Reliance Industries Q4FY24 Results', date: '2024-04' },
      sensitivity: 'High — determines telecom profitability',
    },
    {
      parameter: 'Jio Platforms equity raised (2020, FY21)',
      value: 'Rs. 1,52,056 Cr',
      source: { id: 3, source: 'Reliance Industries Annual Report FY21', date: '2021' },
      sensitivity: 'Historical, not current',
    },
  ],
  dilemma:
    "Jio's strategy is internally coherent but externally ambiguous: it is simultaneously a telecom utility and a digital product platform, and these two identities have conflicting strategic logic. Telecom is capital-intensive, regulated, commodity-prone; platforms are asset-light, winner-take-all, and high-margin. How should Jio allocate the next Rs. 1 lakh crore capex between 5G network densification, content/OTT, AI cloud, and JioMart retail?",
  stakeholders: [
    { name: 'Mukesh Ambani / Reliance shareholders', role: 'Promoter + investors', interest: 'Equity value creation, market dominance' },
    { name: 'Meta, Google (minority investors)', role: 'Strategic partners', interest: 'India digital market access' },
    { name: 'Airtel', role: 'Primary competitor', interest: 'ARPU protection, enterprise segment dominance' },
    { name: 'TRAI / DoT', role: 'Regulator', interest: 'Competition, affordability, spectrum management' },
    { name: 'Content creators / OTT producers', role: 'Ecosystem partners', interest: 'Platform reach, monetization' },
  ],
  lenses: {
    strategy: "Applying BCG Matrix to Jio's verticals: Telecom is a Cash Cow (high share, slowing growth); JioCinema/OTT is a Question Mark (high growth, unclear share); JioMart is a Dog risk (competing against Blinkit/Zepto/Amazon with no natural adjacency advantage); AI Cloud is a nascent Star. The strategic logic should be: fund OTT and AI Cloud from telecom cash flows; exit or JV JioMart. The platform vs. utility tension requires a structural answer — should Jio be spun into separate verticals for capital efficiency?",
    finance: 'Reliance funded Jio\'s price war via balance sheet — accumulated Rs. 2.6 lakh crore in net debt before rights issue and Jio Platforms stake sales. The asset-heavy telecom model now needs ARPU growth to service this debt. Each Rs. 10 ARPU increase adds approximately Rs. 5,700 crore annual revenue. The 5G investment (estimated Rs. 2 lakh crore total) is a bet that ARPU doubles over 5 years as data consumption and enterprise 5G use cases grow.',
    marketing: "Jio's brand identity has bifurcated: 'affordable connectivity for all' (telecom) vs. 'premium digital entertainment' (JioCinema IPL rights). Managing this dual identity without diluting either is a brand architecture challenge. Jio needs a House of Brands approach (separate Jio Cinema brand from Jio telecom) rather than a Branded House.",
    operations: '5G rollout speed is an operational KPI: Jio deployed 5G across 8,500+ cities in 12 months — fastest in the world at scale. The constraint is now backhaul capacity and enterprise customer acquisition, not radio tower rollout. JioBusiness (B2B arm) is the underexploited revenue lever.',
  },
  recommendation:
    'Focus 5G capex on enterprise and government use cases (smart cities, manufacturing, healthcare) where ARPU is 5-10x consumer rates and competition is limited. Consolidate OTT under JioCinema with a clear content investment thesis (originals for tier-1 cities, cricket for tier-2+). Withdraw from JioMart general merchandise; retain grocery as a telecom loyalty driver only. The AI Cloud play is strategically vital but requires a distinct GTM organization and pricing model separate from telecom.',
  commonMistakes: [
    "Treating Jio purely as a telecom company — its competitive advantage is ecosystem lock-in and data, not network quality alone.",
    "Ignoring ARPU as the key financial lever — subscriber scale without ARPU growth is a low-margin utility business, not a platform.",
    "Underestimating Airtel's enterprise and premium segment strength — Airtel has superior ARPU and profitable enterprise contracts that Jio has not cracked.",
  ],
  citations: [
    { id: 1, source: 'TRAI Subscriber Report', date: '2024-06' },
    { id: 2, source: 'Reliance Industries Q4FY24 Results', date: '2024-04' },
    { id: 3, source: 'Reliance Industries Annual Report FY21', date: '2021' },
  ],
}

export const strategyHotTopic: HotTopicContent = {
  date: '2024-06-15',
  headline: 'OpenAI-Microsoft Relationship Faces Strategic Renegotiation',
  whatHappened:
    'Reports emerged in mid-2024 that OpenAI is seeking to restructure its partnership with Microsoft as it transitions toward a for-profit structure. Microsoft holds exclusive cloud-provision rights and approximately 49% of profits. OpenAI\'s board post-Altman-crisis renegotiation is seeking to reduce this revenue share as the company\'s valuation approaches $80 Bn.',
  rootCause:
    'The original 2019 deal was struck when OpenAI was a research lab with limited commercial traction. GPT-4\'s commercial success and the generative AI gold rush have made OpenAI\'s commercial value structurally higher than the partnership terms assumed. Both parties have incentives to renegotiate but divergent leverage positions.',
  stakeholders: [
    { name: 'Microsoft', gains: 'Azure cloud lock-in is enormous strategic value', loses: 'Profit share if OpenAI renegotiates aggressively' },
    { name: 'OpenAI (Altman + board)', gains: 'Greater profit capture, IPO optionality', loses: 'Azure cloud exclusivity subsidy worth billions in infra cost' },
    { name: 'Google DeepMind / Anthropic', gains: 'Distraction and relationship friction at the market leader', loses: 'Nothing; positioned to capture enterprise buyers seeking alternatives' },
    { name: 'Enterprise customers', gains: 'More competitive AI pricing as rivalry intensifies', loses: 'Complexity of evaluating an evolving product landscape' },
  ],
  businessImplications:
    'The outcome reshapes the AI infrastructure power structure. If OpenAI successfully negotiates a larger profit share, it accelerates its path to profitability and reduces Microsoft\'s strategic leverage. If Microsoft holds firm, OpenAI\'s IPO story is complicated — it cannot tell a clean profitability narrative with 49% profit capped by a partner.',
  scenarios: [
    { label: 'Best', description: "Partnership restructures amicably: OpenAI retains Azure exclusivity in exchange for higher profit share + expanded Microsoft Azure credits. Both parties' market caps benefit."},
    { label: 'Worst', description: 'Deal collapses; OpenAI moves to multi-cloud; Microsoft sues for breach; legal uncertainty causes enterprise customers to pause AI commitments. 12-18 month market confusion.' },
    { label: 'Likely', description: 'Phased renegotiation over 2024-2025: profit share adjusted to 35%; Azure exclusivity maintained but with carve-outs for certain geographies. Both parties claim victory.' },
  ],
  citations: [
    { id: 1, source: 'The Information, OpenAI-Microsoft Renegotiation Report', date: '2024-06' },
    { id: 2, source: 'Bloomberg Technology, OpenAI Valuation Coverage', date: '2024-05' },
  ],
}

export const strategyThink: ThinkContent = {
  date: '2024-06-15',
  question: 'A large Indian conglomerate is considering entering the electric vehicle (EV) market. How would you frame the strategic entry decision?',
  modelAnswer: {
    hook: "Entry decisions are not about whether an opportunity exists — it's about whether you have the right to win in it.",
    plain:
      'The EV market is large and growing, but size does not determine whether this particular conglomerate should enter. The right questions are: Does the conglomerate have any asymmetric advantage over existing players? Can it sustain the capital requirements through the break-even period? And which segment of EV (2-wheeler, 3-wheeler, 4-wheeler, commercial) is most adjacent to existing capabilities?',
    depth:
      "Framework: Use Three Horizons + VRIO analysis. (1) Assess the opportunity: EV market sizing (NITI Aayog projects 80% EV penetration by 2030 across 2W/3W), profitability timeline (EV players globally are pre-profit at scale; exception is 2W segment in India where Ola Electric has demonstrated path to profitability), and regulatory tailwinds (FAME II, PLI scheme incentives). (2) Assess the right to win: Does the conglomerate have battery tech, charging infrastructure, manufacturing capability, or distribution reach that rivals lack? Apply VRIO: if no resource passes all four tests, entry requires acquisition or JV. (3) Mode of entry: Build (high risk, long timeline, high control), Buy (fast, expensive, integration risk), or Partner (shared risk, shared reward, limited control). For a conglomerate with auto components background: JV with an existing EV OEM is likely the fastest path to a VRIN position. (4) Financial modeling: model time-to-profitability under base/bear/bull assumptions; identify cash-out points; set go/no-go EBITDA milestone at Year 3.",
  },
  alternatePerspective:
    'The conglomerate should consider whether not entering is the right answer. EVs require long-horizon patient capital. If the conglomerate\'s existing businesses are higher-ROIC opportunities with shorter payback periods, capital allocation discipline may argue for investing in those instead and watching the EV landscape mature for 3-5 years before making a better-informed entry decision.',
  citations: [
    { id: 1, source: 'NITI Aayog, EV 30@30 Report', date: '2022' },
    { id: 2, source: 'SIAM, India EV Market Statistics', date: '2024' },
  ],
}

export const strategyOpportunity: OpportunityContent = {
  date: '2024-06-15',
  problemStatement:
    "India's cold chain logistics infrastructure covers less than 12% of perishable produce, resulting in estimated post-harvest losses of Rs. 92,651 crore annually. This is both a national food security challenge and a massive white-space business opportunity.",
  rootCause:
    'Fragmented farm-to-market supply chains, high cost of refrigerated transport infrastructure (10-15x higher capex vs. dry warehousing), lack of last-mile cold storage near farm gates, and underdeveloped financing instruments for agri-infrastructure prevent at-scale build-out.',
  approaches: [
    'Hub-and-spoke cold chain network: Build 100 regional cold storage hubs (1,000-5,000 MT each) near major production clusters (Nashik onions, Punjab potatoes, Andhra chillies) and connect via refrigerated "spoke" vehicles to urban distribution points. Revenue model: storage fee + value-added services (sorting, grading, pre-cooling).',
    'Tech-enabled cold chain-as-a-service: Aggregate underutilized cold storage capacity via a marketplace platform (Airbnb for cold storage). Asset-light; monetizes fragmented existing infrastructure. Harder to control quality and reliability but lower capex.',
    'Anchor-tenant model: Partner with an anchor FMCG / QSR player (ITC, McDonald\'s India, Blinkit) as a guaranteed demand offtake customer for 60-70% of cold chain capacity; use that contracted revenue to raise project finance for infrastructure build. This de-risks the capital raise significantly.',
  ],
  actionStep:
    'This week: Map the three largest post-harvest loss crops by state (ICAR data available), identify which states have PLI-eligible cold chain projects under PM Kisan Sampada Yojana, and screen for anchor-tenant candidates whose supply chain pain is acute enough to sign a 5-year offtake agreement.',
  citations: [
    { id: 1, source: 'ICAR Report on Post-Harvest Losses in India', date: '2022' },
    { id: 2, source: 'CIPHET, Quantification of Post-Harvest Losses', date: '2021' },
  ],
}

export const strategyLibrary: LibraryEntry[] = [
  {
    id: 'lib-strat-1',
    title: 'Competitive Strategy',
    author: 'Michael E. Porter',
    year: 1980,
    tags: ['strategy'],
    description: 'The book that introduced Five Forces and Generic Strategies. Still the most cited strategy text in business schools globally.',
    pages: 396,
  },
  {
    id: 'lib-strat-2',
    title: 'Good Strategy Bad Strategy',
    author: 'Richard Rumelt',
    year: 2011,
    tags: ['strategy', 'consulting'],
    description: 'Rumelt\'s diagnosis of what makes strategy real vs. corporate-speak. The kernel of good strategy: diagnosis, guiding policy, coherent actions.',
    pages: 336,
  },
  {
    id: 'lib-strat-3',
    title: 'The Innovator\'s Dilemma',
    author: 'Clayton Christensen',
    year: 1997,
    tags: ['strategy'],
    description: 'How and why great companies fail when confronted with disruptive innovation. Essential reading for any strategy role.',
    pages: 288,
  },
]

export const strategyCompany: CompanySpotlightContent = {
  companyName: 'Netflix',
  identity: 'Subscription-based streaming entertainment service provider',
  founded: 1997,
  headquarters: 'Los Gatos, California, USA',
  metrics: [
    { label: 'Market Capitalization', value: 'USD 270 Billion', asOf: 'June 2026', citationId: 101 },
    { label: 'FY25 Annual Revenue', value: 'USD 38.3 Billion', asOf: 'December 2025', citationId: 102 },
    { label: 'Global Paid Memberships', value: '269 Million', asOf: 'March 2025', citationId: 103 },
    { label: 'Annual Content Spend', value: 'USD 17 Billion', asOf: 'December 2025', citationId: 103 }
  ],
  competitors: [
    { name: 'Disney+', positioningNote: 'Competes with deep legacy IP portfolios (Marvel, Star Wars, Pixar) and family-centric subscription bundles.' },
    { name: 'Amazon Prime Video', positioningNote: 'Competes as a loss-leader benefit bundled inside the larger Prime shopping and logistics ecosystem.' }
  ],
  industryContext: 'The global streaming video market exceeds USD 100 Billion (2025) and is transitioning from a period of aggressive, unprofitable subscriber acquisition to a focus on EBITDA margins, content licensing, and ad-supported pricing tiers.',
  functionLens: 'Netflix\'s strategy illustrates the power of scale economies, platform business models, and disruptive innovation. Starting as a DVD-by-mail service, it disrupted brick-and-mortar rental giants (Blockbuster) before moving into streaming. Netflix\'s core strategic moat is its content spending scale: by spreading a USD 17 Billion annual content budget across 269 million subscribers, its per-user content cost is significantly lower than any challenger. To counter slowing subscriber growth, the firm executed two major strategic shifts: launching an ad-supported pricing tier to capture price-sensitive users, and cracking down on password sharing to monetize secondary viewers. A key strategic threat remains: the inflation of production costs and the consolidation of legacy media content owners who are returning to licensing their catalogs rather than competing directly.',
  whyItMatters: 'Netflix represents the classic case of business model evolution and scale-driven content moats. Use Netflix in discussions about Metcalfe\'s law of network effects, low-end disruptive innovation, and navigating market saturation through pricing tier diversification.',
  citations: [
    { id: 101, source: 'NASDAQ Valuation Indices', date: '2026-06' },
    { id: 102, source: 'Netflix Form 10-K FY25', date: '2026-01' },
    { id: 103, source: 'LightShed Partners Media Sector Note', date: '2025-12' }
  ]
};
