// ─── Core content types for the Pravah MBA module ───────────────────────────
// All dynamic content is typed here. Mock implementations in sibling files.
// TODO: Wire each content type to Firestore collection — Phase 5

export type Specialization =
  | 'marketing'
  | 'finance'
  | 'consulting'
  | 'operations'
  | 'strategy'
  | 'people'

export interface CitationData {
  id: number
  source: string
  date: string   // ISO date string, e.g. "2024-03"
  url?: string
}

// ─── AltitudeBlock ─────────────────────────────────────────────────────────
export interface AltitudeBlockContent {
  hook: string
  plain: string
  depth: string
  citations?: CitationData[]
}

// ─── Concepts tab ──────────────────────────────────────────────────────────
export interface ConceptEntry {
  id: string
  title: string
  category: string
  altitude: AltitudeBlockContent
}

// ─── Case tab ───────────────────────────────────────────────────────────────
export interface CaseStakeholder {
  name: string
  role: string
  interest: string
}

export interface AssumptionRow {
  parameter: string
  value: string
  source: CitationData
  sensitivity: string
}

export interface CaseContent {
  date: string
  company: string
  sector: string
  background: string
  dataExhibits?: AssumptionRow[]
  dilemma: string
  stakeholders: CaseStakeholder[]
  lenses: {
    strategy: string
    finance: string
    marketing: string
    operations: string
  }
  recommendation: string
  commonMistakes: string[]
  citations: CitationData[]
}

// ─── Hot Topic tab ──────────────────────────────────────────────────────────
export interface HotTopicStakeholder {
  name: string
  gains: string
  loses: string
}

export interface Scenario {
  label: 'Best' | 'Worst' | 'Likely'
  description: string
}

export interface HotTopicContent {
  date: string
  headline: string
  whatHappened: string
  rootCause: string
  stakeholders: HotTopicStakeholder[]
  businessImplications: string
  scenarios: Scenario[]
  citations: CitationData[]
}

// ─── Think tab ─────────────────────────────────────────────────────────────
export interface ThinkContent {
  date: string
  question: string
  modelAnswer: AltitudeBlockContent
  alternatePerspective: string
  citations: CitationData[]
}

// ─── Opportunity tab (Strategy only) ────────────────────────────────────────
export interface OpportunityContent {
  date: string
  problemStatement: string
  rootCause: string
  approaches: string[]
  actionStep: string
  citations: CitationData[]
}

// ─── Library ────────────────────────────────────────────────────────────────
export interface LibraryEntry {
  id: string
  title: string
  author: string
  year: number
  tags: Specialization[]
  description: string
  url?: string
  pages?: number
}

// ─── English page ───────────────────────────────────────────────────────────
export interface VocabEntry {
  word: string
  roots: string
  definition: string
  exampleSentence: string
  examples?: string[]
  misuseNote?: string
  usedIn: string   // e.g. "Used in strategy memos"
}

export interface GrammarEntry {
  rule: string
  examples: string[]
  commonError: string
  drill?: {
    sentence: string
    explanation: string
  }
}

export interface ReadingPassage {
  title: string
  passage: string
  questions: {
    question: string
    answer: string
  }[]
}

export interface WATPrompt {
  prompt: string
  speltReminder: {
    S: string; P: string; E: string; L: string; T: string
  }
  modelEssay: string
}

// ─── Guesstimate page ───────────────────────────────────────────────────────
export interface GuesstimateProblem {
  question: string
  approach1: {
    name: string
    rows: AssumptionRow[]
    result: string
  }
  approach2: {
    name: string
    rows: AssumptionRow[]
    result: string
  }
  citations: CitationData[]
}

export interface InterpretEntry {
  title: string
  description: string
  tableData?: { headers: string[]; rows: string[][] }
  questions: { question: string; answer: string }[]
  citations: CitationData[]
}

// ─── GD Arena ───────────────────────────────────────────────────────────────
export type GDTag = 'Current' | 'Business' | 'Abstract' | 'Tech' | 'Ethics'

export interface GDTopic {
  topic: string
  tag: GDTag
  framing: string
  forPoints: { point: string; citations?: CitationData[] }[]
  againstPoints: { point: string; citations?: CitationData[] }[]
  closingStructure: string
  wayForward?: string
  citations: CitationData[]
}

