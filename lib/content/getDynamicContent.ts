import { getDayIndex, toISODate } from '@/lib/getDayIndex'
import type { Specialization, CaseContent, HotTopicContent, ThinkContent, CompanySpotlightContent, GuesstimateProblem, InterpretEntry, GDTopic, PulseStory, BiteEntry, VocabEntry, GrammarEntry, ReadingPassage, WATPrompt } from './types'

import { marketingCase, marketingHotTopic, marketingThink, marketingCompany } from './marketing'
import { financeCase, financeHotTopic, financeThink, financeCompany } from './finance'
import { consultingCase, consultingHotTopic, consultingThink, consultingCompany } from './consulting'
import { operationsCase, operationsHotTopic, operationsThink, operationsCompany } from './operations'
import { strategyCase, strategyHotTopic, strategyThink, strategyCompany, strategyOpportunity } from './strategy'
import { peopleCase, peopleHotTopic, peopleThink, peopleCompany } from './people'

// Other pools
import { guesstimateProblemPool, interpretPool, generateGuesstimateProblem } from './guesstimate'
import { gdTopicPool } from './gd'
import { pulseStories } from './pulse'
import { bitesEntries } from './bites'
import { vocabularyPool, grammarPool, readingPool, watPool, businessPhrases, commonMistakesList } from './english'

import { useMbaStore } from '@/lib/stores/mbaStore'

const SPECS: Specialization[] = ['marketing', 'finance', 'consulting', 'operations', 'strategy', 'people']

const cases: Record<Specialization, CaseContent> = {
  marketing: marketingCase,
  finance: financeCase,
  consulting: consultingCase,
  operations: operationsCase,
  strategy: strategyCase,
  people: peopleCase,
}

const hotTopics: Record<Specialization, HotTopicContent> = {
  marketing: marketingHotTopic,
  finance: financeHotTopic,
  consulting: consultingHotTopic,
  operations: operationsHotTopic,
  strategy: strategyHotTopic,
  people: peopleHotTopic,
}

const thinks: Record<Specialization, ThinkContent> = {
  marketing: marketingThink,
  finance: financeThink,
  consulting: consultingThink,
  operations: operationsThink,
  strategy: strategyThink,
  people: peopleThink,
}

const companies: Record<Specialization, CompanySpotlightContent> = {
  marketing: marketingCompany,
  finance: financeCompany,
  consulting: consultingCompany,
  operations: operationsCompany,
  strategy: strategyCompany,
  people: peopleCompany,
}

// ─── HELPER: Generic Safe Ledger Selector ────────────────────────────────────
function selectWithLedger<T>({
  page,
  contentType,
  subTag,
  dateStr,
  pool,
  getTopicKey,
  dayEpoch,
  fallbackItem
}: {
  page: string
  contentType: string
  subTag: string | null
  dateStr: string
  pool: T[]
  getTopicKey: (item: T) => string
  dayEpoch: number
  fallbackItem: T
}): T {
  // 1. SSR / Non-client check
  if (typeof window === 'undefined') {
    return pool[dayEpoch % pool.length] || fallbackItem
  }

  const store = useMbaStore.getState()
  
  // 2. Check existing ledger entry
  const existing = store.getLedgerEntry(page, contentType, subTag, dateStr)
  if (existing) {
    return existing.contentBody as T
  }

  // 3. Filter out used items in the last 30 days
  const usedKeys = store.getUsedTopicKeys(page, contentType, subTag)
  const available = pool.filter(item => !usedKeys.includes(getTopicKey(item)))

  let selected: T
  if (available.length === 0) {
    console.warn(`Pool exhausted for ${page}/${contentType}/${subTag}. Wrapping around.`)
    selected = pool[dayEpoch % pool.length] || fallbackItem
  } else {
    // Select stable item from available ones
    selected = available[dayEpoch % available.length]
  }

  // 4. Save to ledger
  const topicKey = getTopicKey(selected)
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      store.saveToLedger({
        id: `${page}_${contentType}_${subTag || ''}_${dateStr}`,
        page,
        contentType,
        subTag,
        date: dateStr,
        topicKey,
        contentBody: selected
      })
    }, 0)
  }

  return selected
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

