import type { ConceptEntry, CaseContent, HotTopicContent, ThinkContent, LibraryEntry, CompanySpotlightContent } from './types'

export const financeConcepts: ConceptEntry[] = [
  {
    id: 'fin-npv-irr',
    title: 'NPV and IRR',
    category: 'Valuation',
    altitude: {
      hook: 'Time value of money — NPV and IRR are the twin pillars of capital budgeting decisions.',
      plain:
        'Net Present Value (NPV) calculates the difference between the present value of cash inflows and outflows over time. Internal Rate of Return (IRR) is the discount rate that makes the NPV of all cash flows equal to zero. If NPV > 0 or IRR > hurdle rate, project is value-creating.',
      depth:
        'NPV assumes cash flows are reinvested at the discount rate (WACC), which is more realistic. IRR assumes cash flows are reinvested at the IRR itself, which can lead to overoptimistic projections in high-return projects. Multiple IRRs can occur when cash flows change sign more than once. Modified IRR (MIRR) resolves this by using WACC as the reinvestment rate. Capital budgeting priorities: always pick the highest NPV project over the highest IRR project if capital is constrained, as NPV measure absolute wealth creation.'
    }
  },
  {
    id: 'fin-dcf',
    title: 'Discounted Cash Flow (DCF)',
    category: 'Valuation',
    altitude: {
      hook: 'A rupee today is worth more than a rupee tomorrow — DCF quantifies exactly how much more.',
      plain:
        'DCF values a business by forecasting the cash it will generate in the future, then discounting those cash flows back to today using a rate that reflects risk (WACC). The result is the Intrinsic Value — what the business is fundamentally worth.',
      depth:
        'The three-stage DCF: (1) Forecast free cash flows (FCFF = EBIT x (1-t) + D&A - CapEx - Change in Working Capital) for 5-10 years. (2) Calculate Terminal Value (TV) using either Gordon Growth Model: TV = FCF_n x (1+g) / (WACC - g), or Exit Multiple: TV = EBITDA_n x EV/EBITDA multiple. (3) Discount all cash flows at WACC. Common DCF mistakes: extrapolating short-term growth rates into terminal value (TV often represents 60-80% of total DCF value, so this error is enormous); sensitivity analysis on WACC and terminal growth rate is mandatory — a 1% change in either can swing valuation 20-40%.'
    }
  },
  {
    id: 'fin-wacc',
    title: 'WACC and Capital Structure',
    category: 'Corporate Finance',
    altitude: {
      hook: 'WACC is the hurdle rate — any project returning less than WACC destroys shareholder value.',
      plain:
        'WACC is the blended cost of all capital a company uses, weighted by how much of each type it has. Debt is cheaper than equity because interest is tax-deductible. The optimal capital structure minimizes WACC without creating financial distress risk.',
      depth:
        'Modigliani-Miller Theorem: In a world without taxes, capital structure is irrelevant (M&M 1958). With taxes, debt creates a tax shield (M&M 1963): VL = VU + t x D. But financial distress costs and agency costs offset this — hence the Trade-Off Theory. WACC calculation requires: market-value weights (not book), after-tax cost of debt (Kd x (1-tax rate)), and cost of equity via CAPM. Beta adjustments: Hamada equation unleverages beta for pure business risk (asset beta), then re-levers for target structure.'
    }
  },
  {
    id: 'fin-comps',
    title: 'Comparable Company Analysis (Comps)',
    category: 'Valuation',
    altitude: {
      hook: 'What is the peer group trading at? Comps provides a market-based valuation benchmark.',
      plain:
        'Comparable Company Analysis (comps) values a firm by comparing its financial multiples (P/E, EV/EBITDA, EV/Sales) to a peer group of publicly traded companies in the same sector and size range.',
      depth:
        'Multipes can be Enterprise Value-based (EV/Sales, EV/EBITDA, EV/EBIT) or Equity-based (P/E, P/B). EV multiples are capital-structure neutral, making them superior for cross-company comparison. Selecting the peer group requires aligning industry focus, growth rate, margins, and geography. Comps reflects current market sentiment, but risk is that the entire sector could be overvalued (or undervalued) by the public markets.'
    }
  },
  {
    id: 'fin-precedent',
    title: 'Precedent Transactions',
    category: 'Valuation',
    altitude: {
      hook: 'What did acquirers pay historically? Precedent transactions capture control premiums.',
      plain:
        'Precedent transaction analysis values a company based on the multiples paid in historical M&A deals for similar firms. It typically yields higher valuations than trading comps because it includes a control premium.',
      depth:
        'Control premiums average 20-30% over trading share prices. Valuation multiples are derived from transaction values (e.g. EV/EBITDA paid). It is critical to adjust for the deal context: hostile vs friendly bid, cash vs stock payment, macroeconomic conditions at the time of the transaction. A transaction from 2007 (credit bubble) is less comparable than one from a normal interest rate environment.'
    }
  },
  {
    id: 'fin-cap-structure',
    title: 'Capital Structure Trade-offs',
    category: 'Corporate Finance',
    altitude: {
      hook: 'Debt vs. Equity — balancing cheap capital against insolvency risk.',
      plain:
        'Firms raise capital via debt or equity. Debt has a lower cost and interest is tax-deductible, but raises leverage and default risk. Equity is expensive and dilutive, but provides financial flexibility and has no bankruptcy triggers.',
      depth:
        'Pecking Order Theory (Myers & Majluf, 1984) states firms prefer internal cash first, then debt, and equity as a last resort due to asymmetric information. Trade-off Theory balances the tax shield benefit of debt against the expected cost of financial distress (bankruptcy costs, customer loss, credit rating downgrades). Debt covenants protect lenders but restrict management operational freedom.'
    }
  },
  {
    id: 'fin-working-capital',
    title: 'Working Capital Management',
    category: 'Corporate Finance',
    altitude: {
      hook: 'Net working capital is the cash locked in daily operations — optimize it to release cash flow.',
      plain:
        'Net Working Capital = Current Assets (ex Cash) - Current Liabilities (ex Debt). Managing it requires balancing inventory, receivables, and payables to ensure liquidity while minimizing idle capital.',
      depth:
        'Measured by Cash Conversion Cycle (CCC) = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payable Outstanding (DPO). A negative CCC (e.g., Amazon, Dell) means the firm is funded by its suppliers, which is highly cash-generative. Strategies to optimize: negotiate longer supplier terms, run lean inventory (JIT), expedite customer invoicing, and utilize receivables factoring.'
    }
  },
  {
    id: 'fin-ebitda-ebit-fcf',
    title: 'EBITDA, EBIT, and Free Cash Flow',
    category: 'Corporate Finance',
    altitude: {
      hook: 'Understand the difference between operating earnings and real cash generation.',
      plain:
        'EBITDA measures operating cash flow proxy before non-cash expenses. EBIT is operating profit. Free Cash Flow (FCF) is the actual cash available to be returned to investors after paying for operations and capital expenditures.',
      depth:
        'EBITDA = EBIT + D&A. EBITDA is widely used as a proxy for cash flow because it ignores capital structure and non-cash items, but it can be misleading for capital-intensive firms as it ignores CapEx. Free Cash Flow to Firm (FCFF) = EBIT x (1-t) + D&A - CapEx - Change in Working Capital. Free Cash Flow to Equity (FCFE) = Net Income + D&A - CapEx - Change in NWC + Net Borrowing. EBITDA/EBIT are P&L metrics, whereas FCF is a cash flow metric.'
    }
  },
  {
    id: 'fin-break-even',
    title: 'Break-even Analysis',
    category: 'Corporate Finance',
    altitude: {
      hook: 'How many units must you sell to cover fixed costs? Break-even is the safety threshold.',
      plain:
        'Break-even point is the sales volume where total revenues equal total costs. It separates loss from profit. It is calculated by dividing fixed costs by the contribution margin per unit.',
      depth:
        'Contribution Margin = Price - Variable Cost per unit. Break-even Volume = Fixed Costs / Contribution Margin. Operating Leverage measures the ratio of fixed costs to variable costs. High operating leverage means that once fixed costs are covered, a small increase in sales results in a large increase in operating income, but it also increases downside risk in downturns.'
    }
  },
  {
    id: 'fin-ratios',
    title: 'Financial Ratios',
    category: 'Analysis',
    altitude: {
      hook: 'Liquidity, leverage, profitability, efficiency — the standard health panel for a business.',
      plain:
        'Financial ratios compare financial metrics to diagnose performance. Dupont analysis decomposes Return on Equity (ROE) to show whether profitability is driven by margins, asset turnover, or leverage.',
      depth:
        'Dupont Decomposition: ROE = Net Profit Margin (Profitability) x Asset Turnover (Efficiency) x Financial Leverage Multiplier (Leverage). Liquidity ratios: Current Ratio (CA/CL), Quick Ratio ((CA-Inventory)/CL). Leverage: Debt/EBITDA, Interest Coverage (EBIT/Interest). Efficiency: Inventory Turnover, Receivables Turnover. Comparing ratios across historical years and industry averages is the baseline of corporate analysis.'
    }
  },
  {
    id: 'fin-synergy',
    title: 'M&A Synergy Logic (*)',
    category: 'Corporate Finance',
    altitude: {
      hook: 'Synergy is the promise of 1 + 1 = 3 — but most M&A transactions fail to deliver this value.',
      plain:
        'Synergies represent the cost savings (cost synergies) or revenue additions (revenue synergies) expected when two companies merge, making the combined entity more valuable than the sum of its parts.',
      depth:
        'Cost synergies are easier to model and achieve (headcount reduction, overlapping facility closure, purchasing power scale). Revenue synergies are highly speculative (cross-selling products to new customer bases, pricing power from market consolidation). \n\n**When it is the WRONG choice:** Synergy modeling is the wrong framework when evaluating mergers where: (1) The corporate cultures are highly incompatible, leading to massive post-merger integration friction and customer/staff churn. (2) The acquirer pays a massive control premium that exceeds the present value of the synergies. (3) The transaction is driven by executive hubris or defensive empire-building rather than economic scale. In these cases, a custom structure focusing on **Integration Execution Risk** and **Hurdle Rate sensitivity** is far more accurate than simple synergy spreadsheets.'
    }
  },
  {
    id: 'fin-lbo',
    title: 'LBO Mechanics',
    category: 'Corporate Finance',
    altitude: {
      hook: 'Leveraged Buyouts use debt to buy a company, using its own cash flow to pay down the debt.',
      plain:
        'In an LBO, a private equity firm buys a business using a small amount of equity and a large amount of debt. The debt is secured by the assets of the acquired company and serviced by its cash flows.',
      depth:
        'LBO returns are driven by: (1) Debt paydown: using cash flow to pay principal reduces net debt, increasing equity value upon exit. (2) Operational improvements: EBITDA expansion via margin growth. (3) Multiple expansion: selling at a higher EV/EBITDA multiple than purchased. The primary valuation metric is the Internal Rate of Return (IRR). Ideal LBO candidates have stable, predictable cash flows, low capital expenditure requirements, solid asset bases for collateral, and strong management teams.'
    }
  },
  {
    id: 'fin-capm',
    title: 'CAPM and Beta',
    category: 'Corporate Finance',
    altitude: {
      hook: 'Risk and return — CAPM calculates the cost of equity based on systematic market risk.',
      plain:
        'The Capital Asset Pricing Model (CAPM) estimates the expected return of an asset: Expected Return = Risk-Free Rate + Beta x Market Risk Premium. Beta measures the asset\'s sensitivity to overall market movements.',
      depth:
        'Systematic risk (market risk) cannot be diversified away and is measured by Beta. Unsystematic risk is company-specific and can be diversified. CAPM assumes markets are efficient. Beta < 1 means the asset is less volatile than the market (defensive, e.g., utilities); Beta > 1 means the asset is more volatile (growth, e.g., tech). Cost of Equity (Ke) is a critical input in WACC calculation.'
    }
  },
  {
    id: 'fin-dividend',
    title: 'Dividend Policy Theory',
    category: 'Corporate Finance',
    altitude: {
      hook: 'To pay or to reinvest? The puzzle of how firms distribute capital to shareholders.',
      plain:
        'Dividend policy governs whether a firm returns profits via cash dividends, stock buybacks, or retains them to reinvest in growth. Miller-Modigliani argues dividend policy is irrelevant in a frictionless world.',
      depth:
        'In practice, frictions exist: (1) Taxes: in many jurisdictions, capital gains are taxed lower than dividends, making buybacks superior. (2) Signaling Theory: dividend increases signal management confidence in future cash flows; cuts signal trouble. (3) Clientele Effect: different investor groups prefer different payout structures (retired retail investors prefer stable dividends; growth investors prefer buybacks/reinvestment).'
    }
  },
  {
    id: 'fin-behavioral',
    title: 'Behavioral Finance Basics',
    category: 'Analysis',
    altitude: {
      hook: 'Markets are not always rational — behavioral finance explains cognitive errors in allocation.',
      plain:
        'Behavioral finance studies how psychological biases (loss aversion, overconfidence, herd behavior) influence financial decisions and cause market anomalies, challenging the Efficient Market Hypothesis (EMH).',
      depth:
        'Prospect Theory (Kahneman & Tversky) shows loss aversion: the pain of losing is twice as intense as the pleasure of gaining. This leads to the Disposition Effect (selling winners too early, holding losers too long). Overconfidence bias causes corporate managers to overpay in acquisitions. Anchoring leads analysts to adjust estimates too slowly in response to new data.'
    }
  }
];

