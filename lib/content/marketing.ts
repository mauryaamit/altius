import type {
  ConceptEntry,
  CaseContent,
  HotTopicContent,
  ThinkContent,
  LibraryEntry, CompanySpotlightContent } from './types'

export const marketingConcepts: ConceptEntry[] = [
  {
    id: 'mktg-stp',
    title: 'STP Framework',
    category: 'Segmentation',
    altitude: {
      hook: 'Not every customer is your customer — STP is the discipline of choosing whom to serve.',
      plain:
        'STP stands for Segmentation, Targeting, and Positioning. You first divide a market into groups with shared needs (Segmentation), then pick one or more groups to focus on (Targeting), and finally craft a message that explains why your offer beats alternatives for that group (Positioning). Most product failures trace back to skipping step one: trying to be everything to everyone.',
      depth:
        'Segmentation variables span demographic (age, income, gender), psychographic (values, lifestyle, VALS framework), behavioural (usage rate, loyalty, occasions per Kotler), and geographic dimensions. Targeting uses three strategies: undifferentiated (one offer, all segments — works only in commodity categories), differentiated (separate offers per segment — high cost, high relevance), and concentrated/niche (one segment, deep focus — risk is high but margin potential is highest). Positioning is articulated via a Positioning Statement: "For [target segment], [brand] is the [category] that [point of difference] because [reason to believe]." The classic tool is the Perceptual Map, a 2x2 plotting competitive offers on two consumer-relevant axes. Porter\'s generic strategies (Cost Leadership vs Differentiation vs Focus) are the macro complement to STP\'s micro view.'
    }
  },
  {
    id: 'mktg-4p',
    title: 'Marketing Mix (4Ps / 7Ps)',
    category: 'Strategy',
    altitude: {
      hook: 'Product, Price, Place, Promotion — the four levers every marketer can actually pull.',
      plain:
        'The marketing mix is the set of controllable variables a company uses to produce the response it wants in its target market. Each "P" is a lever: what you sell (Product), how much you charge (Price), where you sell it (Place), and how you communicate (Promotion). Services marketing adds three more: People, Process, and Physical Evidence, making it 7Ps.',
      depth:
        'Product decisions include the core benefit, actual product (features, quality, design, branding), and augmented product (warranty, after-sales, installation). Price strategy choices include cost-plus, value-based, competitive, penetration, skimming, and psychological pricing. The Price Elasticity of Demand (PED) determines which strategy is viable. Place covers channel length (direct vs. one-tier vs. multi-tier), channel intensity (intensive / selective / exclusive distribution), and the push-pull strategy debate. Promotion is broken into the Communications Mix: advertising, personal selling, sales promotion, PR and publicity, direct marketing, and digital/social channels. The AIDA (Attention, Interest, Desire, Action) model maps promotional tools to the buyer journey. Integration across all 4Ps is what Integrated Marketing Communications (IMC) demands.'
    }
  },
  {
    id: 'mktg-clv',
    title: 'Customer Lifetime Value (CLV)',
    category: 'Analytics',
    altitude: {
      hook: 'Acquisition cost only makes sense if you know how much a customer is worth over time.',
      plain:
        'CLV is the total profit you expect to earn from one customer across their entire relationship with you. A customer acquisition cost (CAC) is only justified if the lifetime profit exceeds it by a healthy margin. CLV reframes marketing from a short-term cost to an investment discipline.',
      depth:
        'Simple CLV = (Average Order Value) x (Purchase Frequency) x (Customer Lifespan) x (Gross Margin %). The probabilistic model (BG/NBD) uses individual-level transaction data. Key levers: increase AOV (upsell/cross-sell), increase frequency (loyalty programs, email cadence), extend lifespan (reduce churn via NPS and proactive intervention), and improve margin (premium tier, cost reduction). The CLV-to-CAC ratio (Customer Lifetime Value / Customer Acquisition Cost) is the north-star metric for growth sustainability. A ratio below 3x signals structural marketing inefficiency. Cohort analysis tracks how CLV evolves by acquisition vintage, revealing whether product or service quality is improving.'
    }
  },
  {
    id: 'mktg-brand-equity',
    title: 'Brand Equity (Keller\'s CBBE)',
    category: 'Branding',
    altitude: {
      hook: 'Brand equity is what lets you charge a premium — and why people queue for Air Jordans.',
      plain:
        'Brand equity is the additional value a product has because of its brand name versus an unbranded equivalent. Keller\'s Customer-Based Brand Equity model builds equity through four stages: identity, meaning, response, and resonance — like a pyramid you climb.',
      depth:
        'Keller\'s CBBE Pyramid: Salience (who are you?) > Performance + Imagery (what are you?) > Judgements + Feelings (what do I think/feel about you?) > Resonance (what about you and me?). Brand resonance — the peak — has four facets: behavioural loyalty, attitudinal attachment, sense of community, and active engagement. Brand equity can be measured financially (via brand valuation methods like Royalty Relief or Economic Use) or perceptually (via Brand Asset Valuator: Differentiation, Relevance, Esteem, Knowledge). The perceptual map of brand health: high Differentiation + low Esteem = niche, high both = power brand, falling Differentiation = commodity trap.'
    }
  },
  {
    id: 'mktg-journey',
    title: 'Customer Journey Mapping',
    category: 'Analytics',
    altitude: {
      hook: 'Visualizing the user journey from discovery to advocacy reveals points of friction.',
      plain:
        'Customer Journey Mapping is the process of tracking the touchpoints a buyer encounters when interacting with a brand. It outlines actions, thoughts, and emotional states, allowing marketers to align internal operations with the external user experience.',
      depth:
        'The journey spans awareness, consideration, acquisition, retention, and loyalty. Key concepts include moments of truth (First Moment of Truth when choosing, Second when using). Pain points occur when expectations diverge from actual experience. Touchpoint audits categorize assets into Owned, Earned, Paid, and Shared media. Transition rates between journey phases measure funnel leaks. Qualitative maps combine user personas, user diaries, and analytics clickstreams to define a cross-channel communication strategy.'
    }
  },
  {
    id: 'mktg-aida',
    title: 'AIDA and Funnel Models',
    category: 'Analytics',
    altitude: {
      hook: 'The classic framework for mapping linear customer attention to final action.',
      plain:
        'AIDA stands for Attention, Interest, Desire, Action. It represents the psychological stages a consumer goes through when encountering advertising. It forms the base of the modern marketing funnel, which tracks conversion rates at each stage.',
      depth:
        'Attention is captured via headline and visual hooks. Interest is sustained by highlighting relevant features. Desire is built through emotional resonance or logical benefit statements. Action is driven by clear calls to action (CTAs). Modern digital funnels expand AIDA to include Retention and Referral. Conversion Rate Optimization (CRO) focuses on minimizing leaks at the bottom of the funnel, while Search Engine Optimization (SEO) and paid acquisition feed the top of the funnel (TOFU).'
    }
  },
  {
    id: 'mktg-blue-ocean',
    title: 'Blue Ocean Strategy (*)',
    category: 'Strategy',
    altitude: {
      hook: 'Stop competing in crowded red oceans — create uncontested market space and make competition irrelevant.',
      plain:
        'Blue Ocean Strategy argues that instead of battling rivals in existing markets (Red Oceans), firms should create new demand by offering high-value, lower-cost solutions (Blue Oceans) through Value Innovation.',
      depth:
        'Value Innovation simultaneously pursues differentiation and low cost. The primary tool is the Strategy Canvas, plotting industry factors and drawing a new value curve. The Four Actions Framework asks: Eliminate, Reduce, Raise, Create. \n\n**When it is the WRONG choice:** Blue Ocean is a dangerous strategy when: (1) The category requires substantial market education. The cost of explaining a brand-new concept to users can deplete capital before product-market fit is achieved. (2) The market is a commodity category where consumers buy strictly on convenience or price (e.g., utility goods, simple logistics). (3) The incumbent has massive scale moats and distribution locks that can immediately replicate your "Blue Ocean" once validated. In these cases, a custom structure focusing on **Porter\'s Cost Leadership** or building a niche distribution moat is far stronger than trying to create a new market.'
    }
  },
  {
    id: 'mktg-adoption',
    title: 'Diffusion of Innovation',
    category: 'Segmentation',
    altitude: {
      hook: 'Rogers\' adoption curve explains why tech startups fail to cross the chasm.',
      plain:
        'The Diffusion of Innovation model categorizes consumers by when they adopt a new product: Innovators, Early Adopters, Early Majority, Late Majority, and Laggards. The critical challenge is moving a product from tech-enthusiasts to mainstream buyers.',
      depth:
        'The curve is a normal distribution: Innovators (2.5%), Early Adopters (13.5%), Early Majority (34%), Late Majority (34%), Laggards (16%). Geoffrey Moore\'s "Crossing the Chasm" identifies the gap between Early Adopters and Early Majority. Mainstream buyers demand complete product ecosystems, references, and reliable support, whereas early adopters seek competitive advantage and tolerate bugs. Strategies to cross the chasm require targeting a highly specific niche "beachhead" segment first, establishing dominance, and then expanding outward.'
    }
  },
  {
    id: 'mktg-behavioral-pricing',
    title: 'Behavioral Pricing',
    category: 'Strategy',
    altitude: {
      hook: 'Price is a signal, not just a number — behavioral pricing leverages cognitive biases to drive sales.',
      plain:
        'Behavioral pricing uses consumer psychology (anchoring, decoy effect, charm pricing) to make options look more attractive, rather than relying strictly on cost-plus calculation.',
      depth:
        'Anchoring establishes a high reference price, making subsequent prices look cheap (e.g., strikethrough pricing). The Decoy Effect (asymmetric dominance) introduces a third option that is inferior to the premium option but similar in price, guiding users to purchase the premium tier. Charm pricing (ending in .99 or 9) exploits left-digit bias. Value-based pricing models calculate price based on perceived customer savings rather than manufacturing cost. Price bundling combines products to reduce transparency and ease pain of paying.'
    }
  },
  {
    id: 'mktg-nps',
    title: 'Net Promoter Score & Critiques',
    category: 'Analytics',
    altitude: {
      hook: 'The single-question customer satisfaction metric used by boards, and why it is flawed.',
      plain:
        'NPS asks: "How likely are you to recommend us to a friend?" Respondents score 0-10. Detractors (0-6) are subtracted from Promoters (9-10) to give a score from -100 to 100.',
      depth:
        'Passives (7-8) are excluded from the score. NPS = % Promoters - % Detractors. Critique of NPS: (1) It collapses multi-dimensional loyalty into a single intent indicator. (2) It lacks cultural normalization; European consumers rarely score 9 or 10 compared to American counterparts, biasing cross-border comparisons. (3) detractor ranges are too wide (0-6), treating a highly active negative detractor the same as an indifferent passive user. Brands should complement NPS with Customer Effort Score (CES), Customer Satisfaction Score (CSAT), and transactional churn metrics to get an accurate view of loyalty.'
    }
  },
  {
    id: 'mktg-mix-modeling',
    title: 'Marketing Mix Modeling (MMM)',
    category: 'Analytics',
    altitude: {
      hook: 'Attribution in a privacy-first world — MMM uses statistics to measure media ROI.',
      plain:
        'Marketing Mix Modeling is a statistical technique that uses historical sales data and marketing activity to estimate the incremental impact of offline and online advertising channels.',
      depth:
        'Unlike user-level attribution (MTA) which relies on cookies and tracking pixels, MMM operates on aggregated data, making it resilient to privacy updates. It uses multi-linear regression to estimate parameters. Key components include baseline sales (organic demand), media spend variables, and external factors (macroeconomics, competitor actions, weather). MMM accounts for ad-stock effects (delayed impact of ads) and saturation curves (diminishing returns to spend). Results feed budget optimization models to maximize ROI across the enterprise.'
    }
  },
  {
    id: 'mktg-funnel-metrics',
    title: 'Digital Funnel Metrics',
    category: 'Analytics',
    altitude: {
      hook: 'CPM, CPC, and CPA are the core conversion metrics of digital performance channels.',
      plain:
        'Performance marketing relies on unit economics to track ad spend efficiency. Marketers analyze impressions, clicks, actions, and total revenue to evaluate channel profitability.',
      depth:
        'CPM = Cost Per Mille (thousand impressions). CPC = Cost Per Click. CPA = Cost Per Action/Acquisition. CTR = Click-Through Rate (Clicks/Impressions). CR = Conversion Rate (Conversions/Clicks). ROAS = Return on Ad Spend (Revenue/Spend). Customer Acquisition Cost (CAC) matches marketing spend to converted users. The digital equation holds that if CAC is greater than CLV, performance marketing is destroying value. Media mix optimization balances high-volume, low-intent channels (display) with low-volume, high-intent channels (search).'
    }
  },
  {
    id: 'mktg-brand-architecture',
    title: 'Brand Architecture',
    category: 'Branding',
    altitude: {
      hook: 'House of Brands vs. Branded House — organizing product portfolios to maximize equity.',
      plain:
        'Brand architecture is the structure of brands within an organization. It defines how sub-brands relate to each other and the corporate parent, ensuring clarity for consumers.',
      depth:
        'Two polar extremes: (1) Branded House (monolithic): parent brand is dominant across all products (e.g., Apple, Fedora). Maximizes marketing efficiency and leverage; risk is that failure in one category dilutes the entire brand. (2) House of Brands: independent brands, corporate parent is hidden (e.g., Unilever, P&G). Protects brands from contamination and allows niche targeting; requires massive marketing budgets as each brand must be built from scratch. Hybrid systems include endorsed brands (e.g., Courtyard by Marriott) and sub-branding.'
    }
  },
  {
    id: 'mktg-category-creation',
    title: 'Category Creation',
    category: 'Strategy',
    altitude: {
      hook: 'The ultimate marketing strategy — don\'t sell a better product, write a new category rule book.',
      plain:
        'Category Creation is the strategy of defining a new problem, solving it with a new product, and naming the space (e.g., HubSpot creating "Inbound Marketing"). The creator often captures the majority of market capitalization.',
      depth:
        'Category creators focus 3x more on problem education than product promotion. The playbook involves: (1) Identifying a shift in technology or consumer behavior. (2) Defining a "villain" (the old way of doing things). (3) Coining a new term for the category. (4) Aligning the product ecosystem to solve this specific problem. While high-risk and capital-intensive, creators capture up to 76% of the category\'s market share, leaving competitors to fight for margins in a pre-defined framework.'
    }
  }
];