// ─── Interview Prep ─────────────────────────────────────────────────────────
export type InterviewCategory =
  | 'Background'
  | 'Why MBA'
  | 'Ethics'
  | 'Hobbies'
  | 'Current Affairs'

export interface InterviewQuestion {
  question: string
  pointers: string[]
  pitfalls: string[]
}

export interface InterviewCategory_Entry {
  category: InterviewCategory
  questions: InterviewQuestion[]
}

// ─── Pulse ─────────────────────────────────────────────────────────────────
export type PulseFilter = 'Markets' | 'Policy' | 'Corporate' | 'Trade' | 'Tech'

export interface PulseStory {
  id: string
  filter: PulseFilter
  whatHappened: string
  numbers: { stat: string; citation: CitationData }[]
  whyItMatters: string
  sectorImpact: string
  forwardLookingLine: string
}

// ─── India Facts ─────────────────────────────────────────────────────────────
export type IndiaFactCategory =
  | 'Macro'
  | 'Demographics'
  | 'Labour'
  | 'Social'
  | 'Global Standing'

export type TrendDirection = 'up' | 'down' | 'flat'

export interface IndiaFact {
  label: string
  value: string
  citation: CitationData
  trend: TrendDirection
  note?: string
}

export interface IndiaFactSection {
  category: IndiaFactCategory
  facts: IndiaFact[]
}



// ─── Bites ──────────────────────────────────────────────────────────────────
export type BiteType = 'Cognitive Bias' | 'Economic Effect' | 'Law' | 'Food Origin'

export interface BiteEntry {
  date: string
  type: BiteType
  name: string
  altitude: AltitudeBlockContent
  citations: CitationData[]
}

// ─── Home / DayCard ─────────────────────────────────────────────────────────
export interface DayCardData {
  room: string
  slug: string
  specialization?: Specialization
  headline: string
  teaser: string
  hasNewContent: boolean
}

// ─── Progress / Recall ──────────────────────────────────────────────────────
export type RecallResult = 'got-it' | 'shaky' | 'no'

export interface RecallRecord {
  conceptId: string
  result: RecallResult
  date: string   // ISO date
  nextReviewDate: string
}

// ─── Company Spotlight ──────────────────────────────────────────────────────
export interface CompanyMetric {
  label: string
  value: string
  asOf: string
  citationId: number
}

export interface CompanyCompetitor {
  name: string
  positioningNote: string
}

export interface CompanySpotlightContent {
  companyName: string
  identity: string
  founded: number
  headquarters: string
  metrics: CompanyMetric[]
  competitors: CompanyCompetitor[]
  industryContext: string
  functionLens: string
  whyItMatters: string
  citations: CitationData[]
}

// ─── Content Ledger & Favorites ──────────────────────────────────────────────
export interface ContentLedgerEntry {
  id: string                   // auto-generated doc id
  page: string                 // e.g. "marketing", "guesstimate", "gd-arena", "english"
  contentType: string          // e.g. "case", "hotTopic", "companySpotlight", "think", "guesstimateProblem", "gdTopic", "pulseStory", "bite", "vocabularyWord", "grammarRule", "readingPassage", "writeBetterTip"
  subTag: string | null        // sub-tag/category or null
  date: string                 // YYYY-MM-DD
  topicKey: string             // normalized key identifying the subject matter (e.g. "paytm")
  contentBody: any             // the actual content payload
}

export interface FavoriteEntry {
  id: string
  contentLedgerId: string      // references content_ledger doc id
  savedAt: number              // timestamp
  page: string                 // denormalized page
  contentType: string          // denormalized contentType
  type: 'heart' | 'bookmark'
  collections?: string[]
}

// ─── Notes & Journal ────────────────────────────────────────────────────────
export interface NoteEntry {
  id: string
  contentRef: string           // references a ledgerId (e.g. "marketing_case__2026-07-06")
  contentTitle: string
  contentType: string
  page: string
  noteText: string
  updatedAt: number
}

export interface JournalEntry {
  date: string                 // YYYY-MM-DD
  text: string
  wordCount: number
  promptUsed: string | null
  updatedAt: number
}