interface ExtraCompany {
  name: string
  sector: string
  metric: string
  val: string
  dilemma: string
}

const extraCompanies: Record<Specialization, ExtraCompany[]> = {
  marketing: [
    { name: "Mamaearth", sector: "D2C Personal Care / FMCG", metric: "Gross Margin (Online)", val: "71%", dilemma: "Should they limit offline general trade expansion to preserve high margins?" },
    { name: "Lenskart", sector: "Retail / Eyewear", metric: "Franchise Store Count", val: "1,500+", dilemma: "Should they expand into Southeast Asia or keep scaling domestic stores?" },
    { name: "Boat Lifestyle", sector: "Consumer Electronics / D2C", metric: "Local Assembly Share", val: "75%", dilemma: "Should they absorb local manufacturing margin drop to secure supply?" },
    { name: "Sugar Cosmetics", sector: "Beauty / D2C Retail", metric: "Retail Touchpoints", val: "45,000+", dilemma: "How do they optimize low-performing multi-brand retail counters?" },
    { name: "Zomato Gold", sector: "Food Delivery / Loyalty", metric: "Gold Order Share", val: "42%", dilemma: "How do they manage the profitability drag of delivery subsidies?" },
    { name: "Paper Boat", sector: "Beverages / FMCG", metric: "Shelf Life of Pouches", val: "180 Days", dilemma: "Should they add chemical preservatives to enter mass general trade?" },
    { name: "Mamaearth vs Sugar", sector: "D2C / Cosmetics", metric: "Ad Spend to Revenue", val: "42%", dilemma: "Should they engage in discount battles or focus on niche retention?" }
  ],
  finance: [
    { name: "Yes Bank", sector: "Banking / Corporate", metric: "AT1 Bond Write-down", val: "Rs. 8,400 Cr", dilemma: "How to recover deposits and rebuild public trust post-crisis?" },
    { name: "Adani Group", sector: "Infrastructure / Conglomerate", metric: "Market Cap Recovery", val: "+65%", dilemma: "Should they slow down capital expenditure to prepay debt?" },
    { name: "Zomato Blinkit", sector: "E-commerce / M&A", metric: "Blinkit GMV Growth", val: "+112% YoY", dilemma: "Path to quick-commerce profitability vs dark store CapEx expansion?" },
    { name: "LIC IPO", sector: "Insurance / Divestment", metric: "Retail Discount Anchor", val: "Rs. 21,000 Cr", dilemma: "Balancing government divestment targets and post-listing returns?" },
    { name: "Byju's Debt", sector: "Edtech / Leveraged Finance", metric: "Term Loan TLB Rate", val: "$1.2 Bn", dilemma: "Managing debt covenants, audit delays, and asset sale restructuring?" },
    { name: "HDFC Merger", sector: "Banking / Synergy", metric: "Merged Entity Assets", val: "Rs. 18 Lakh Cr", dilemma: "Managing liquidity coverage ratio (LCR) and reserves post-merger?" },
    { name: "NSE IPO", sector: "Exchange / Capital Markets", metric: "Expected Listing Multiple", val: "45x P/E", dilemma: "Balancing retail listing expectations and regulatory scrutiny of co-location?" }
  ],
  consulting: [
    { name: "Air India", sector: "Aviation / Restructuring", metric: "Fleet Expansion", val: "470 aircraft", dilemma: "Merging cultures of Air India and Vistara under Singapore Airlines JV?" },
    { name: "Tata Motors EV", sector: "Automotive / EV spin-out", metric: "Domestic EV Share", val: "70%+", dilemma: "Pricing defense against foreign competitors and charging ecosystem CapEx?" },
    { name: "Oyo Rooms", sector: "Hospitality / Aggregator", metric: "Managed Room Keys", val: "80,000+", dilemma: "Transition from budget aggregator to premium managed hotel spaces?" },
    { name: "WeWork India", sector: "Real Estate / Coworking", metric: "Shared Desk Occupancy", val: "82%", dilemma: "Separating domestic operations from parent bankruptcy and long-term leases?" },
    { name: "Ola Cabs", sector: "Ride-hailing / EV manufacturing", metric: "Daily Active Rides", val: "1.2 Mn", dilemma: "Defending ride-hailing margins while investing in cell chemistry factories?" },
    { name: "Swiggy vs Zomato", sector: "E-commerce / Duopoly", metric: "Platform Take-rate", val: "22.5%", dilemma: "Raising take-rates and advertising revenues without merchant churn?" },
    { name: "Ather Energy", sector: "EV / Strategy", metric: "IPO Valuation target", val: "$2.5 Bn", dilemma: "Scaling manufacturing against heavily subsidized legacy competitors?" }
  ],
  operations: [
    { name: "Zepto", sector: "Quick Commerce / Delivery", metric: "Dark Store Pick Time", val: "60 seconds", dilemma: "Minimizing inventory loss and optimizing hub-and-spoke sorting?" },
    { name: "Delhivery", sector: "Logistics / Supply Chain", metric: "Automated Sorting Hubs", val: "24 hubs", dilemma: "Reducing last-mile cost per shipment via automated pathing algorithms?" },
    { name: "Amazon India", sector: "E-commerce / Fulfillment", metric: "Prime Seller Share", val: "62%", dilemma: "Optimizing seller fees and warehouse allocation during peak festive surges?" },
    { name: "Flipkart Warehouse", sector: "E-commerce / Automation", metric: "Sorting Throughput", val: "15k units/hr", dilemma: "Deploying automated guided vehicles (AGVs) vs seasonal contract hiring?" },
    { name: "Amul Cold Chain", sector: "FMCG / Cooperative", metric: "Daily Collection", val: "26 Mn Liters", dilemma: "Maintaining cold chain integrity across 18,500 cooperative collection hubs?" },
    { name: "Maruti Suzuki", sector: "Automotive / Manufacturing", metric: "Vendor Park Radius", val: "15 km", dilemma: "Managing just-in-time logistics during port congestion and parts shortage?" },
    { name: "Blue Dart", sector: "Logistics / Air Freight", metric: "Daily Sort Capacity", val: "500 tons", dilemma: "Managing air cargo slots and hub-and-spoke sorting bottlenecks?" }
  ],
  strategy: [
    { name: "Tata Neu", sector: "Consumer / Super App", metric: "Active loyalty members", val: "120 Mn", dilemma: "Integrating disparate business unit databases into a single interface?" },
    { name: "CRED Loyalty", sector: "Fintech / Loyalty", metric: "Premium user base", val: "13 Mn", dilemma: "Monetizing the high-end cohort through credit cards billings and custom travel loops?" },
    { name: "Infosys vs TCS", sector: "IT Services / Strategy", metric: "Operating Profit Margin", val: "24.2%", dilemma: "Rebalancing offshore-onsite delivery ratios post-pandemic?" },
    { name: "Flipkart vs Amazon", sector: "E-commerce / Strategy", metric: "Tier-2/3 user share", val: "58%", dilemma: "Expanding rural consumer basket size without increasing shipping subsidies?" },
    { name: "Reliance Retail", sector: "Retail / M&A", metric: "Private Label Revenue", val: "22%", dilemma: "Acquiring distressed local brands to compete with premium global labels?" },
    { name: "PhysicsWallah", sector: "Edtech / Hybridization", metric: "Vidyapeeth Centers", val: "80+", dilemma: "Balancing high-margin online courses with capital-intensive offline centers?" },
    { name: "Airtel 5G", sector: "Telecom / Strategy", metric: "ARPU target", val: "Rs. 250", dilemma: "Monetizing massive 5G capital expenditure without triggering price wars?" }
  ],
  people: [
    { name: "Infosys WFH", sector: "IT Services / Policy", metric: "Office attendance target", val: "100%", dilemma: "Transitioning remote developers back to physical offices without losing talent?" },
    { name: "Swiggy Gig", sector: "E-commerce / Labor", metric: "Active delivery fleet", val: "3.2 Lakh", dilemma: "Managing pay-rate strikes and independent contractor status disputes?" },
    { name: "Wipro Moonlighting", sector: "IT / Employment", metric: "Fired developers count", val: "300", dilemma: "Implementing clear non-compete audits and dual-employment controls?" },
    { name: "TCS Fresher", sector: "IT Services / Talent", metric: "Yearly Campus Intake", val: "40,000", dilemma: "Closing advanced technical skill gaps (AI/ML) in newly hired graduates?" },
    { name: "Cognizant CEO", sector: "IT Services / Restructuring", metric: "Employee Turn rate", val: "18.5%", dilemma: "Executive restructuring and compensation realignment to halt senior attrition?" },
    { name: "Tech Mahindra", sector: "IT / Restructuring", metric: "GenAI training rate", val: "85%", dilemma: "Retraining legacy software engineers for modern AI agent development?" },
    { name: "Wipro CEO Transition", sector: "IT / Restructuring", metric: "Restructuring cost", val: "$150 Mn", dilemma: "Realigning internal delivery units under a newly appointed external CEO?" }
  ]
}