export const marketingCase: CaseContent = {
  date: '2026-06-15',
  company: 'Nykaa',
  sector: 'Beauty / E-commerce',
  background:
    'Nykaa launched in 2012 as an online-first beauty retailer in India, carving out a specialized niche in a market then dominated by unorganized local mom-and-pop stores, chemist chains, and premium department counters. Founded by former investment banker Falguni Nayar, Nykaa\'s core value proposition was authenticity — addressing a market rife with counterfeit products. By securing direct partnerships with global cosmetic conglomerates (L\'Oreal, Estee Lauder) and establishing an inventory-led e-commerce model, Nykaa guaranteed product genuineness, resolving a massive consumer trust barrier. Over the subsequent decade, the brand expanded aggressively, launching physical retail stores, launching private label brands, and venturing into the fashion sector. By FY24, Nykaa reported a consolidated Gross Merchandise Value (GMV) of Rs. 11,200 crore. However, its rapid growth was accompanied by margin compression, increasing customer acquisition costs, and mounting losses in its highly competitive fashion vertical, forcing the board to re-evaluate its omnichannel allocation strategies.',
  dataExhibits: [
    {
      parameter: 'GMV FY24 (Beauty vertical)',
      value: 'Rs. 10,300 Cr',
      source: { id: 1, source: 'Nykaa FY24 Annual Report', date: '2024-05', url: 'https://ir.nykaa.com' },
      sensitivity: 'High — tied to discretionary spend',
    },
    {
      parameter: 'Active beauty customers (FY24)',
      value: '35 Mn',
      source: { id: 1, source: 'Nykaa FY24 Annual Report', date: '2024-05' },
      sensitivity: 'Medium',
    },
    {
      parameter: 'Owned brand contribution to revenue',
      value: '~12%',
      source: { id: 2, source: 'Motilal Oswal Research, Nykaa Note', date: '2024-04' },
      sensitivity: 'High — margin swing factor',
    },
  ],
  dilemma:
    'Nykaa faces a complex strategic dilemma: the emergence of deep-pocketed conglomerates (Reliance Tira, Tata Cliq Palette) entering the premium beauty space with massive offline retail footprint assets, coupled with the lightning-fast expansion of quick-commerce platforms (Blinkit, Zepto) capturing unplanned daily replenishment purchases. Simultaneously, Nykaa\'s fashion vertical (NykaaFashion) has failed to achieve profitability, posting persistent EBITDA drag and diluting the core brand\'s margin profile. The corporate executive committee must decide whether to continue subsidizing the fashion division to build a multi-category marketplace, divest the fashion arm to focus exclusively on defending its beauty leadership, or pivot capital expenditure toward rapid offline store expansion to counter quick-commerce disruption.',
  stakeholders: [
    { name: 'FSN E-Commerce (promoters)', role: 'Parent company', interest: 'Long-term brand equity, P&L consolidation, and voting control' },
    { name: 'Institutional investors', role: 'Minority shareholders', interest: 'EBITDA margin expansion, capital efficiency, and ROIC growth' },
    { name: 'Global brand partners (luxury)', role: 'Exclusive distributors', interest: 'Brand protection, premium pricing, and high-end retail experience' },
    { name: 'Quick-commerce platforms', role: 'Competitors', interest: 'Capture consumer replenishment frequency and share of wallet' },
  ],
  lenses: {
    strategy:
      'Applying the Ansoff Matrix framework, Nykaa\'s foray into fashion represents a product diversification strategy that carries high risk without matching competitive advantages. Unlike beauty, fashion has higher return rates (often 30-35% vs 2-5% in beauty), leading to complex reverse logistics costs and inventory write-downs. Furthermore, in beauty, Nykaa holds a structural moat via content-led discovery (influencer videos, tutorials) and exclusive brand partnerships. To defend this moat against Reliance Tira, Nykaa must pursue a differentiation strategy. Competitors attempting to compete on price (Cost Leadership) will dilute margins. Nykaa should strengthen its premium positioning by securing exclusive distribution rights for global cult brands, locking them out of rival platforms, and leveraging its loyalty databases to drive cross-sales.',
    finance:
      'Nykaa\'s consolidated EBITDA margin stands at an thin ~5.5%, heavily weighed down by the fashion business which has recorded consecutive quarterly losses. Analysis of the beauty vertical alone reveals healthy standalone margins (~9-10%), subsidized by private labels (Nykaa Cosmetics, Kay Beauty) which yield gross margins of 40-45% compared to the 25-30% on third-party distribution. Capital expenditure must be scrutinized: offline store rollout costs approximately Rs. 60-80 lakhs per store, requiring a 3-year payback period. If capital is diverted to support fashion inventory markdowns, the beauty offline expansion slows, allowing competitors to capture prime mall spaces. Divesting or spinning off NykaaFashion into a joint venture would free up capital and immediately improve consolidated EBITDA margins by 150-200 basis points.',
    marketing:
      'The consumer decision journey (CDJ) in beauty is highly emotional and consideration-heavy for premium products, whereas commodity items (shampoos, face washes) are characterized by low involvement and high convenience. Quick-commerce platforms are rapidly disintermediating Nykaa for these high-frequency, commodity replenishment purchases. To counter this, Nykaa must shift its marketing mix. First, it should leverage its content engine (Nykaa TV, blogs) to focus on premium, high-margin, considered skincare and color cosmetics that consumers refuse to buy without swatching or reading detailed reviews. Second, Nykaa must upgrade its loyalty program (Prive) by offering experiential rewards, masterclasses, and early access to exclusives, increasing attitudinal loyalty rather than transactional discounts.',
    operations:
      'Operational complexity rises significantly as Nykaa transitions to an omnichannel retail model. Managing inventory across 145+ physical stores and multiple regional distribution centres requires real-time demand forecasting to prevent stockouts and markdown inventory. Nykaa can turn its physical stores into micro-fulfillment hubs, enabling same-day delivery in metro areas to blunt the quick-commerce threat. For the private labels, Nykaa relies on third-party contract manufacturers; this asset-light model keeps CapEx low but increases quality-control risks. Streamlining the supply chain through automated warehouse sortation and predictive inventory positioning is critical to reducing shipping times and optimizing the working capital cycle.',
  },
  recommendation:
    'The recommended strategic roadmap is threefold: First, structurally isolate NykaaFashion by setting a strict 12-month path to profitability, halting all expansion capital, and exploring a joint venture or spin-off to eliminate the cash drain. Second, accelerate beauty vertical differentiation by expanding exclusive brand partnerships (aiming to increase exclusives from 15% to 30% of SKU mix) and scaling private label production to drive gross margins. Third, counter quick-commerce by piloting a selective "120-minute delivery" service in tier-1 cities, using existing physical retail stores as forward-deployed fulfillment nodes. Capital freed from the fashion descope should be redirected to fund this high-margin omnichannel defense.',
  commonMistakes: [
    'Subsidizing a structurally unprofitable fashion vertical under the assumption that cross-selling from beauty will solve customer acquisition costs.',
    'Ignoring the quick-commerce threat for basic replenishment SKUs, mistakenly believing that content authority alone protects commodity sales.',
    'Engaging in a discount war with conglomerates like Reliance, which destroys premium brand equity and erodes merchant margins.',
  ],
  citations: [
    { id: 1, source: 'Nykaa FY24 Annual Report', date: '2024-05' },
    { id: 2, source: 'Motilal Oswal Institutional Equities Note', date: '2024-04' },
    { id: 3, source: 'Harvard Business School: E-commerce in Emerging Markets', date: '2021' },
  ],
}

