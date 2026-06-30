import type { ConceptEntry, CaseContent, HotTopicContent, ThinkContent, LibraryEntry, CompanySpotlightContent } from './types'

export const consultingConcepts: ConceptEntry[] = [
  {
    id: 'cons-mece',
    title: 'MECE Principle',
    category: 'Problem Structuring',
    altitude: {
      hook: 'MECE is the discipline of breaking problems so every piece is counted once and nothing is missed.',
      plain:
        'MECE stands for Mutually Exclusive, Collectively Exhaustive. When structuring a problem or analysis, your categories should not overlap (mutually exclusive) and should together cover all possibilities (collectively exhaustive). It prevents double-counting and logic leaks.',
      depth:
        'Formalized by Barbara Minto at McKinsey, MECE underpins the Pyramid Principle. A MECE issue tree splits a problem into branches. Standard splits: financial (Revenue vs Cost), process (Acquire vs Retain), or market (Domestic vs International). The key to MECE validation is ensuring the sum of all elements equals 100% of the parent node, with zero overlap between the child nodes.'
    }
  },
  {
    id: 'cons-profitability',
    title: 'Profitability Framework (*)',
    category: 'Problem Solving',
    altitude: {
      hook: 'Deconstruct profits into revenues and costs to isolate the root cause of financial decline.',
      plain:
        'Profitability issues are deconstructed mathematically: Profit = Revenue (Price x Volume) - Cost (Fixed Costs + Variable Costs). This allows a structured investigation to locate the exact driver of margin contraction.',
      depth:
        'Revenues split into product mix, volume, and unit pricing. Costs split into fixed overheads and variable unit costs. \n\n**When it is the WRONG choice:** The Profitability Framework is the wrong choice when: (1) The decline in profits is driven by a structural shift or technology disruption (e.g. digital streaming killing physical DVD sales). Simply deconstructing price and cost does not capture the shift in customer preferences. (2) The problem is strategic, such as a competitive response or regulatory shift, where volume changes are driven by market access rather than price-elasticity. (3) The firm is a platform business focused on network effects rather than immediate margins. In these cases, use a **Competitive Response** or **Platform Ecosystem** issue tree.'
    }
  },
  {
    id: 'cons-market-entry',
    title: 'Market Entry Framework (*)',
    category: 'Problem Solving',
    altitude: {
      hook: 'Evaluate new market opportunities across size, competitive intensity, capabilities, and entry modes.',
      plain:
        'Market Entry structures the decision of entering a new market: market size/growth, competitive landscape, company capabilities, and entry modes (organic build, acquisition, joint venture, licensing).',
      depth:
        'Key considerations: Market attractiveness (TAM, growth rate, margins, barriers to entry), Competitive intensity (share, moats, pricing power), Company capabilities (financial, operational, channels), and Financial feasibility (ROI, NPV). \n\n**When it is the WRONG choice:** Market Entry is the wrong framework when: (1) The entry is defensive, meant to block a competitor from scaling rather than generating positive standalone profits (e.g. Google launching Google+ to defend search). (2) The market is highly uncertain and requires an agile, iterative product pilot (Lean startup approach) rather than a heavy capital commitment. In these cases, a custom structure analyzing **Strategic Defense** or **Proof of Concept Pilot** is far stronger.'
    }
  },
  {
    id: 'cons-3c-4c',
    title: '3Cs / 4Cs Framework (*)',
    category: 'Problem Solving',
    altitude: {
      hook: 'Analyze strategic business contexts across Company, Customers, and Competitors.',
      plain:
        'The 3Cs framework balances internal analysis (Company capabilities, products, costs) with external forces (Customer segments, needs, and Competitor positions, market share). 4Cs adds Collaborators or Climate.',
      depth:
        'Company: financial resources, brand, core competencies, product line. Customers: demographics, purchase drivers, segments, lifetime value. Competitors: market share, strengths, cost structure, value proposition. \n\n**When it is the WRONG choice:** The 3Cs is the wrong choice in: (1) Multi-sided platform businesses (e.g., Uber, iOS App Store) where value is co-created by developers and users, and network effects dictate outcomes. Traditional Customer-Competitor separations blur because users and partners are on the same platform. (2) Heavy supply-constrained or regulatory environments where government or supplier dynamics dominate, which requires a custom **Value Chain** or **PESTEL** structure.'
    }
  },
  {
    id: 'cons-porter-five',
    title: 'Porter\'s Five Forces (*)',
    category: 'Industry Analysis',
    altitude: {
      hook: 'Determine the long-term structural attractiveness and profitability potential of an industry.',
      plain:
        'Porter\'s Five Forces maps competitive intensity across: Threat of New Entrants, Bargaining Power of Buyers, Bargaining Power of Suppliers, Threat of Substitutes, and Rivalry among existing competitors.',
      depth:
        'Porter\'s model explains why some industries (like software) are structurally highly profitable, while others (like airlines) struggle to return WACC. \n\n**When it is the WRONG choice:** Porter\'s Five Forces is a static, industry-level tool. It is the wrong choice when: (1) Evaluating rapid, cross-industry technology disruptions (e.g., smart phones disrupting cameras, maps, and music players simultaneously). (2) The firm\'s competitive advantage is driven by internal competencies and cultural execution (Resource-Based View) rather than industry structure. (3) The firm operates in a dynamic ecosystem where borders between suppliers and competitors blur daily (coopetition). A custom structure focusing on **Platform Ecosystem Economics** is much stronger.'
    }
  },
  {
    id: 'cons-value-chain',
    title: 'Value Chain Analysis',
    category: 'Problem Solving',
    altitude: {
      hook: 'Trace activities from raw materials to customer delivery to identify margin levers.',
      plain:
        'Value Chain Analysis divides firm activities into Primary (Inbound logistics, operations, outbound logistics, marketing, service) and Support (HR, tech, procurement, infrastructure) to optimize margin creation.',
      depth:
        'Primary activities directly transform inputs into customer value. Support activities provide the underlying infrastructure. By mapping costs and value added to each step, consultants identify where the firm is uncompetitive, where outsourcing is viable (make-vs-buy), and where vertical integration can capture additional margin.'
    }
  },
  {
    id: 'cons-cost-reduction',
    title: 'Cost Reduction Framework',
    category: 'Problem Solving',
    altitude: {
      hook: 'Systematic approach to cost rationalization — fixed vs. variable cost structures.',
      plain:
        'Cost reduction requires deconstructing costs: Fixed Costs (real estate, corporate overhead) vs. Variable Costs (raw materials, direct labor). Consultants look to eliminate, reduce, or substitute activities.',
      depth:
        'Fixed costs can be rationalized through property consolidation, shared service centers, and administrative headcount reduction. Variable costs are addressed through strategic sourcing, vendor renegotiation, lean manufacturing, and product design adjustments (value engineering). The danger is cutting costs that dilute product quality or customer retention.'
    }
  },
  {
    id: 'cons-merger-eval',
    title: 'M&A Evaluation Framework',
    category: 'Problem Solving',
    altitude: {
      hook: 'A structured approach to evaluating the strategic and financial merits of an acquisition.',
      plain:
        'M&A evaluation structures a deal across three phases: Strategic Rationale (why buy?), Financial Valuation (how much to pay?), and Integration Feasibility (how to merge?).',
      depth:
        'Strategic rationale targets market expansion, product additions, or synergy generation. Valuation uses DCF, comparable comps, and LBO modeling. Integration evaluates culture fit, system alignment, and retention of key talent. Over 70% of mergers destroy value because integration risks are underestimated during diligence.'
    }
  },
  {
    id: 'cons-pricing-framework',
    title: 'Pricing Framework',
    category: 'Problem Solving',
    altitude: {
      hook: 'Optimize unit economics by aligning price with customer value, competition, or cost.',
      plain:
        'Pricing decisions are structured around three models: Cost-Plus Pricing (cost + margin), Competitive Pricing (market matching), and Value-Based Pricing (share of customer value created).',
      depth:
        'Cost-plus ensures margins but leaves money on the table. Competitive pricing is safe but leads to commoditization. Value-based pricing is the gold standard; it models the customer\'s economic value of the next best alternative (EVC) and captures a portion of that incremental value. Pricing strategy must also account for elasticity and channel margins.'
    }
  },
  {
    id: 'cons-prioritization',
    title: 'Impact-Effort Matrix',
    category: 'Problem Solving',
    altitude: {
      hook: 'Filter ideas into actionable execution buckets — quick wins vs. major projects.',
      plain:
        'The Impact-Effort Matrix is a 2x2 grid plotting initiatives based on expected Business Impact (vertical) vs. Implementation Effort (horizontal). It filters ideas into quick wins, major projects, fill-ins, and thankless tasks.',
      depth:
        'High Impact, Low Effort = Quick Wins (execute immediately). High Impact, High Effort = Major Projects (schedule and budget carefully). Low Impact, Low Effort = Fill-ins (do when idle). Low Impact, High Effort = Thankless Tasks (eliminate/deprioritize). It aligns management teams around priorities and ensures resource efficiency.'
    }
  },
  {
    id: 'cons-custom-structuring',
    title: 'Custom Case Structuring',
    category: 'Problem Structuring',
    altitude: {
      hook: 'Frameworks are vocabulary, not scripts — build custom issue trees live for top performance.',
      plain:
        'Top candidates win case competitions and interviews not by memorizing frameworks, but by building custom, MECE issue trees tailored to the specific industry and business situation of the case.',
      depth:
        'To build a custom structure: (1) Clarify the objectives, timeline, and boundary conditions. (2) Draft a MECE first level based on the core business driver (e.g. for a hospital: Outpatient Revenue vs Inpatient Revenue vs Operating Overheads). (3) Add industry-specific metrics (e.g. bed occupancy rate, average length of stay, clinical staff ratios). This signals true business acumen rather than framework memorization.'
    }
  }
];