export const financeCase: CaseContent = {
  date: '2024-06-15',
  company: 'Paytm (One97 Communications)',
  sector: 'Fintech / Payments',
  background:
    'In January 2024, the Reserve Bank of India directed Paytm Payments Bank Limited (PPBL) to cease accepting new deposits and credit transactions by February 29, 2024, citing persistent non-compliance. This triggered a severe stock correction and forced One97 Communications to restructure its business model away from its banking entity.',
  dataExhibits: [
    {
      parameter: 'Stock price decline (Jan 31 to Feb 28, 2024)',
      value: '-55%',
      source: { id: 1, source: 'NSE historical data', date: '2024-03' },
      sensitivity: 'High',
    },
    {
      parameter: 'PPBL\'s share of Paytm GMV (pre-ban)',
      value: '~40%',
      source: { id: 2, source: 'Macquarie Research, Paytm Note', date: '2024-02' },
      sensitivity: 'High — revenue cliff',
    },
    {
      parameter: 'Paytm FY24 Revenue',
      value: 'Rs. 9,978 Cr',
      source: { id: 1, source: 'Paytm FY24 Results Press Release', date: '2024-05' },
      sensitivity: 'Medium',
    },
  ],
  dilemma:
    'With PPBL shut down, Paytm must migrate its banking infrastructure partnerships to Axis Bank, HDFC, and others. The core question for the CFO: does Paytm have sufficient runway (cash + credit lines) to survive the revenue disruption while rebuilding its bank-partner model, or does it need to raise dilutive equity capital?',
  stakeholders: [
    { name: 'Vijay Shekhar Sharma (Founder)', role: 'Promoter', interest: 'Control + enterprise survival' },
    { name: 'Institutional investors (SoftBank, Ant Group)', role: 'Large shareholders', interest: 'Capital preservation, exit optionality' },
    { name: 'Merchant partners', role: 'Revenue base', interest: 'Payment continuity, no disruption to settlements' },
    { name: 'RBI', role: 'Regulator', interest: 'Compliance, systemic safety, consumer protection' },
  ],
  lenses: {
    strategy: 'Paytm\'s unique position (largest merchant QR network in India, 75+ Mn active users) remains valuable. The strategic risk is that SBI, PhonePe, and Google Pay capture displaced volume permanently. Speed of bank-partner onboarding is the critical path for strategic survival.',
    finance: 'Paytm had Rs. 8,108 crore cash and equivalents as of Q3FY24. Monthly cash burn post-ban estimated at Rs. 400-600 crore. Runway: approximately 12-18 months without external capital. Equity raise at current depressed prices would be massively dilutive. Debt is constrained given NBFC regulatory uncertainty. The optimal path: cost rationalization (headcount, marketing spend) to extend runway while GMV migrates to new banking partners.',
    marketing: 'Merchant trust is the fragile asset. Paytm must over-communicate settlement timelines and payment reliability to prevent merchant churn to PhonePe and Google Pay. B2B retention marketing (relationship manager outreach, zero-downtime guarantees) is more valuable than consumer advertising in this phase.',
    operations: 'The technical migration of wallet top-ups, FASTag, and savings accounts to new banking partners is an operational emergency. Critical path: partner API integration, KYC data transfer (requires RBI approval), and merchant onboarding to new settlement rails.',
  },
  recommendation:
    'Prioritize operational survival: execute bank-partner migration within 90 days, cut discretionary costs by 30%, and preserve the merchant QR network at all cost. Defer any equity raise for minimum 6 months to allow recovery in stock price. If cash falls below Rs. 5,000 crore, trigger a structured secondary at minimum dilution to anchor investors.',
  commonMistakes: [
    'Treating this purely as a regulatory risk story — it is fundamentally a business model viability question.',
    'Overlooking the competitive window: every week of disruption is an invitation for PhonePe and Google Pay to lock in Paytm\'s merchants.',
    'Assuming RBI risk is symmetric across fintech — this event signals that fintech entities with banking licenses face qualitatively different regulatory risk than pure payment gateways.',
  ],
  citations: [
    { id: 1, source: 'RBI Order on PPBL', date: '2024-01-31' },
    { id: 2, source: 'Macquarie Research, Paytm Note', date: '2024-02' },
    { id: 3, source: 'Paytm FY24 Results Press Release', date: '2024-05' },
  ],
}

