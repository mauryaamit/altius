import type { ConceptEntry, CaseContent, HotTopicContent, ThinkContent, LibraryEntry, CompanySpotlightContent } from './types'

export const operationsConcepts: ConceptEntry[] = [
  {
    id: 'ops-lean',
    title: 'Lean and the 8 Wastes',
    category: 'Process Excellence',
    altitude: {
      hook: 'Lean focuses on maximizing customer value while minimizing waste — eliminate Muda to drive efficiency.',
      plain:
        'Lean manufacturing identifies waste (activities that consume resources but add no customer value) and systematically removes it. The 8 wastes (Muda) are: Transportation, Inventory, Motion, Waiting, Overproduction, Overprocessing, Defects, and Non-utilized Talent (DOWNTIME).',
      depth:
        'Lean originated in the Toyota Production System (TPS). Overproduction is considered the worst waste because it hides other problems. Lean principles: Value, Value Stream, Flow, Pull, Perfection. Tools include 5S (Sort, Set in order, Shine, Standardize, Sustain), Kanban (pull-based signal cards), and Kaizen (continuous improvement).'
    }
  },
  {
    id: 'ops-six-sigma',
    title: 'Six Sigma & DMAIC',
    category: 'Process Excellence',
    altitude: {
      hook: 'Six Sigma targets defect reduction through statistical variation control — target 3.4 defects per million opportunities.',
      plain:
        'Six Sigma is a disciplined, data-driven methodology for eliminating defects in any process. The standard roadmap is DMAIC: Define, Measure, Analyze, Improve, Control.',
      depth:
        'Six Sigma uses statistical metrics: a six-sigma process is 99.99966% defect-free (3.4 defects per million opportunities - DPMO). DMAIC phases: Define customer requirements; Measure process performance; Analyze data to find root causes of variation; Improve process by eliminating causes; Control future performance using monitoring tools (SPC charts).'
    }
  },
  {
    id: 'ops-toc',
    title: 'Theory of Constraints (TOC)',
    category: 'Capacity Management',
    altitude: {
      hook: 'Every system has one bottleneck that limits total throughput — find and optimize it.',
      plain:
        'The Theory of Constraints states that any manageable system is limited in achieving more of its goals by a very small number of constraints (bottlenecks). The 5 focusing steps: Identify, Exploit, Subordinate, Elevate, Repeat.',
      depth:
        'Popularized by Eliyahu Goldratt in "The Goal" (1984). Yield / Throughput is governed strictly by the bottleneck. (1) Identify the constraint. (2) Exploit: maximize the constraint\'s uptime (never let it sit idle). (3) Subordinate: align all other processes to match the constraint\'s pace (prevents inventory piles). (4) Elevate: invest to expand capacity at the constraint. (5) Repeat.'
    }
  },
  {
    id: 'ops-inventory',
    title: 'JIT vs. Safety Stock Trade-offs',
    category: 'Supply Chain',
    altitude: {
      hook: 'Just-in-Time minimizes holding costs, while Safety Stock protects against supply disruption.',
      plain:
        'Firms must balance carrying costs against stockout costs. Just-in-Time (JIT) targets zero inventory by coordinating delivery exactly when needed. Safety stock keeps buffer inventory to manage demand spikes and lead-time delays.',
      depth:
        'JIT (pull system) requires high supplier reliability and stable manufacturing quality; any failure stops the line. Safety stock (push system) calculates buffer level based on demand volatility and service level targets. Holding costs include warehousing, capital costs, insurance, and obsolescence. Stockout costs include lost sales, expedite fees, and customer churn.'
    }
  },
  {
    id: 'ops-capacity',
    title: 'Capacity Utilization and Throughput',
    category: 'Capacity Management',
    altitude: {
      hook: 'Capacity utilization measures how close a factory runs to its maximum output capability.',
      plain:
        'Capacity Utilization = (Actual Output / Potential Output) x 100%. Throughput is the rate at which the system generates money through sales (not output). Little\'s Law states Inventory = Throughput x Flow Time.',
      depth:
        'While high capacity utilization reduces unit costs by spreading fixed overheads, running at 100% capacity creates queueing bottlenecks, delays, and zero flexibility. Little\'s Law: Inventory = Throughput Rate x Flow Time. Decreasing lead time requires reducing work-in-progress (WIP) inventory, directly improving capital efficiency.'
    }
  },
  {
    id: 'ops-tqm',
    title: 'Total Quality Management (TQM)',
    category: 'Process Excellence',
    altitude: {
      hook: 'Quality is everyone\'s job — TQM embeds process excellence across all organizational layers.',
      plain:
        'Total Quality Management is an organization-wide management approach centered on continuous quality improvement, customer satisfaction, and active participation of all employees.',
      depth:
        'TQM principles: Customer-focused, total employee involvement, process-centered, integrated system, systematic and strategic approach, continual improvement, fact-based decision making, communications. TQM utilizes tools like Ishikawa diagrams (fishbone charts for root cause), Pareto analysis (80/20 rule), and control charts.'
    }
  },
  {
    id: 'ops-supply-chain',
    title: 'Supply Chain Design Trade-offs',
    category: 'Supply Chain',
    altitude: {
      hook: 'Efficiency vs. Responsiveness — design your supply chain to match your product type.',
      plain:
        'Supply chain network design must choose between an Efficient Supply Chain (low cost, high utilization, bulk sourcing) and a Responsive Supply Chain (speed, flexibility, local sourcing).',
      depth:
        'Marshall Fisher\'s framework: Functional products (e.g. soap, basic clothing) have predictable demand and require an Efficient Supply Chain (minimize physical costs). Innovative products (e.g. high fashion, smartphones) have volatile demand and require a Responsive Supply Chain (minimize market mediation costs like markdowns and stockouts). Postponement strategies delay final product customization to minimize inventory risk.'
    }
  },
  {
    id: 'ops-eoq',
    title: 'Economic Order Quantity (EOQ)',
    category: 'Supply Chain',
    altitude: {
      hook: 'Solve the inventory puzzle — calculate the order size that minimizes total inventory costs.',
      plain:
        'EOQ is a classic inventory model that calculates the optimal order size: EOQ = sqrt((2 x Demand x Setup Cost) / Holding Cost). It balances ordering costs against carrying costs.',
      depth:
        'EOQ model assumptions: demand is constant, lead time is fixed, no stockouts allowed, unit price is constant. Reorder Point (ROP) is the inventory level that triggers a new order: ROP = Lead Time Demand + Safety Stock. While simple, EOQ provides the conceptual baseline for calculating economic batch sizes and cycle stock requirements.'
    }
  },
  {
    id: 'ops-raci',
    title: 'RACI Matrix',
    category: 'Process Excellence',
    altitude: {
      hook: 'Who does what? RACI clarifies roles and responsibilities across complex projects.',
      plain:
        'RACI is a responsibility assignment matrix that charts task ownership: Responsible (who does the work), Accountable (who owns the outcome), Consulted (who provides input), and Informed (who is kept updated).',
      depth:
        'Rules of RACI: There must be exactly one \'Accountable\' person per task to prevent ownership dilution. Responsible parties execute the task. Consulted parties are subject matter experts. Informed parties receive progress notifications. RACI avoids duplicate efforts and decision bottlenecks in matrixed organisations.'
    }
  },
  {
    id: 'ops-process-mapping',
    title: 'Process Mapping & VSM',
    category: 'Process Excellence',
    altitude: {
      hook: 'Visualize the flow of materials and information to isolate non-value-added activities.',
      plain:
        'Process Mapping and Value Stream Mapping (VSM) are visual tools that document every step in a process from customer request to delivery. VSM explicitly categorizes steps as value-adding or non-value-adding.',
      depth:
        'VSM records processing time (PT) and lead time (LT). Lead time includes the time materials sit in queues waiting to be processed. The Process Cycle Efficiency = (Total Processing Time / Total Lead Time) x 100%. In most un-optimized systems, value-adding time represents less than 5% of total lead time, indicating where improvements should target.'
    }
  },
  {
    id: 'ops-triangle',
    title: 'Quality-Cost-Speed Triangle',
    category: 'Capacity Management',
    altitude: {
      hook: 'Good, fast, cheap — choose two. The fundamental trade-off in operational execution.',
      plain:
        'The operational triple constraint states that you cannot optimize Quality, Cost, and Speed simultaneously. A change in one vector forces adjustments in the other two.',
      depth:
        'Fast + Cheap = lower quality. Fast + High Quality = high cost. Cheap + High Quality = slow speed. Operations strategy requires defining which vector is the firm\'s order winner (e.g., Apple wins on quality, Zara wins on speed, Walmart wins on cost) and aligning the operational envelope to support that choice.'
    }
  },
  {
    id: 'ops-make-vs-buy',
    title: 'Make-vs-Buy Framework',
    category: 'Supply Chain',
    altitude: {
      hook: 'To build in-house or outsource? Decide based on strategic control and cost.',
      plain:
        'The Make-vs-Buy framework structures outsourcing decisions. It compares financial costs (internal CapEx/OpEx vs vendor pricing) against strategic control (IP risk, quality management, supply security).',
      depth:
        'Core activities (which define the firm\'s strategic moat or VRIN capabilities) should always be made in-house. Commodity activities (where scale economies exist for third-party vendors) should be outsourced to reduce costs. Transaction Cost Economics (Coase/Williamson) argues that asset specificity and high transaction costs indicate keeping activities in-house.'
    }
  },
  {
    id: 'ops-agile-waterfall',
    title: 'Agile vs. Waterfall',
    category: 'Capacity Management',
    altitude: {
      hook: 'Sequential development vs. iterative sprints — choose the method that fits your project volatility.',
      plain:
        'Waterfall is a sequential project management style (Requirements -> Design -> Build -> Test -> Deploy). Agile is iterative, utilizing cross-functional sprints to deliver incremental value (MVP) and adapt to user feedback.',
      depth:
        'Waterfall works best when requirements are fixed, predictable, and safety-critical (construction, hardware). Agile works best in high-uncertainty environments (software, digital services). Hybrid approaches (e.g. hardware-agile) separate core physical platforms from fast-changing software layers.'
    }
  }
];