export const marketingHotTopic: HotTopicContent = {
  date: '2026-06-15',
  headline: 'CCPA Issues Rs. 10 Lakh Penalty to Influencer for Undisclosed Ads',
  whatHappened:
    'The Central Consumer Protection Authority (CCPA), the statutory regulatory body operating under India\'s Ministry of Consumer Affairs, has levied a landmark financial penalty of Rs. 10 lakh on a prominent lifestyle and finance influencer. The order was issued following a systematic investigation which revealed that the influencer promoted a series of credit and wealth management products without disclosing the underlying commercial relationship, directly violating the statutory Endorsement Guidelines for Social Media Influencers. This enforcement action marks the first time the regulator has exercised its powers to levy direct financial penalties on creators, shifting the regulatory posture from voluntary self-regulation to strict legal liability.',
  rootCause:
    'The influencer marketing ecosystem in India has grown exponentially, surpassing Rs. 2,200 crore in annual spend with projection trends pointing toward Rs. 3,500 crore. Historically, the Advertising Standards Council of India (ASCI) governed this space, but as a self-regulatory body, its guidelines lacked statutory teeth. To address this regulatory gap, the CCPA codified the 2023 Guidelines, making clear disclosure mandatory for any post where a commercial relationship (free products, discount codes, equity, or cash) exists. The root cause of the violation was a systemic culture of nondisclosure, where brands and creators feared that adding "Ad" or "Sponsored" tags would reduce engagement rates and conversion metrics.',
  stakeholders: [
    { name: 'Influencers (Macro & Micro)', gains: 'Standardized compliance pathways, professionalization of contracts', loses: 'Loss of undocumented revenue, drop in post engagement metrics' },
    { name: 'Brand Marketers', gains: 'Lower risk of joint legal liability, cleaner campaign analytics', loses: 'Increased campaign overhead, legal compliance audit costs' },
    { name: 'Consumers', gains: 'Transparency in recommendations, protection from deceptive endorsements', loses: 'None' },
    { name: 'Influencer Agencies', gains: 'Increased demand for compliance auditing and training services', loses: 'Loss of clients who refuse to adhere to disclosure norms' },
  ],
  businessImplications:
    'The business implications for consumer-facing brands are profound. First, compliance costs will rise as all influencer briefs, scripts, and contracts must now undergo strict legal review. Second, short-term performance marketing metrics will shift; preliminary industry studies indicate a 12-18% reduction in click-through rates (CTR) on posts explicitly marked as advertisements. Third, the industry will experience a shift in budgets toward micro-influencers, who often command higher trust levels and can integrate disclosures more authentically. Long-term, this regulation will professionalize the creator economy, forcing agencies to build compliance tracking tools and encouraging brands to focus on genuine product quality over deceptive promotion.',
  scenarios: [
    { label: 'Best', description: 'Creators and brands adapt rapidly. Clear, creative disclosures become industry standards, stabilizing engagement metrics. Consumer trust in social commerce rises, driving higher long-term conversion rates.' },
    { label: 'Worst', description: 'Over-enforcement by CCPA chills the creator economy. Brands panic and redirect marketing budgets back to traditional search and programmatic ads, leading to a 30% contraction in influencer agency revenues.' },
    { label: 'Likely', description: 'Enforcement focuses primarily on high-risk sectors (fintech, health, crypto) and macro-creators. The industry self-polices, and agencies develop automated tools to verify disclosures before releasing payments.' },
  ],
  citations: [
    { id: 1, source: 'Central Consumer Protection Authority Enforcement Order', date: '2026-05' },
    { id: 2, source: 'ASCI Annual Influencer Trust Report', date: '2025' },
    { id: 3, source: 'EY India Creator Economy report', date: '2025' },
  ],
}