export const consultingCase: CaseContent = {
  date: '2024-06-15',
  company: 'IndiGo (InterGlobe Aviation)',
  sector: 'Aviation / Transport',
  background:
    "IndiGo is India's largest airline by market share (62% as of April 2024) and one of the few consistently profitable carriers globally in a structurally loss-making industry. Despite this, it faces a fleet grounding crisis (Pratt & Whitney GTF engine inspections affecting ~70 aircraft) and a customer experience reputation gap vs. Air India\'s post-Tata restructuring.",
  dataExhibits: [
    {
      parameter: 'IndiGo domestic market share (April 2024)',
      value: '62.4%',
      source: { id: 1, source: 'DGCA Monthly Traffic Statistics', date: '2024-04' },
      sensitivity: 'Medium — sticky but Air India growing',
    },
    {
      parameter: 'Aircraft grounded (P&W engine issues)',
      value: '~70 planes',
      source: { id: 2, source: 'IndiGo Management Commentary Q4FY24', date: '2024-05' },
      sensitivity: 'High — capacity and cost impact',
    },
    {
      parameter: 'IndiGo revenue FY24',
      value: 'Rs. 71,935 Cr',
      source: { id: 3, source: 'IndiGo FY24 Annual Results', date: '2024-05' },
      sensitivity: 'Low (reference point)',
    },
  ],
  dilemma:
    "IndiGo's strategic dilemma: its low-cost carrier (LCC) model has been optimized for point-to-point domestic travel. Air India post-Tata is targeting the full-service carrier (FSC) segment with massive investment. As India's aviation market matures and premium demand grows, should IndiGo launch a separate premium subsidiary (as it announced with 'IndiGo Stretch') or risk cannibalizing its cost-discipline advantage by trying to serve two very different customer segments within one airline?",
  stakeholders: [
    { name: 'InterGlobe shareholders', role: 'Investors', interest: 'EBITDAR margin protection, growth optionality' },
    { name: 'Air India (Tata)', role: 'Competitor', interest: 'Premium market capture, international growth' },
    { name: 'Pratt & Whitney', role: 'Engine OEM', interest: 'Managing inspection liability, compensation exposure' },
    { name: 'DGCA', role: 'Regulator', interest: 'Safety compliance, capacity adequacy for demand' },
    { name: 'Business travelers', role: 'High-value customer segment', interest: 'Reliability, comfort, connectivity' },
  ],
  lenses: {
    strategy: "LCC and FSC are fundamentally different business models with different cost structures, talent requirements, and customer acquisition strategies. Southwest's failed premium push in the US and Ryanair's consistency as a pure LCC argue for focused positioning. IndiGo's moat is operational cost discipline — a premium sub-brand dilutes management attention. The strategic question: is the revenue opportunity from premium large enough to justify the complexity cost?",
    finance: 'The P&W engine grounding imposes wet-lease costs of approximately $150,000-$200,000 per aircraft per month. At 70 aircraft, this is $10-14 Mn per month in incremental unplanned cost. IndiGo\'s FY24 EBITDAR was approximately Rs. 15,000 crore — the grounding impacts approximately 8-10% of EBITDAR. Pratt & Whitney compensation negotiations are critical to financial outcome.',
    marketing: "IndiGo's brand perception gap vs. Air India in the premium segment is real but overstated. In fare-sensitivity surveys, 70%+ of business travelers on domestic routes prioritize schedule reliability over seat comfort. IndiGo's on-time performance (OTP historically ~85-88%) is the brand's most defensible marketing asset.",
    operations: "The P&W engine crisis is an operational emergency requiring: (a) slot protection with DGCA, (b) wet-lease aircraft from Turkish Airlines and other carriers, (c) aggressive sub-charter arrangements. The long-term fleet strategy requires accelerating Airbus A320neo orders or diversifying to Boeing 737 MAX to reduce single-engine OEM concentration.",
  },
  recommendation:
    'Recommend against a premium sub-brand launch in this environment: the engine crisis demands full management attention; the capital required for premium service infrastructure (lounge, widebody fleet) is better deployed in network expansion to underserved tier-2/3 routes where IndiGo has natural LCC advantage. Revisit premium segmentation in FY27 once P&W crisis is resolved and fleet normalized.',
  commonMistakes: [
    'Diagnosing IndiGo\'s challenge as solely an engine problem — it is also a strategic positioning decision for the next decade of Indian aviation growth.',
    'Assuming premium aviation in India requires a full FSC model — a hybrid "premium economy" approach (better seats, no lounge, same IndiGo reliability) may capture 80% of the revenue with 20% of the cost.',
    'Ignoring the international aviation opportunity — IndiGo\'s international capacity addition (London, Amsterdam, etc.) is potentially the highest-return use of new widebody aircraft.',
  ],
  citations: [
    { id: 1, source: 'DGCA Monthly Traffic Statistics', date: '2024-04' },
    { id: 2, source: 'IndiGo Management Commentary Q4FY24', date: '2024-05' },
    { id: 3, source: 'IndiGo FY24 Annual Results', date: '2024-05' },
  ],
}