export const operationsCase: CaseContent = {
  date: '2024-06-15',
  company: 'Zomato / Blinkit',
  sector: 'Quick Commerce / Logistics',
  background:
    'Zomato acquired Blinkit (formerly Grofers) in 2022 for Rs. 4,447 crore and has since scaled it to 600+ dark stores across 40+ cities. By Q4FY24, Blinkit GOV (Gross Order Value) reached Rs. 4,923 crore, growing 97% YoY, with Zomato guiding toward 2,000 dark stores and EBITDA breakeven at the Blinkit level.',
  dataExhibits: [
    {
      parameter: 'Blinkit dark stores (March 2024)',
      value: '619 stores',
      source: { id: 1, source: 'Zomato Q4FY24 Results Presentation', date: '2024-05' },
      sensitivity: 'Medium — expansion pace is a key variable',
    },
    {
      parameter: 'Blinkit GOV Q4FY24',
      value: 'Rs. 4,923 Cr',
      source: { id: 1, source: 'Zomato Q4FY24 Results Presentation', date: '2024-05' },
      sensitivity: 'High — top-line driver',
    },
    {
      parameter: 'Average order value (Blinkit)',
      value: 'Rs. 646',
      source: { id: 1, source: 'Zomato Q4FY24 Results Presentation', date: '2024-05' },
      sensitivity: 'High — determines contribution margin per order',
    },
  ],
  dilemma:
    'The quick-commerce (q-comm) war between Blinkit, Zepto, and Swiggy Instamart is intensifying. All three are burning capital to win the dark store land grab. The operational dilemma for Blinkit: should it optimize for contribution margin per order (unit economics discipline) or sacrifice near-term margin to maximize dark store count and geographic coverage before Zepto or Swiggy lock in key neighborhoods?',
  stakeholders: [
    { name: 'Zomato shareholders', role: 'Public investors', interest: 'Path to profitability, not just growth' },
    { name: 'Zepto / Swiggy', role: 'Direct competitors', interest: 'Win the dark store land grab before funding dries up' },
    { name: 'FMCG brand partners', role: 'Distribution partners', interest: 'Shelf space, sales velocity, promotional ROI in q-comm channel' },
    { name: 'Kirana stores', role: 'Incumbent channel', interest: 'Survival; potential partnership vs. competition' },
    { name: 'Dark store employees', role: 'Operations staff', interest: 'Job security, safety, wage stability' },
  ],
  lenses: {
    strategy: 'Q-comm has winner-take-most (not winner-take-all) dynamics because delivery radius is geographic — neighborhood-level competition is the real unit of analysis, not city-level. Blinkit\'s 619-store footprint gives it first-mover density advantage in tier-1 metros. The strategic question is whether tier-2 expansion (Bhopal, Indore, Nagpur) yields sufficient AOV and order frequency to justify dark store economics or whether Blinkit should deepen tier-1 before spreading thin.',
    finance: 'Dark store unit economics: a 2,000 sq ft dark store requires Rs. 25-30 lakh capex (fit-out, equipment) + Rs. 15-20 lakh monthly fixed cost (rent, staff, utilities). At Rs. 646 AOV and 20% take rate (Rs. 130/order), a store needs ~115-150 orders/day to cover fixed costs. Blinkit\'s average at mature stores is reportedly 200+ orders/day. The investment case hinges on reaching maturity within 6-9 months of a new store opening.',
    marketing: 'Q-comm success depends on product selection depth (SKU range) as much as speed. Blinkit\'s differentiation from traditional e-commerce is the 10-minute promise, not just next-day. Marketing investment in high-value categories (electronics, beauty, toys — "non-grocery" expansion) increases AOV and margin mix without increasing dark store count.',
    operations: 'The operations moat in q-comm is inventory management: prediction of which 5,000-8,000 SKUs to stock in each 2,000 sq ft dark store serving a hyper-local catchment. Overstocking increases spoilage (groceries); understocking increases order cancellation rate. ML-based demand forecasting at SKU x store x hour granularity is the operational IP that determines profitability.',
  },
  recommendation:
    'Recommended: optimize tier-1 dark store density and maturity for 2 quarters before accelerating tier-2 expansion. Invest in SKU expansion in high-margin categories (beauty, electronics) to drive AOV toward Rs. 750 target. The contribution margin inflection at mature stores de-risks the equity story for investors more than raw store count growth.',
  commonMistakes: [
    'Treating q-comm purely as a food/grocery play — the real margin expansion is in non-grocery categories.',
    'Assuming dark store expansion = linear revenue growth — new stores have 4-6 month ramp periods; modeling straight-line growth overstates near-term revenue.',
    'Ignoring the regulatory risk: FSSAI and municipal regulations on dark store operations in residential areas are an emerging friction point.',
  ],
  citations: [
    { id: 1, source: 'Zomato Q4FY24 Results Presentation', date: '2024-05' },
  ],
}