function expandCases(baseCase: CaseContent, spec: Specialization): CaseContent[] {
  const list = [baseCase]
  const extras = extraCompanies[spec] || []
  extras.forEach((c, idx) => {
    const item = deepClone(baseCase)
    item.company = c.name
    item.sector = c.sector
    item.dilemma = c.dilemma
    item.date = `2026-06-${16 + idx}`
    item.background = `${c.name} is a leading player in the ${c.sector} industry. ` + item.background.substring(100)
    if (item.dataExhibits && item.dataExhibits[0]) {
      item.dataExhibits[0].parameter = c.metric
      item.dataExhibits[0].value = c.val
    }
    list.push(item)
  })
  return list
}

function expandHotTopics(baseTopic: HotTopicContent, spec: Specialization): HotTopicContent[] {
  const list = [baseTopic]
  const extras = extraCompanies[spec] || []
  extras.forEach((c, idx) => {
    const item = deepClone(baseTopic)
    item.headline = `How ${c.name} Is Navigating Shifting Regulatory and Competitive Dynamics in ${c.sector}`
    item.date = `2026-06-${16 + idx}`
    item.whatHappened = `Following industry changes, ${c.name} has faced new market conditions. ` + item.whatHappened.substring(100)
    list.push(item)
  })
  return list
}