export const consultingHotTopic: HotTopicContent = {
  date: '2024-06-15',
  headline: 'McKinsey, BCG, Bain Cut Associate Intake by 15-30% in 2024',
  whatHappened:
    'All three top-tier strategy consulting firms reduced MBA associate intake in 2024 by an estimated 15-30% versus 2022 peaks. The slowdown follows a post-pandemic correction in consulting demand from technology sector clients and a shift in client priorities from transformation projects to cost-cutting mandates.',
  rootCause:
    'Three compounding factors: (1) Tech sector pullback — Big Tech cut consulting spend sharply after 2022 hiring freezes; tech clients represented 20-25% of MBB revenue in peak years. (2) AI disruption of traditional consulting delivery — data analysis, benchmarking, and research tasks (entry-level associate work) are increasingly automated. (3) Margin pressure on consulting firms themselves — client pushback on daily rates as procurement gets more sophisticated.',
  stakeholders: [
    { name: 'MBA candidates', gains: 'Higher bar raises prestige of offer for those who get it', loses: 'Fewer absolute slots; higher competition ratio' },
    { name: 'Consulting firms', gains: 'Improved leverage ratio (fewer associates per partner)', loses: 'Talent pipeline gaps in 3-5 years if intake stays low' },
    { name: 'Business schools', gains: 'Nothing; placement rate drops are reputationally damaging', loses: 'Consulting placement as a selling point; career office re-prioritization needed' },
    { name: 'Alternative employers (PE, corporate strategy)', gains: 'Access to top MBA talent previously hoovered by MBB', loses: 'Increased competition among themselves for this talent' },
  ],
  businessImplications:
    'For Indian MBA aspirants specifically: IIM A/B/C placement patterns will shift; consulting continues to be available but roles go to a smaller, more exceptional cohort. The signal for preparation: technical rigor (data, AI literacy, financial modeling) is now as important as case-cracking ability.',
  scenarios: [
    { label: 'Best', description: 'AI augmentation increases per-consultant productivity; consulting revenue recovers; intake rebounds to 2022 levels by 2026.' },
    { label: 'Worst', description: 'Consulting is structurally disrupted; 40% of current associate-level work is automated by 2027; firm business models restructure toward fewer, more senior engagements.' },
    { label: 'Likely', description: 'Gradual rebound in 2025-2026 as corporate capex recovers; intake stabilizes 10-15% below 2022 peak; AI-human hybrid delivery becomes the new normal.' },
  ],
  citations: [
    { id: 1, source: 'Bloomberg, Consulting Hiring Slowdown Coverage', date: '2024-05' },
    { id: 2, source: 'Management Consulted, MBB Recruiting Trends Report', date: '2024' },
  ],
}