export const operationsHotTopic: HotTopicContent = {
  date: '2024-06-15',
  headline: 'India\'s Semiconductor Mission: Rs. 76,000 Crore PLI Approved for Three Fab Projects',
  whatHappened:
    'The Union Cabinet approved semiconductor fabrication projects by Tata Electronics (fab + OSAT), CG Power (OSAT in partnership with Renesas), and Kaynes Semicon (OSAT). Total investment committed: Rs. 1.26 lakh crore; government incentive support under the India Semiconductor Mission: Rs. 76,000 crore.',
  rootCause:
    'Post-2020 chip shortage exposed India\'s complete absence from global semiconductor supply chains. India imports $45-50 Bn of semiconductors annually. The PLI scheme (Production-Linked Incentive) and global supply chain diversification trends (China + 1, friend-shoring) created a policy and business window.',
  stakeholders: [
    { name: 'Tata Group', gains: 'Strategic anchor in semiconductor manufacturing; supply to Tata Motors, Apple supply chain', loses: 'Execution risk on a highly complex greenfield project' },
    { name: 'Apple / iPhone supply chain', gains: 'India-made chip packaging reduces geopolitical concentration risk', loses: 'Nothing material; optionality benefit only' },
    { name: 'Indian electronics OEMs', gains: 'Eventual domestic chip supply; reduced import dependency', loses: 'Nothing in near-term; 4-5 years for operational fabs' },
    { name: 'Taiwan (TSMC)', gains: 'Potential JV / tech transfer partner opportunity', loses: 'Some long-run competitive exposure' },
    { name: 'Government of India', gains: 'Technology sovereignty narrative, job creation', loses: 'Rs. 76,000 crore subsidy obligation' },
  ],
  businessImplications:
    'Operations implication: semiconductor manufacturing is the most complex manufacturing process in the world. Yield rates at new fabs typically run at 50-60% in Year 1, rising to 80-90% only at maturity. Tata\'s success depends on technology partnerships (Powerchip, PSMC from Taiwan), workforce development, and supply chain for specialty chemicals and equipment.',
  scenarios: [
    { label: 'Best', description: 'All three projects execute on schedule (2026-2027); India captures 5-7% of global OSAT market by 2030; domestic semiconductor design ecosystem (fabless companies, EDA tools) grows in parallel.' },
    { label: 'Worst', description: 'Execution delays of 2-3 years; yield ramp challenges; global chip glut (cyclical) reduces economic case for new fabs; government subsidy absorbs cost without commensurate output.' },
    { label: 'Likely', description: 'OSAT projects by CG Power and Kaynes succeed within 3 years; Tata fab is the harder bet — likely 12-18 month delay; India becomes a meaningful OSAT player (chip packaging) before advancing to advanced node fabrication.' },
  ],
  citations: [
    { id: 1, source: 'Ministry of Electronics & IT, India Semiconductor Mission Press Release', date: '2024-02' },
    { id: 2, source: 'India Semiconductor Association, Industry Report', date: '2023' },
  ],
}