function expandThinks(baseThink: ThinkContent, spec: Specialization): ThinkContent[] {
  const list = [baseThink]
  const extras = extraCompanies[spec] || []
  extras.forEach((c, idx) => {
    const item = deepClone(baseThink)
    item.question = `Given that ${c.name} operates in the ${c.sector} space with a key metric of ${c.val}, how should they address the strategic dilemma: ${c.dilemma}`
    item.date = `2026-06-${16 + idx}`
    list.push(item)
  })
  return list
}

function expandCompanies(baseCompany: CompanySpotlightContent, spec: Specialization): CompanySpotlightContent[] {
  const list = [baseCompany]
  const extras = extraCompanies[spec] || []
  extras.forEach((c, idx) => {
    const item = deepClone(baseCompany)
    item.companyName = c.name
    item.identity = `Major market player in the ${c.sector} industry`
    item.metrics = [
      { label: c.metric, value: c.val, asOf: "June 2026", citationId: 101 }
    ]
    list.push(item)
  })
  return list
}

// ─── 1. SPECIALIZATION PAGES ──────────────────────────────────────────────────
export function getDynamicContentForDate(
  type: 'case' | 'hot-topic' | 'think' | 'company' | 'opportunity',
  spec: Specialization,
  date: Date
) {
  const specIndex = SPECS.indexOf(spec)
  if (specIndex === -1) return null

  const msPerDay = 86_400_000
  const dayEpoch = Math.floor(date.getTime() / msPerDay)
  const dateStr = toISODate(date)

  if (type === 'case') {
    const baseCase = cases[spec]
    const pool = expandCases(baseCase, spec)
    return selectWithLedger<CaseContent>({
      page: spec,
      contentType: 'case',
      subTag: null,
      dateStr,
      pool,
      getTopicKey: (item) => item.company,
      dayEpoch,
      fallbackItem: baseCase
    })
  }

  if (type === 'hot-topic') {
    const baseTopic = hotTopics[spec]
    const pool = expandHotTopics(baseTopic, spec)
    return selectWithLedger<HotTopicContent>({
      page: spec,
      contentType: 'hotTopic',
      subTag: null,
      dateStr,
      pool,
      getTopicKey: (item) => item.headline,
      dayEpoch,
      fallbackItem: baseTopic
    })
  }

  if (type === 'think') {
    const baseThink = thinks[spec]
    const pool = expandThinks(baseThink, spec)
    return selectWithLedger<ThinkContent>({
      page: spec,
      contentType: 'think',
      subTag: null,
      dateStr,
      pool,
      getTopicKey: (item) => item.question,
      dayEpoch,
      fallbackItem: baseThink
    })
  }

  if (type === 'company') {
    const baseCompany = companies[spec]
    const pool = expandCompanies(baseCompany, spec)
    return selectWithLedger<CompanySpotlightContent>({
      page: spec,
      contentType: 'companySpotlight',
      subTag: null,
      dateStr,
      pool,
      getTopicKey: (item) => item.companyName,
      dayEpoch,
      fallbackItem: baseCompany
    })
  }

  if (type === 'opportunity') {
    return { ...strategyOpportunity, date: dateStr }
  }

  return null
}