export const consultingThink: ThinkContent = {
  date: '2024-06-15',
  question: "Your client, a profitable Rs. 2,000 crore revenue mid-size FMCG company, is losing market share in its core biscuit category in three states. The CEO wants to know: 'Is this a me problem or a market problem?' How do you structure the investigation?",
  modelAnswer: {
    hook: "Before prescribing a solution, establish whether the patient is sick or the environment is hostile.",
    plain:
      "The CEO's question is precisely the right diagnostic starting point. 'Me problem' = the company is underperforming the category. 'Market problem' = the category itself is declining or being disrupted. The answer changes everything: a market problem requires portfolio pivoting; a company problem requires operational fixes.",
    depth:
      "MECE investigation structure: Layer 1 — Is the category growing or shrinking in the three affected states? Pull IRI/NielsenIQ or FMCG distributor data. If category is flat/growing but your client is losing share, it is a 'me problem.' If category is declining, it may be a 'market problem' (health trends shifting away from biscuits, or quick-service snack substitutes). Layer 2 — If 'me problem': is it distribution (numeric distribution vs. weighted distribution trends), pricing (relative to key competitors), product (consumer rejection in blind taste tests or complaints), or promotion (share of voice vs. share of market correlation)? Layer 3 — Is the issue all three states equally or specific to one? Geographic concentration narrows the root cause (could be a specific distributor failure, regional competitor move, or state-specific regulatory issue). Prioritization: tackle the largest revenue-at-risk state first. Quick win to demonstrate momentum: if distribution drop is identified in state 1, an emergency retailer fill-rate audit and distributor reset can show results in 60 days.",
  },
  alternatePerspective:
    "The CEO's binary framing ('me' vs. 'market') is too clean. In practice, market shifts often expose pre-existing company weaknesses. A category may be shifting to premium variants (market problem) that the client failed to develop because of internal R&D underinvestment (company problem). The real answer is often 'both, with different weights' — and the consultant's job is to quantify those weights.",
  citations: [
    { id: 1, source: "Nielsen, FMCG Market Dynamics India Report", date: '2023' },
  ],
}