export const financeHotTopic: HotTopicContent = {
  date: '2024-06-15',
  headline: 'SEBI Proposes New SME IPO Framework to Curb Manipulation',
  whatHappened:
    'SEBI released a consultation paper in June 2024 proposing tighter eligibility norms for SME IPOs, including a minimum operating profit requirement of Rs. 1 crore in 2 of the last 3 years, and restrictions on offer-for-sale (OFS) portions to prevent promoters from exiting immediately after listing.',
  rootCause:
    'The SME IPO segment saw 182 issues raise Rs. 4,686 crore in FY24 — a 3x surge versus FY22. Several issues listed at extreme premiums on opening day, driven by low float and gray market manipulation, then crashed. SEBI identified patterns of related-party circular trading inflating pre-IPO share prices.',
  stakeholders: [
    { name: 'Promoters of SME companies', gains: 'Greater credibility if they qualify', loses: 'Ability to exit quickly via OFS' },
    { name: 'Retail investors', gains: 'Better quality SME IPOs, lower manipulation risk', loses: 'Fewer listings to participate in short-term' },
    { name: 'SME merchant bankers', gains: 'Cleaner pipeline, reduced regulatory risk', loses: 'Short-term deal flow reduction' },
    { name: 'BSE SME / NSE Emerge exchanges', gains: 'Quality improvement', loses: 'Listing volume in near term' },
  ],
  businessImplications:
    'The profitability filter will reduce SME IPO supply by an estimated 30-40%. For investors, quality-adjusted returns should improve. For the ecosystem, the signal is that SEBI is tightening the full IPO spectrum post-Adani short-seller report political pressure to demonstrate independent oversight.',
  scenarios: [
    { label: 'Best', description: 'New norms raise average SME IPO quality; listing-day returns stabilize at 20-40% (vs. current 100%+ spikes); retail participation grows sustainably on better risk-adjusted outcomes.' },
    { label: 'Worst', description: 'SME IPO pipeline dries up; smaller companies are shut out of public markets; private equity / angel funding gap for the Rs. 20-100 crore revenue band widens.' },
    { label: 'Likely', description: 'Near-term volume dip of 25-30%; market adjusts in 2-3 quarters; higher-quality cohort of SME IPOs post-norms leads to better long-run outcomes for retail investors.' },
  ],
  citations: [
    { id: 1, source: 'SEBI Consultation Paper on SME IPOs', date: '2024-06' },
    { id: 2, source: 'Prime Database SME IPO Analysis FY24', date: '2024-04' },
  ],
}