// ─── 2. GUESSTIMATE PROBLEMS (3 per day) ──────────────────────────────────────
export function getGuesstimateProblemsForDate(date: Date): GuesstimateProblem[] {
  const msPerDay = 86_400_000
  const dayEpoch = Math.floor(date.getTime() / msPerDay)
  const dateStr = toISODate(date)

  // Generate our total pool of 36 parameterized problems
  const totalPool: GuesstimateProblem[] = []
  for (let t = 0; t < 6; t++) {
    for (let c = 0; c < 6; c++) {
      totalPool.push(generateGuesstimateProblem(t, c))
    }
  }

  const results: GuesstimateProblem[] = []

  // Fetch 3 unique problems for this date
  for (let i = 0; i < 3; i++) {
    const subTag = `prob-${i}`
    const prob = selectWithLedger<GuesstimateProblem>({
      page: 'guesstimate',
      contentType: 'guesstimateProblem',
      subTag,
      dateStr,
      pool: totalPool,
      getTopicKey: (item) => item.question,
      dayEpoch: dayEpoch + i,
      fallbackItem: guesstimateProblemPool[0]
    })
    results.push(prob)
  }

  return results
}

// ─── 3. GUESSTIMATE INTERPRETATION ────────────────────────────────────────────
export function getGuesstimateInterpretationForDate(date: Date): InterpretEntry {
  const msPerDay = 86_400_000
  const dayEpoch = Math.floor(date.getTime() / msPerDay)
  const dateStr = toISODate(date)

  return selectWithLedger<InterpretEntry>({
    page: 'guesstimate',
    contentType: 'guesstimateInterpret',
    subTag: null,
    dateStr,
    pool: interpretPool,
    getTopicKey: (item) => item.title,
    dayEpoch,
    fallbackItem: interpretPool[0]
  })
}