export const marketingThink: ThinkContent = {
  date: '2026-06-15',
  question: 'A D2C skincare brand has a 4.5x CLV-to-CAC ratio online but is considering entering modern trade (supermarkets, pharmacies). Walk me through the key risks and how you would structure the decision.',
  modelAnswer: {
    hook: 'The question is not "can we afford to enter modern trade" but "what happens to our CLV-to-CAC ratio after we do."',
    plain:
      'Modern trade demands trade margins (typically 20-35%), slotting fees, promotional co-investments, and minimum order quantities. These compress gross margin directly. Meanwhile, the brand may attract new customers who buy at supermarket price points but never become digital loyalists — lower CLV, no data capture, higher CAC in aggregate if trade spend is counted.',
    depth:
      'To structure this decision, we must analyze the trade-offs across four critical pillars: Margin Arithmetic, Channel Conflict, Brand Dilution, and Data Disintermediation. First, model the unit economics: if online gross margin is 70% and offline trade margins (distributor + retail cut) average 45%, plus slotting fees (listing charges) and return-to-origin (RTO) damages, the gross margin will contract to ~20-25%. This directly compresses the margin multiplier in the CLV equation. Second, address channel conflict: retail chains often demand price parity or exclusive discounts, which can cannibalize your higher-margin DTC website. Third, assess brand dilution: premium skincare relies on aspirational packaging and consulting-led sales; placing products on crowded supermarket shelves next to mass-market brands erodes pricing power. Fourth, understand data loss: offline sales yield no customer data, preventing personalized email remarketing. Decision Framework: Only proceed with modern trade if: (a) you launch a dedicated, lower-priced "mass-premium" SKU lineup that does not overlap with hero DTC products; (b) you negotiate a Minimum Advertised Price (MAP) policy; and (c) you embed QR-code-driven digital loyalty incentives on the packaging to claw back customer contact data for lifetime value nurturing.',
  },
  alternatePerspective:
    'Conversely, physical retail shelf presence can serve as a highly effective, non-dilutive brand awareness channel. In an era where digital CPMs (cost per thousand impressions) on Meta and Google have inflated by 40-50%, the slotting fee paid to a premium supermarket chain behaves as a fixed offline marketing cost. Instead of viewing offline as a margin drag, it can be modeled as a customer acquisition engine. The physical visibility drives organic, unprompted brand recall, which in turn reduces online CAC (organic search increases) and improves the blended CLV-to-CAC ratio of the entire enterprise over a 24-month horizon.',
  citations: [
    { id: 1, source: 'NielsenIQ India Modern Trade Report', date: '2025' },
    { id: 2, source: 'Wharton School: Multichannel Retail Strategies', date: '2023' },
  ],
}