export const operationsThink: ThinkContent = {
  date: '2024-06-15',
  question: 'A pharma company\'s manufacturing plant is running at 65% capacity utilization but is also experiencing frequent stockouts of three key products. How do you diagnose and resolve this apparent paradox?',
  modelAnswer: {
    hook: 'Aggregate capacity utilization is a misleading number — the constraint is never the plant, it is always a specific bottleneck.',
    plain:
      'This situation — idle capacity at the aggregate level but stockouts at the SKU level — is a textbook Theory of Constraints problem. The plant likely has a bottleneck at a specific machine, production line, or product changeover point that is causing the three problem SKUs to be delayed even while other lines have spare time.',
    depth:
      'Framework: Apply Theory of Constraints (TOC, Goldratt 1984) + SKU-level analysis. Step 1: Decompose the 65% utilization by product line and machine. You will likely find one or two machines at 90-100%+ utilization (the bottleneck) while others run at 40-50%. The bottleneck machine determines the plant\'s actual throughput, not the average. Step 2: Check the three stockout SKUs\'s routing — do they all pass through the bottleneck machine? If yes, the constraint is confirmed. Step 3: Apply TOC\'s Five Focusing Steps: (1) Identify the constraint, (2) Exploit it (maximize throughput through the bottleneck with no idle time), (3) Subordinate everything else to the constraint\'s needs, (4) Elevate the constraint (add capacity, shift, outsource), (5) Prevent inertia — when the bottleneck moves, find the next one. Immediate tactics: prioritize the three stockout SKUs in the production schedule; explore outsourcing (loan licensing) for bottleneck-intensive runs; improve changeover time (SMED) at the constraint machine; build a small protective buffer inventory ("buffer management" in TOC) in front of the bottleneck.',
  },
  alternatePerspective:
    'The root cause may not be operations at all — it could be demand forecasting error. If the three stockout SKUs are experiencing unanticipated demand spikes (doctor detailing success, seasonal illness, new tender), the operations team is being asked to produce volumes their forecast never planned for. Separating demand-pull from supply-push root causes is the first diagnostic question, before any capacity analysis.',
  citations: [
    { id: 1, source: 'Goldratt, The Goal', date: '1984' },
    { id: 2, source: 'Goldratt, Theory of Constraints', date: '1990' },
  ],
}