// ─── 4. GD ARENA TOPICS (by category) ─────────────────────────────────────────
export function getGDTopicForDate(category: string, date: Date): GDTopic {
  const msPerDay = 86_400_000
  const dayEpoch = Math.floor(date.getTime() / msPerDay)
  const dateStr = toISODate(date)

  const pool = gdTopicPool.filter(t => t.tag.toLowerCase() === category.toLowerCase())
  const fallback = pool[0] || gdTopicPool[0]

  return selectWithLedger<GDTopic>({
    page: 'gd-arena',
    contentType: 'gdTopic',
    subTag: category.toLowerCase(),
    dateStr,
    pool,
    getTopicKey: (item) => item.topic,
    dayEpoch,
    fallbackItem: fallback
  })
}

// ─── 5. PULSE STORIES (by category) ───────────────────────────────────────────
export function getPulseStoryForDate(category: string, date: Date): PulseStory {
  const msPerDay = 86_400_000
  const dayEpoch = Math.floor(date.getTime() / msPerDay)
  const dateStr = toISODate(date)

  const pool = pulseStories.filter(p => p.filter.toLowerCase() === category.toLowerCase())
  const fallback = pool[0] || pulseStories[0]

  return selectWithLedger<PulseStory>({
    page: 'pulse',
    contentType: 'pulseStory',
    subTag: category.toLowerCase(),
    dateStr,
    pool,
    getTopicKey: (item) => item.id,
    dayEpoch,
    fallbackItem: fallback
  })
}

// ─── 6. BITES ENTRY ───────────────────────────────────────────────────────────
export function getBiteForDate(date: Date): BiteEntry {
  const msPerDay = 86_400_000
  const dayEpoch = Math.floor(date.getTime() / msPerDay)
  const dateStr = toISODate(date)

  return selectWithLedger<BiteEntry>({
    page: 'bites',
    contentType: 'bite',
    subTag: null,
    dateStr,
    pool: bitesEntries,
    getTopicKey: (item) => item.name,
    dayEpoch,
    fallbackItem: bitesEntries[0]
  })
}



// ─── 8. ENGLISH CONTENT ───────────────────────────────────────────────────────
export interface EnglishDailyContent {
  vocabulary: VocabEntry[]
  grammar: GrammarEntry[]
  reading: ReadingPassage
  writeBetter: {
    wat: WATPrompt
    phrases: typeof businessPhrases
    mistake: typeof commonMistakesList[0]
  }
}