export const marketingLibrary: LibraryEntry[] = [
  {
    id: 'lib-mktg-1',
    title: 'Influence: The Psychology of Persuasion',
    author: 'Robert B. Cialdini',
    year: 1984,
    tags: ['marketing'],
    description: 'The six principles of influence — reciprocity, commitment, social proof, authority, liking, scarcity — applied to sales and persuasion. Essential for understanding B2C consumer behaviour.',
    pages: 336,
  },
  {
    id: 'lib-mktg-2',
    title: 'Hooked: How to Build Habit-Forming Products',
    author: 'Nir Eyal',
    year: 2014,
    tags: ['marketing', 'strategy'],
    description: 'The Hook Model (Trigger, Action, Variable Reward, Investment) explains how consumer products engineer habitual engagement.',
    pages: 256,
  },
]

export const marketingCompany: CompanySpotlightContent = {
  companyName: 'Zomato',
  identity: 'Hyperlocal food delivery and quick-commerce platform operator',
  founded: 2008,
  headquarters: 'Gurugram, Haryana, India',
  metrics: [
    { label: 'Market Capitalization', value: 'Rs. 2,15,000 Cr', asOf: 'June 2026', citationId: 101 },
    { label: 'FY25 Reported Revenue', value: 'Rs. 12,114 Cr', asOf: 'March 2025', citationId: 102 },
    { label: 'Food Delivery Market Share', value: '55%', asOf: 'December 2025', citationId: 103 },
    { label: 'Blinkit Quick-Commerce Share', value: '46%', asOf: 'December 2025', citationId: 103 }
  ],
  competitors: [
    { name: 'Swiggy', positioningNote: 'Direct duopoly competitor in food delivery and quick-commerce (Instamart), positioning itself on a premium unified app experience.' },
    { name: 'Zepto', positioningNote: 'Standalone quick-commerce challenger, competing on pure operational speed and local fulfillment excellence.' }
  ],
  industryContext: 'The Indian food delivery market is valued at approximately USD 6.5 Billion (FY25) and is growing at a CAGR of 15%. The quick-commerce sub-sector has experienced explosive growth, expanding at over 60% YoY, as consumer expectations shift from next-day to sub-20-minute delivery for groceries and daily essentials.',
  functionLens: 'Zomato\'s marketing strategy is built on emotional resonance, hyper-local consumer insights, and meme-driven digital advertising. The brand has transitioned from a search-directory app to an indispensable lifestyle platform. A key element of its marketing moat is Zomato Gold, a subscription program designed to lock in high-frequency cohorts, driving purchase frequency and average order value (AOV). Zomato\'s promotional campaigns are notable for their contextual relevance: push notifications are dynamic, triggered by local weather conditions, sports events, or trending pop-culture occurrences. Blinkit\'s acquisition has allowed Zomato to cross-promote and capture the impulse purchase funnel, transforming standard digital search queries into instant conversions. Brand equity is defended through distinct brand voices for Zomato (food delivery) and Blinkit (grocery replenishment), preventing brand contamination.',
  whyItMatters: 'Zomato serves as the classic case study for duopoly dynamics and category expansion. In an interview or GD, cite Zomato to explain how a brand uses emotional connection and push-marketing to manufacture transaction frequency, or how quick-commerce expands the Total Addressable Market (TAM) beyond traditional e-commerce bounds.',
  citations: [
    { id: 101, source: 'National Stock Exchange (NSE) Market Cap Data', date: '2026-06' },
    { id: 102, source: 'Zomato FY25 Audited Earnings Release', date: '2025-05' },
    { id: 103, source: 'Jefferies Research: India Internet Sector Note', date: '2025-12' }
  ]
};