export const financeThink: ThinkContent = {
  date: '2024-06-15',
  question: 'A profitable company with strong cash flows is considering a large acquisition using 70% debt financing. What risks would you flag, and what financial metrics would you build a decision around?',
  modelAnswer: {
    hook: 'Debt-financed acquisitions amplify both the upside and the downside — make sure the cash flows of the combined entity can service the debt before you sign.',
    plain:
      'The core risk in leveraged acquisitions is that you are betting the cash flows of the target will materialize as modeled. If revenues disappoint post-close, debt payments remain fixed. The company faces a binary outcome: either the target performs and you capture equity upside, or it underperforms and the debt becomes a distress spiral.',
    depth:
      'Key metrics to model: (1) Pro-forma Debt/EBITDA of combined entity post-acquisition — above 4x signals distress risk for most sectors; 3x is a comfortable ceiling. (2) Interest Coverage Ratio (EBIT/Interest) — must stay above 2.5x in bear-case scenario. (3) Free Cash Flow after debt service (FCADS) — must remain positive in the base case. (4) Break-even EBITDA: what minimum combined EBITDA services all debt obligations. (5) Synergy risk: model synergies at 50% of projected level (integration failure is common) — does the deal still make sense? Additional flags: seller motivation (why is target being sold?), integration execution risk (culture, systems), covenant compliance (lenders attach financial covenants that can trigger acceleration), and cyclicality of target revenues (leveraged deals are especially dangerous in cyclical industries). Compare to alternative: 100% equity funding vs. 70/30 leverage vs. staged acquisition — present all three IRR profiles to the board.',
  },
  alternatePerspective:
    'Counter-view: If interest rates are low and the target has stable, recurring cash flows (e.g., a SaaS business or infrastructure asset), 70% debt financing is not only acceptable but optimal — it maximizes equity IRR and preserves the acquirer\'s own equity for other investments. The question is not "is 70% debt safe?" but "are the target\'s cash flows stable enough to make 70% debt safe?"',
  citations: [
    { id: 1, source: 'Damodaran, Applied Corporate Finance (4th ed)', date: '2014' },
    { id: 2, source: 'Brealey, Myers & Allen, Principles of Corporate Finance', date: '2019' },
  ],
}