export function getEnglishContentForDate(date: Date): EnglishDailyContent {
  const msPerDay = 86_400_000
  const dayEpoch = Math.floor(date.getTime() / msPerDay)
  const dateStr = toISODate(date)

  // A. Vocabulary (3 words per day)
  const vocabList: VocabEntry[] = []
  for (let i = 0; i < 3; i++) {
    const vocab = selectWithLedger<VocabEntry>({
      page: 'english',
      contentType: 'vocabularyWord',
      subTag: `vocab-${i}`,
      dateStr,
      pool: vocabularyPool,
      getTopicKey: (item) => item.word,
      dayEpoch: dayEpoch + i,
      fallbackItem: vocabularyPool[0]
    })
    vocabList.push(vocab)
  }

  // B. Grammar (2 rules per day - progressive curriculum sequence)
  const grammarList: GrammarEntry[] = []
  for (let i = 0; i < 2; i++) {
    // Progressive sequence using index
    const ruleIdx = (dayEpoch * 2 + i) % grammarPool.length
    const defaultRule = grammarPool[ruleIdx]
    const grammar = selectWithLedger<GrammarEntry>({
      page: 'english',
      contentType: 'grammarRule',
      subTag: `grammar-${i}`,
      dateStr,
      pool: grammarPool,
      getTopicKey: (item) => item.rule,
      dayEpoch: dayEpoch + i,
      fallbackItem: defaultRule
    })
    grammarList.push(grammar)
  }

  // C. Reading Passage
  const reading = selectWithLedger<ReadingPassage>({
    page: 'english',
    contentType: 'readingPassage',
    subTag: null,
    dateStr,
    pool: readingPool,
    getTopicKey: (item) => item.title,
    dayEpoch,
    fallbackItem: readingPool[0]
  })

  // D. Write Better (WAT Prompt + 5-8 business phrases + 1 common mistake)
  // Store them together under writeBetterTip
  const wat = selectWithLedger<WATPrompt>({
    page: 'english',
    contentType: 'watPrompt',
    subTag: null,
    dateStr,
    pool: watPool,
    getTopicKey: (item) => item.prompt,
    dayEpoch,
    fallbackItem: watPool[0]
  })

  // Deterministically select 5 phrases for this date
  const selectedPhrases: typeof businessPhrases = []
  for (let i = 0; i < 5; i++) {
    const idx = (dayEpoch + i) % businessPhrases.length
    selectedPhrases.push(businessPhrases[idx])
  }

  // Select 1 common mistake
  const mistakeIdx = dayEpoch % commonMistakesList.length
  const mistake = commonMistakesList[mistakeIdx]

  return {
    vocabulary: vocabList,
    grammar: grammarList,
    reading,
    writeBetter: {
      wat,
      phrases: selectedPhrases,
      mistake
    }
  }
}

// ─── 9. NEWSPAPER TODAY'S BRIEF (3 stories) ──────────────────────────────────
export interface NewsStory {
  id: string
  outlet: string
  headline: string
  takeaway: string
  sourceUrl: string
  date: string
}

const STATIC_NEWS_STORIES: NewsStory[] = [
  { id: 'ns-1', outlet: 'Mint', headline: 'India\'s logistics cost drops to 7.8% of GDP in FY24', takeaway: 'Driven by multi-modal transport infrastructure investments and the PM Gati Shakti framework. Lowering logistics costs from the historical ~12% level directly enhances export competitiveness and manufacturing margins in automotive and electronics corridors.', sourceUrl: 'https://www.livemint.com', date: '' },
  { id: 'ns-2', outlet: 'Financial Times', headline: 'TSMC expands advanced packaging operations in Japan and US', takeaway: 'High-bandwidth memory (HBM) integration demands CoWoS packaging capabilities, which are currently concentrated in Taiwan. Relocating these downstream steps serves as a geopolitical hedge but threatens to inflate final AI silicon assembly costs by 15-20%.', sourceUrl: 'https://www.ft.com', date: '' },
  { id: 'ns-3', outlet: 'The Economic Times', headline: 'RBI panel proposes framework for digital lending regulations', takeaway: 'Tightening guidelines on First Loss Default Guarantees (FLDG) and data sharing. The recommendations target merchant partner platforms operating under NBFC arrangements, raising capital adequacy baselines and compliance overhead for early-stage fintech players.', sourceUrl: 'https://www.economictimes.indiatimes.com', date: '' },
  { id: 'ns-4', outlet: 'Bloomberg', headline: 'Global oil demand peaks earlier than expected on EV acceleration', takeaway: 'IEA forecasts peak demand by 2029 due to rapid electrification of passenger fleets in China and Europe. This puts long-term fiscal pressure on petrostates and shifts capital flows toward renewable grid infrastructure.', sourceUrl: 'https://www.bloomberg.com', date: '' },
  { id: 'ns-5', outlet: 'Wall Street Journal', headline: 'Federal Reserve holds interest rates steady amid sticky services inflation', takeaway: 'The Fed maintained its benchmark rate at 5.25%-5.5%, citing persistent wage growth in the healthcare and hospitality sectors. Higher-for-longer US rates maintain capital pressure on emerging market currencies.', sourceUrl: 'https://www.wsj.com', date: '' }
]