export const consultingLibrary: LibraryEntry[] = [
  {
    id: 'lib-cons-1',
    title: 'The Pyramid Principle',
    author: 'Barbara Minto',
    year: 1987,
    tags: ['consulting'],
    description: "The foundational text for consulting communication structure. MECE thinking, SCR (Situation-Complication-Resolution) storytelling, and pyramid logic for presentations.",
    pages: 228,
  },
  {
    id: 'lib-cons-2',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    year: 2011,
    tags: ['consulting', 'people'],
    description: "System 1 vs. System 2 thinking framework — the cognitive foundation for understanding how consultants and clients make decisions. Essential for structuring recommendations that overcome cognitive bias.",
    pages: 499,
  },
]

export const consultingCompany: CompanySpotlightContent = {
  companyName: 'Tata Consultancy Services',
  identity: 'Global information technology services, consulting, and business solutions provider',
  founded: 1968,
  headquarters: 'Mumbai, Maharashtra, India',
  metrics: [
    { label: 'Market Capitalization', value: 'Rs. 13,85,000 Cr', asOf: 'June 2026', citationId: 101 },
    { label: 'FY25 Reported Revenue', value: 'Rs. 2,45,220 Cr', asOf: 'March 2025', citationId: 102 },
    { label: 'Operating (EBIT) Margin', value: '24.6%', asOf: 'March 2025', citationId: 102 },
    { label: 'Employee Attrition Rate', value: '12.5%', asOf: 'December 2025', citationId: 103 }
  ],
  competitors: [
    { name: 'Infosys', positioningNote: 'Primary peer in IT consulting, positioning itself on high-end digital transformation and cloud services.' },
    { name: 'Cognizant', positioningNote: 'US-headquartered global competitor, utilizing offshore Indian delivery networks with direct local relationship offices.' }
  ],
  industryContext: 'The global IT services market exceeds USD 1.2 Trillion (2025) and is transitioning from legacy application maintenance to cloud integration, cybersecurity, and generative AI deployments. Talent retention and wage inflation are the major supply-side margin drivers.',
  functionLens: 'TCS faces a classic consulting strategic dilemma: how to transition its business model from linear, effort-based IT service billing (cost per software engineer hour) to non-linear, outcome-based software value creation. Historically, its massive offshore delivery model (leveraging cost arbitrage in India) produced steady 24% EBIT margins. However, generative AI automation tools threaten to automate entry-level software coding tasks, which represents a large share of billable hours. Consultants evaluating TCS focus on the "diseconomies of scale" of managing over 6,00,000 employees. The company\'s current mandate is reskilling its entire labor force in AI competencies while shifting its value proposition upmarket toward strategic business consulting and custom platform solutions.',
  whyItMatters: 'TCS is the benchmark for managing human capital arbitrage and digital disruption. Use TCS in a case discussion to explain the risks of the "innovator\'s dilemma" when a highly profitable business model is disrupted by low-cost automation, and how matrix organizations restructure to defend margins.',
  citations: [
    { id: 101, source: 'NSE Market Valuation Records', date: '2026-06' },
    { id: 102, source: 'TCS FY25 Financial Statements', date: '2025-04' },
    { id: 103, source: 'NASSCOM India IT Sector Report', date: '2025-12' }
  ]
};