export const financeLibrary: LibraryEntry[] = [
  {
    id: 'lib-fin-1',
    title: 'Security Analysis',
    author: 'Benjamin Graham & David Dodd',
    year: 1934,
    tags: ['finance'],
    description: 'The foundational text for fundamental valuation. Concepts of intrinsic value, margin of safety, and Mr. Market remain essential for any finance interview.',
    pages: 725,
  },
  {
    id: 'lib-fin-2',
    title: 'The Intelligent Investor',
    author: 'Benjamin Graham',
    year: 1949,
    tags: ['finance'],
    description: 'The distilled version of Security Analysis for the general investor. Chapter 8 (Mr. Market) and Chapter 20 (Margin of Safety) are mandatory reading.',
    pages: 640,
  },
  {
    id: 'lib-fin-3',
    title: 'Investment Valuation',
    author: 'Aswath Damodaran',
    year: 2012,
    tags: ['finance', 'strategy'],
    description: 'The most comprehensive valuation textbook available. Damodaran\'s spreadsheets are available free on his website — essential for building DCF models.',
    pages: 992,
  },
]

export const financeCompany: CompanySpotlightContent = {
  companyName: 'Reliance Industries Limited',
  identity: 'Conglomerate spanning energy, petrochemicals, retail, and telecommunications',
  founded: 1966,
  headquarters: 'Mumbai, Maharashtra, India',
  metrics: [
    { label: 'Market Capitalization', value: 'Rs. 20,40,000 Cr', asOf: 'June 2026', citationId: 101 },
    { label: 'FY25 Consolidated Revenue', value: 'Rs. 10,00,300 Cr', asOf: 'March 2025', citationId: 102 },
    { label: 'Consolidated Net Debt/EBITDA', value: '1.2x', asOf: 'December 2025', citationId: 103 },
    { label: 'Consolidated EBITDA Margin', value: '16.8%', asOf: 'December 2025', citationId: 103 }
  ],
  competitors: [
    { name: 'Adani Group', positioningNote: 'Competes directly in infrastructure, renewable energy, and logistical supply chain development.' },
    { name: 'Tata Group', positioningNote: 'Competes across retail and digital services, positioning on corporate governance and brand trust.' }
  ],
  industryContext: 'The Indian corporate landscape is characterized by a transition from traditional asset-heavy manufacturing to digital and consumer-facing services. Capital spending in the telecom and green energy segments dominates corporate balance sheets, with RIL representing a significant portion of national private capital expenditure.',
  functionLens: 'Reliance Industries Limited represents the peak of capital allocation complexity in emerging markets. RIL\'s capital structure balances cheap, long-term debt (international bond offerings, syndicated loans) against cash flows from its core oil-to-chemicals (O2C) cash cow. This steady energy cash flow subsidizes the massive CapEx requirements of Jio (telecom) and Reliance Retail. Finance managers monitor RIL\'s Net Debt/EBITDA closely, ensuring it stays well below the 2.0x threshold to preserve its investment-grade credit rating. RIL has successfully unlocked shareholder value through minority stake sales to global tech giants and sovereign wealth funds, creating clear valuation benchmarks for its sub-divisions prior to potential public spin-offs.',
  whyItMatters: 'RIL is the ultimate case study for corporate finance leverage, cross-subsidization, and value unlocking. Cite RIL in discussions about conglomerate discounts, optimizing Weighted Average Cost of Capital (WACC) using diverse international debt structures, and strategic capital allocation across mature vs. growth businesses.',
  citations: [
    { id: 101, source: 'Bombay Stock Exchange (BSE) Market Cap Records', date: '2026-06' },
    { id: 102, source: 'RIL Annual Report FY25', date: '2025-05' },
    { id: 103, source: 'Morgan Stanley Research: RIL Valuation Note', date: '2025-12' }
  ]
};