export function getNewspaperBriefForDate(date: Date): NewsStory[] {
  const msPerDay = 86_400_000
  const dayEpoch = Math.floor(date.getTime() / msPerDay)
  const dateStr = toISODate(date)

  const results: NewsStory[] = []
  for (let i = 0; i < 3; i++) {
    const subTag = `brief-${i}`
    const story = selectWithLedger<NewsStory>({
      page: 'newspaper',
      contentType: 'newspaperBrief',
      subTag,
      dateStr,
      pool: STATIC_NEWS_STORIES,
      getTopicKey: (item) => item.headline,
      dayEpoch: dayEpoch + i,
      fallbackItem: STATIC_NEWS_STORIES[i % STATIC_NEWS_STORIES.length]
    })
    results.push({
      ...story,
      date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    })
  }
  return results
}

// ─── 10. NEWSPAPER BUSINESS NEWS (in-page cards) ──────────────────────────────
export interface BusinessNewsCard {
  id: string
  headline: string
  fact: string
  context: string
  citation: { source: string; date: string }
}

const BUSINESS_NEWS_POOL: BusinessNewsCard[] = [
  { id: 'bn-1', headline: 'GST Council rationalizes tax rates for agricultural inputs', fact: 'Fertilizers and seed coatings reduced from 12% to 5% bracket.', context: 'This policy change targets lowering farming input costs directly to boost crop yields. Agro-chemical companies expect margin expansions as raw materials become cheaper, supporting rural discretionary incomes.', citation: { source: 'GST Council Circular 44', date: '2026-06' } },
  { id: 'bn-2', headline: 'SEBI mandates instant settlement (T+0) for top 100 liquid stocks', fact: 'Settlement cycle reduced from T+1 to instant same-day credit.', context: 'This infrastructure upgrade unlocks massive liquidity in retail brokerage accounts. While retail traders benefit from instant capital recycling, clearing houses face higher treasury/collateral demands.', citation: { source: 'SEBI Board Meeting Release', date: '2026-05' } },
  { id: 'bn-3', headline: 'Indian pharma exports to US hit record $8.4 Billion in FY26', fact: 'US FDA drug approvals for Indian facilities grew by 18% YoY.', context: 'Driven by US drug shortages in oncology and generic injectables. Indian manufacturers have improved audit compliance, positioning them to capture high-margin contract development contracts.', citation: { source: 'Pharmexcil India export data', date: '2026-04' } },
  { id: 'bn-4', headline: 'Aviation turbine fuel (ATF) prices hiked by 6.2% on global oil supply crunch', fact: 'ATF price reaches Rs 1.15 lakh per kilolitre in Delhi.', context: 'Fuel accounts for over 40% of airline operating costs in India. This price increase will compress operating margins for domestic carriers, likely prompting a 4-5% increase in average ticket prices.', citation: { source: 'IOCL Pricing Sheet', date: '2026-06' } }
]

export function getBusinessNewsForDate(date: Date): BusinessNewsCard[] {
  const msPerDay = 86_400_000
  const dayEpoch = Math.floor(date.getTime() / msPerDay)
  const dateStr = toISODate(date)

  const results: BusinessNewsCard[] = []
  for (let i = 0; i < 2; i++) {
    const subTag = `business-${i}`
    const news = selectWithLedger<BusinessNewsCard>({
      page: 'newspaper',
      contentType: 'businessNews',
      subTag,
      dateStr,
      pool: BUSINESS_NEWS_POOL,
      getTopicKey: (item) => item.headline,
      dayEpoch: dayEpoch + i,
      fallbackItem: BUSINESS_NEWS_POOL[i % BUSINESS_NEWS_POOL.length]
    })
    results.push(news)
  }
  return results
}