export const operationsLibrary: LibraryEntry[] = [
  {
    id: 'lib-ops-1',
    title: 'The Goal',
    author: 'Eliyahu M. Goldratt',
    year: 1984,
    tags: ['operations'],
    description: 'Theory of Constraints explained through a novel format. Alexis Rogo\'s plant turnaround is the most accessible operations management case study ever written.',
    pages: 384,
  },
  {
    id: 'lib-ops-2',
    title: 'The Toyota Way',
    author: 'Jeffrey Liker',
    year: 2004,
    tags: ['operations', 'strategy'],
    description: '14 management principles of the Toyota Production System. The definitive book on lean operations and continuous improvement culture.',
    pages: 352,
  },
]

export const operationsCompany: CompanySpotlightContent = {
  companyName: 'Zara',
  identity: 'Fast-fashion retail brand owned by global clothing conglomerate Inditex',
  founded: 1975,
  headquarters: 'Arteixo, Galicia, Spain',
  metrics: [
    { label: 'Inditex Valuation (Market Cap)', value: 'EUR 145 Billion', asOf: 'June 2026', citationId: 101 },
    { label: 'FY25 Inditex Revenue', value: 'EUR 35.9 Billion', asOf: 'January 2025', citationId: 102 },
    { label: 'Average Design-to-Shelf Lead Time', value: '15 Days', asOf: 'December 2025', citationId: 103 },
    { label: 'In-Season Sourcing Proportion', value: '50-60%', asOf: 'December 2025', citationId: 103 }
  ],
  competitors: [
    { name: 'H&M', positioningNote: 'Traditional fast-fashion competitor, relying on offshore Asian manufacturing networks to minimize unit production costs.' },
    { name: 'Shein', positioningNote: 'Ultra-fast fashion e-commerce disruptor, utilizing direct-from-factory Chinese networks with real-time algorithm demand matching.' }
  ],
  industryContext: 'The global apparel market represents a highly cyclical, volatile, and trend-sensitive industry. Traditional retailers design collections 6-9 months in advance, exposing themselves to inventory mismatch and margin-eroding markdowns when trends shift.',
  functionLens: 'Zara\'s operations strategy is the gold standard for responsive supply chain design and postponement. Unlike competitors who outsource 100% of production to low-cost Asian factories, Zara manufactures 50-60% of its high-fashion, trend-sensitive items nearshore (Spain, Portugal, Morocco). Fabric is purchased undyed and only processed once in-season customer feedback is gathered at store terminals. This represents a "pull" inventory system. Production runs are kept small, generating artificial scarcity (if a product doesn\'t sell, it is not restocked; if it does, it sells out fast). This strategy minimizes inventory holding costs and eliminates heavy markdowns. Zara\'s centralized automated distribution hub in Spain processes millions of garments weekly, ensuring delivery to any store globally within 48 hours.',
  whyItMatters: 'Zara proves that proximity-sourcing and flexibility beat low-unit-cost offshoring for volatile product categories. Cite Zara to deconstruct lead-time compression, WIP inventory management, and the trade-off between physical manufacturing cost and market mediation cost.',
  citations: [
    { id: 101, source: 'Madrid Stock Exchange Valuation Data', date: '2026-06' },
    { id: 102, source: 'Inditex Annual Report FY25', date: '2025-03' },
    { id: 103, source: 'Harvard Business Review: Zara Supply Chain Case Study', date: '2025' }
  ]
};
