import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

let dbInstance: ReturnType<typeof getFirestore> | null = null;

function getDb() {
  if (dbInstance) return dbInstance;

  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('[generate-daily] Firebase Admin credentials are not set in environment variables.');
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  }

  dbInstance = getFirestore();
  return dbInstance;
}

// Security: only Vercel cron or your admin secret can call this
function isAuthorized(request: NextRequest): boolean {
  const cronHeader = request.headers.get('x-vercel-cron-schedule');
  const adminSecret = request.headers.get('x-admin-secret');
  return !!cronHeader || adminSecret === process.env.ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Support manual date override for backfill: ?date=2026-07-08
  const dateParam = new URL(request.url).searchParams.get('date');
  const targetDate = dateParam ?? new Date().toISOString().split('T')[0];

  console.log(`[generate-daily] Running for date: ${targetDate}`);

  try {
    await generateAllContent(targetDate);
    return NextResponse.json({ success: true, date: targetDate });
  } catch (error) {
    console.error('[generate-daily] Failed:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// ─── SYSTEM PROMPT (shared across all Gemini calls) ───────────────
const SYSTEM = `You are an elite MBA knowledge editor for Altius, a placement
preparation app used by students at IIM Ahmedabad, IIM Bangalore, IIM
Calcutta, ISB, XLRI, and SP Jain. All content must be:
- Accurate with real company names, real data points, real market figures
- Every number must include source and approximate date (e.g. "as of FY2025")
- Analytically rigorous but explained in plain, jargon-free English
- Detailed and comprehensive — never thin or generic
- Output ONLY valid JSON. No markdown, no backticks, no preamble, no postamble.`;

// ─── MAIN ORCHESTRATOR ────────────────────────────────────────────
async function generateAllContent(date: string) {
  const pages = [
    'marketing', 'finance', 'consulting',
    'operations', 'strategy', 'people'
  ];

  // Generate all page content in parallel (6 pages × 4 types = 24 calls)
  // But batch to avoid Gemini rate limits — 3 pages at a time
  for (let i = 0; i < pages.length; i += 3) {
    const batch = pages.slice(i, i + 3);
    await Promise.all(batch.map(page => generatePageContent(page, date)));
    // Small delay between batches to respect rate limits
    if (i + 3 < pages.length) await sleep(2000);
  }

  // Sequential for remaining pages (they have different structures)
  await generateGuesstimates(date);
  await generateGDTopics(date);
  await generateDigestStories(date);
  await generateInsights(date);
  await generateExplore(date);
  await generateNewspaperBrief(date);
  await generateEnglishContent(date);

  // Mark this date as generated
  const db = getDb();
  await db.collection('generation_log').doc(date).set({
    generatedAt: new Date().toISOString(),
    status: 'complete'
  });
}

// ─── HELPER: Get used topicKeys to prevent repetition ─────────────
async function getUsedTopicKeys(
  page: string,
  contentType: string,
  subTag?: string
): Promise<Set<string>> {
  const db = getDb();
  // Only look back 5 months (150 days) — earlier content can repeat
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 150);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  let query = db.collection('content_ledger')
    .where('page', '==', page)
    .where('contentType', '==', contentType)
    .where('date', '>=', cutoffStr);

  if (subTag) {
    query = query.where('subTag', '==', subTag) as any;
  }

  const snapshot = await query.get();
  return new Set(snapshot.docs.map(d => d.data().topicKey as string));
}

// ─── HELPER: Write to ledger + page doc ───────────────────────────
async function writeContent(
  page: string,
  contentType: string,
  date: string,
  topicKey: string,
  content: object,
  subTag?: string
) {
  const db = getDb();
  const batch = db.batch();

  // Write to content_ledger for no-repeat tracking
  const ledgerRef = db.collection('content_ledger').doc();
  batch.set(ledgerRef, {
    page, contentType, date, topicKey, subTag: subTag ?? null,
    createdAt: new Date().toISOString()
  });

  // Write to the page's daily content document
  const docId = subTag ? `${page}_${contentType}_${subTag}_${date}` : `${page}_${contentType}_${date}`;
  const contentRef = db.collection('daily_content').doc(docId);
  batch.set(contentRef, {
    page, contentType, date, topicKey, subTag: subTag ?? null,
    content,
    contentBody: content, // Support both content and contentBody for client components
    generatedAt: new Date().toISOString()
  });

  await batch.commit();
}

// ─── HELPER: Lazy load Gemini model ────────────────────────────────
let modelInstance: any = null;

function getModel() {
  if (modelInstance) return modelInstance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('[generate-daily] GEMINI_API_KEY is not set in environment variables.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  modelInstance = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  return modelInstance;
}

// ─── HELPER: Call Gemini safely ────────────────────────────────────
async function callGemini(prompt: string): Promise<object> {
  const fullPrompt = `${SYSTEM}\n\n${prompt}`;
  const model = getModel();
  const result = await model.generateContent(fullPrompt);
  const text = result.response.text().trim();

  // Strip any accidental markdown wrapping
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error('[callGemini] JSON parse failed. Raw response:', text.substring(0, 500));
    throw new Error('Gemini returned invalid JSON');
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════════
// SECTION A: SPECIALIZATION PAGES (Marketing, Finance, etc.)
// ═══════════════════════════════════════════════════════════════════

async function generatePageContent(page: string, date: string) {
  await Promise.all([
    generateCase(page, date),
    generateHotTopic(page, date),
    generateCompanySpotlight(page, date),
    generateThink(page, date),
  ]);
}

// ─── CASE ─────────────────────────────────────────────────────────
async function generateCase(page: string, date: string) {
  const used = await getUsedTopicKeys(page, 'case');
  const exclusions = Array.from(used).join(', ') || 'none yet';

  const functionDescriptions: Record<string, string> = {
    marketing: 'brand strategy, consumer behavior, marketing campaigns, D2C, FMCG, advertising, market entry',
    finance: 'valuation, M&A deals, capital markets, financial restructuring, BFSI sector, IPOs, PE/VC',
    consulting: 'strategic dilemmas, market entry, profitability, organizational transformation, turnaround',
    operations: 'supply chain, manufacturing efficiency, logistics, automation, process design, capacity planning',
    strategy: 'competitive positioning, platform business models, disruption, corporate strategy, diversification',
    people: 'organizational behavior, leadership dilemmas, culture change, talent management, DEI, performance management',
  };

  const data = await callGemini(`
Generate one detailed MBA case study for the ${page.toUpperCase()} specialization.
Focus areas for ${page}: ${functionDescriptions[page]}.

DO NOT cover any company/topic already in this list: [${exclusions}]

Return JSON with these exact keys:
{
  "topicKey": "unique-slug-for-this-case",
  "companyName": "Real company name",
  "industry": "Industry name",
  "country": "Country",
  "dilemma": "One sharp strategic question this case centers on (max 30 words)",
  "background": "Detailed company background, market context, competitive landscape, and exactly WHY this dilemma exists NOW. Include founding story, business model, revenue scale, market position, and the specific trigger event. Minimum 400 words.",
  "exhibits": [
    {"label": "Metric name", "value": "Value with unit", "asOf": "Month Year", "source": "Source name"}
  ],
  "stakeholders": [
    {"name": "Stakeholder", "incentive": "What they want", "fear": "What they're afraid of"}
  ],
  "fourLens": {
    "strategy": "200-word strategic analysis applying Porter, Blue Ocean, or relevant framework",
    "finance": "200-word financial analysis with NPV logic, margin analysis, or capital considerations",
    "marketing": "200-word marketing/customer analysis",
    "operations": "200-word operational feasibility and execution analysis"
  },
  "recommendation": "250-word integrated recommendation: what to do, why, key trade-offs, and implementation priority",
  "commonMistakes": ["Mistake 1 average candidates make", "Mistake 2", "Mistake 3"],
  "topTeamDifference": "150 words explaining what the top 1% of case teams do differently on this type of case",
  "keyTakeaway": "One memorable insight from this case for GD/interview use"
}
`) as any;

  // Map back to expected client structure
  const mappedExhibits = (data.exhibits || []).map((e: any, idx: number) => ({
    parameter: e.label || '',
    value: e.value || '',
    source: { id: idx + 1, source: e.source || 'Report', date: e.asOf || '' },
    sensitivity: 'Medium'
  }));

  const mappedStakeholders = (data.stakeholders || []).map((s: any) => ({
    name: s.name || '',
    role: s.name || '',
    interest: `Wants: ${s.incentive || ''}. Fears: ${s.fear || ''}`
  }));

  const mappedCitations = (data.exhibits || []).map((e: any, idx: number) => ({
    id: idx + 1,
    source: e.source || 'Report',
    date: e.asOf || ''
  }));

  const mapped = {
    date,
    company: data.companyName || '',
    sector: `${data.industry || ''} / ${data.country || ''}`,
    background: data.background || '',
    dilemma: data.dilemma || '',
    dataExhibits: mappedExhibits,
    stakeholders: mappedStakeholders,
    lenses: {
      strategy: data.fourLens?.strategy || '',
      finance: data.fourLens?.finance || '',
      marketing: data.fourLens?.marketing || '',
      operations: data.fourLens?.operations || '',
    },
    recommendation: data.recommendation || '',
    commonMistakes: data.commonMistakes || [],
    citations: mappedCitations,
    topTeamDifference: data.topTeamDifference || '',
    keyTakeaway: data.keyTakeaway || '',
  };

  await writeContent(page, 'case', date, data.topicKey, mapped);
}

// ─── HOT TOPIC ────────────────────────────────────────────────────
async function generateHotTopic(page: string, date: string) {
  const used = await getUsedTopicKeys(page, 'hotTopic');
  const exclusions = Array.from(used).join(', ') || 'none yet';

  const data = await callGemini(`
Generate one current business hot topic for the ${page.toUpperCase()} specialization page.
This must be a REAL, CURRENT development — something that has happened in the
last 6 months that a ${page} professional or MBA student should know about.

DO NOT cover: [${exclusions}]

Return JSON:
{
  "topicKey": "unique-slug",
  "headline": "Punchy headline max 12 words",
  "whatHappened": "120 words: factual, clear explanation of the development",
  "rootCauses": [
    {"type": "Economic/Political/Tech/Social/Historical", "explanation": "50-word explanation"}
  ],
  "stakeholders": [
    {"name": "Stakeholder", "gains": "What they gain", "loses": "What they lose"}
  ],
  "businessImplications": "200 words: which industries affected, what companies should do, risks and opportunities",
  "futureScenarios": [
    {"label": "Best Case", "description": "80 words"},
    {"label": "Worst Case", "description": "80 words"},
    {"label": "Most Likely", "description": "80 words"}
  ],
  "keyNumbers": [
    {"label": "Metric", "value": "Number with unit", "source": "Source", "asOf": "Month Year"}
  ],
  "gdAngle": "Two smart lines a student could use to open or close a GD on this topic",
  "interviewAngle": "One insight that would impress an interviewer if mentioned"
}
`) as any;

  const mappedCitations = (data.keyNumbers || []).map((kn: any, idx: number) => ({
    id: idx + 1,
    source: kn.source || 'Report',
    date: kn.asOf || ''
  }));

  const mappedScenarios = (data.futureScenarios || []).map((s: any) => {
    let label: 'Best' | 'Worst' | 'Likely' = 'Likely';
    if (s.label?.toLowerCase().includes('best')) label = 'Best';
    else if (s.label?.toLowerCase().includes('worst')) label = 'Worst';
    return { label, description: s.description || '' };
  });

  const mappedRootCause = (data.rootCauses || []).map((rc: any) => `[${rc.type || ''}] ${rc.explanation || ''}`).join('\n\n');

  const mapped = {
    date,
    headline: data.headline || '',
    whatHappened: data.whatHappened || '',
    rootCause: mappedRootCause,
    stakeholders: data.stakeholders || [],
    businessImplications: data.businessImplications || '',
    scenarios: mappedScenarios,
    citations: mappedCitations,
    gdAngle: data.gdAngle || '',
    interviewAngle: data.interviewAngle || '',
  };

  await writeContent(page, 'hotTopic', date, data.topicKey, mapped);
}

// ─── COMPANY SPOTLIGHT ────────────────────────────────────────────
async function generateCompanySpotlight(page: string, date: string) {
  const used = await getUsedTopicKeys(page, 'companySpotlight');
  const exclusions = Array.from(used).join(', ') || 'none yet';

  const lensDescriptions: Record<string, string> = {
    marketing: 'brand positioning, advertising strategy, consumer insight, key campaigns, GTM approach',
    finance: 'capital structure, key financial ratios, margin profile, notable M&A or financing event',
    consulting: 'strategic dilemma the company currently faces, framed as a mini-case prompt',
    operations: 'supply chain design, manufacturing/delivery process that differentiates them',
    strategy: 'competitive moat, platform/ecosystem strategy, biggest strategic threat',
    people: 'culture practice, leadership model, notable people/talent strategy',
  };

  const data = await callGemini(`
Generate one Company Spotlight for the ${page.toUpperCase()} specialization page.
Mix Indian and global companies. Mix large incumbents with strong challengers.

DO NOT feature: [${exclusions}]

Return JSON:
{
  "topicKey": "company-name-slug",
  "companyName": "Full company name",
  "founded": 1990,
  "headquarters": "City, Country",
  "tagline": "Plain-English one-liner: what they actually do, not their marketing tagline",
  "metrics": [
    {"label": "Market Cap / Valuation", "value": "₹X Cr or $X Bn", "asOf": "Month Year", "source": "Source"},
    {"label": "Revenue", "value": "₹X Cr FY2025", "asOf": "FY2025", "source": "Annual report"},
    {"label": "Key market share metric", "value": "X%", "asOf": "Year", "source": "Source"},
    {"label": "One more relevant financial or operational metric", "value": "Value", "asOf": "Date", "source": "Source"}
  ],
  "competitors": [
    {"name": "Competitor 1", "positioningNote": "How they differ from this company"},
    {"name": "Competitor 2", "positioningNote": "How they differ"},
    {"name": "Competitor 3", "positioningNote": "How they differ"}
  ],
  "industryContext": "100-word overview of the industry: size, growth rate, key trends. All figures dated and sourced.",
  "functionLens": "200-word deep dive on the ${page} angle: ${lensDescriptions[page]}. Be specific, not generic.",
  "whyItMatters": "60 words: exactly what angle this company gives a student for GD/interview use. Be tactical."
}
`) as any;

  const mappedCitations = (data.metrics || []).map((m: any, idx: number) => ({
    id: idx + 1,
    source: m.source || 'Report',
    date: m.asOf || ''
  }));

  const mappedMetrics = (data.metrics || []).map((m: any, idx: number) => ({
    label: m.label || '',
    value: m.value || '',
    asOf: m.asOf || '',
    citationId: idx + 1
  }));

  const mapped = {
    companyName: data.companyName || '',
    identity: data.tagline || '',
    founded: data.founded || 0,
    headquarters: data.headquarters || '',
    metrics: mappedMetrics,
    citations: mappedCitations,
    competitors: data.competitors || [],
    industryContext: data.industryContext || '',
    functionLens: data.functionLens || '',
    whyItMatters: data.whyItMatters || '',
  };

  await writeContent(page, 'companySpotlight', date, data.topicKey, mapped);
}

// ─── THINK QUESTION ───────────────────────────────────────────────
async function generateThink(page: string, date: string) {
  const used = await getUsedTopicKeys(page, 'think');
  const exclusions = Array.from(used).join(', ') || 'none yet';

  const data = await callGemini(`
Generate one deep thinking question for the ${page.toUpperCase()} specialization.
This must challenge assumptions, require layered thinking, and have no obvious
single answer. It should blend ${page} with psychology, economics, or society.

DO NOT use questions similar to: [${exclusions}]

Return JSON:
{
  "topicKey": "question-slug",
  "question": "The full question (one sharp, challenging question that makes you think)",
  "whyItMatters": "100 words: business relevance, why interviewers ask this type of question",
  "perspectives": [
    {
      "label": "Perspective name",
      "argument": "The core case for this view (100 words)",
      "counterArgument": "The strongest objection to this view (60 words)",
      "realWorldExample": "One real company or event that illustrates this perspective"
    }
  ],
  "mbaInsight": "150 words: what separates a shallow answer from a deep one. What does top 10% thinking look like here?",
  "communicationTip": "How to structure this answer in a GD or PI in 60 seconds",
  "smartLine": "One memorable, quotable line a student could use in a GD/interview on this topic"
}
`) as any;

  const modelAnswer = {
    hook: `Why it matters: ${data.whyItMatters || ''}`,
    plain: (data.perspectives || []).map((p: any) => `[${p.label || ''}] ${p.argument || ''} (e.g. ${p.realWorldExample || ''})`).join('\n\n'),
    depth: `${data.mbaInsight || ''}\n\nCommunication Tip:\n${data.communicationTip || ''}\n\nSmart Line:\n"${data.smartLine || ''}"`
  };

  const alternatePerspective = (data.perspectives || []).map((p: any) => `Counter-view for ${p.label || ''}: ${p.counterArgument || ''}`).join('\n\n');

  const mapped = {
    date,
    question: data.question || '',
    modelAnswer,
    alternatePerspective,
    citations: [],
    whyItMatters: data.whyItMatters || '',
    perspectives: data.perspectives || [],
    mbaInsight: data.mbaInsight || '',
    communicationTip: data.communicationTip || '',
    smartLine: data.smartLine || '',
  };

  await writeContent(page, 'think', date, data.topicKey, mapped);
}

// ═══════════════════════════════════════════════════════════════════
// SECTION B: GUESSTIMATE (3 problems per day)
// ═══════════════════════════════════════════════════════════════════

async function generateGuesstimates(date: string) {
  const used = await getUsedTopicKeys('guesstimate', 'problem');
  const exclusions = Array.from(used).join(', ') || 'none yet';

  const data = await callGemini(`
Generate exactly 3 MBA guesstimate problems for today. They must cover
DIFFERENT sectors and DIFFERENT difficulty levels (one easy, one medium,
one hard). Mix Indian and global contexts. Mix question types: market sizing,
revenue estimation, unit count, demand estimation.

DO NOT reuse these topics: [${exclusions}]

Return a JSON array of 3 objects, each with:
{
  "topicKey": "unique-slug",
  "question": "The full guesstimate question",
  "sector": "Sector name (FMCG / Tech / Infrastructure / Healthcare / etc.)",
  "difficulty": "Easy / Medium / Hard",
  "questionType": "Market Sizing / Revenue / Unit Count / Demand",
  "topDown": {
    "steps": [
      "Step 1: [assumption and calculation with numbers shown]",
      "Step 2: [next calculation step with numbers]"
    ],
    "assumptions": [
      {"param": "Parameter name", "value": "Assumed value", "source": "Reasoning or source", "sensitivity": "How ±20% change affects result"}
    ],
    "finalEstimate": "₹X Cr / X units / etc.",
    "workingNote": "100 words explaining the logic of this approach"
  },
  "bottomUp": {
    "steps": [
      "Step 1: [different angle, different calculation]",
      "Step 2: [next step]"
    ],
    "assumptions": [
      {"param": "Parameter", "value": "Value", "source": "Reasoning", "sensitivity": "Impact"}
    ],
    "finalEstimate": "₹X Cr / X units / etc.",
    "workingNote": "100 words on this approach"
  },
  "crossCheck": "One sentence comparing both estimates and which to trust more and why",
  "sanityCheck": "One real-world reference point that validates or challenges your estimate",
  "commonTraps": [
    "Trap 1: what candidates typically get wrong on this type of question",
    "Trap 2",
    "Trap 3"
  ],
  "winningEdge": "One insight or framing that would impress an IIM interviewer",
  "interviewScript": "How to open this guesstimate verbally in an interview — exact phrasing for the first 30 seconds"
}
`) as any[];

  if (!Array.isArray(data) || data.length !== 3) {
    throw new Error('Guesstimate: expected array of 3, got: ' + JSON.stringify(data).substring(0, 200));
  }

  for (let i = 0; i < data.length; i++) {
    const problem = data[i];
    const topDownRows = (problem.topDown?.assumptions || []).map((a: any, idx: number) => ({
      parameter: a.param || '',
      value: a.value || '',
      source: { id: idx + 1, source: a.source || 'Assumption', date: '' },
      sensitivity: a.sensitivity || 'Medium'
    }));

    const bottomUpRows = (problem.bottomUp?.assumptions || []).map((a: any, idx: number) => ({
      parameter: a.param || '',
      value: a.value || '',
      source: { id: idx + 10, source: a.source || 'Assumption', date: '' },
      sensitivity: a.sensitivity || 'Medium'
    }));

    const mapped = {
      question: problem.question || '',
      specialization: problem.sector || '',
      difficulty: problem.difficulty || '',
      questionType: problem.questionType || '',
      approach1: {
        name: 'Top-Down Approach',
        rows: topDownRows,
        result: problem.topDown?.finalEstimate || '',
        note: problem.topDown?.workingNote || ''
      },
      approach2: {
        name: 'Bottom-Up Approach',
        rows: bottomUpRows,
        result: problem.bottomUp?.finalEstimate || '',
        note: problem.bottomUp?.workingNote || ''
      },
      crossCheck: problem.crossCheck || '',
      sanityCheck: problem.sanityCheck || '',
      commonTraps: problem.commonTraps || [],
      winningEdge: problem.winningEdge || '',
      interviewScript: problem.interviewScript || '',
      citations: [],
    };

    await writeContent('guesstimate', 'guesstimateProblem', date, problem.topicKey, mapped, `prob-${i}`);
  }
}

// ═══════════════════════════════════════════════════════════════════
// SECTION C: GD ARENA (2 topics per day, rotating tags)
// ═══════════════════════════════════════════════════════════════════

async function generateGDTopics(date: string) {
  const dayOfYear = Math.floor(
    (new Date(date).getTime() - new Date(new Date(date).getFullYear(), 0, 0).getTime()) /
    86400000
  );
  const tagRotation = ['Current', 'Business', 'Abstract', 'Tech', 'Ethics', 'Industry', 'Ethical Dilemma'];
  const todaysTags = [
    tagRotation[dayOfYear % tagRotation.length],
    tagRotation[(dayOfYear + 3) % tagRotation.length],
  ];

  for (const tag of todaysTags) {
    await generateGDTopic(tag, date);
  }
}

async function generateGDTopic(tag: string, date: string) {
  const used = await getUsedTopicKeys('gd-arena', 'gdTopic', tag.toLowerCase());
  const exclusions = Array.from(used).join(', ') || 'none yet';

  const tagContext: Record<string, string> = {
    Current: 'a current-affairs topic from the last 3 months relevant to business, economy, or policy',
    Business: 'a strategic or business-model question relevant to MBA students',
    Abstract: 'an abstract or philosophical topic that requires lateral thinking',
    Tech: 'a technology or AI-related topic with societal or business implications',
    Ethics: 'a policy-level ethical debate with genuine arguments on both sides',
    Industry: 'a sector-specific debate relevant to MBA placement industries (consulting, FMCG, finance, tech)',
    'Ethical Dilemma': 'a personal or organizational ethical dilemma — a situation where values conflict',
  };

  const data = await callGemini(`
Generate one GD topic for the ${tag.toUpperCase()} category.
This should be: ${tagContext[tag]}.

DO NOT use topics similar to: [${exclusions}]

Return JSON:
{
  "topicKey": "topic-slug",
  "topic": "The GD topic or proposition",
  "tag": "${tag}",
  "framing": "120 words of essential background context. Why is this topic relevant NOW? What triggered this debate? Include 2-3 key statistics with sources and dates.",
  "forArguments": [
    {
      "point": "Argument heading",
      "elaboration": "80-word elaboration of this argument",
      "data": "Specific statistic, figure, or example supporting this point",
      "source": "Source name",
      "asOf": "Month Year"
    }
  ],
  "againstArguments": [
    {
      "point": "Counter-argument heading",
      "elaboration": "80-word elaboration",
      "data": "Specific counter-data or counter-example",
      "source": "Source name",
      "asOf": "Month Year"
    }
  ],
  "wayForward": "150 words: a structured, practical synthesis that a strong GD closer would offer. Not 'balance both sides' waffle — a real position with a realistic path.",
  "openingLines": [
    "Strong opening line option 1 to initiate the GD",
    "Strong opening line option 2 (different angle)"
  ],
  "closingLine": "One strong line to close or summarize the GD with",
  "keyData": [
    {"label": "Important figure", "value": "Number", "source": "Source", "asOf": "Date"},
    {"label": "Another key stat", "value": "Number", "source": "Source", "asOf": "Date"}
  ],
  "commonMistakes": "60 words on what candidates typically get wrong in GDs on this type of topic",
  "standOutTip": "One insight or framing that would make a candidate memorable in this GD"
}
`) as any;

  const mappedForPoints = (data.forArguments || []).map((fa: any, idx: number) => ({
    point: `${fa.point}: ${fa.elaboration} [Data: ${fa.data} (${fa.source}, ${fa.asOf})]`,
    citations: [{ id: idx + 1, source: fa.source || 'Report', date: fa.asOf || '' }]
  }));

  const mappedAgainstPoints = (data.againstArguments || []).map((aa: any, idx: number) => ({
    point: `${aa.point}: ${aa.elaboration} [Data: ${aa.data} (${aa.source}, ${aa.asOf})]`,
    citations: [{ id: idx + 20, source: aa.source || 'Report', date: aa.asOf || '' }]
  }));

  const mappedCitations = (data.keyData || []).map((kd: any, idx: number) => ({
    id: idx + 50,
    source: kd.source || 'Report',
    date: kd.asOf || ''
  }));

  const mapped = {
    topic: data.topic || '',
    tag: data.tag || tag,
    framing: data.framing || '',
    forPoints: mappedForPoints,
    againstPoints: mappedAgainstPoints,
    closingStructure: data.wayForward || '',
    wayForward: data.wayForward || '',
    openingLines: data.openingLines || [],
    closingLine: data.closingLine || '',
    keyData: data.keyData || [],
    commonMistakes: data.commonMistakes || '',
    standOutTip: data.standOutTip || '',
    citations: mappedCitations,
  };

  await writeContent('gd-arena', 'gdTopic', date, data.topicKey, mapped, tag.toLowerCase());
}

// ─── DIGEST ───────────────────────────────────────────────────────
async function generateDigestStories(date: string) {
  const tags = ['Markets', 'Policy', 'Corporate', 'Trade', 'Tech'];
  const used = await getUsedTopicKeys('pulse', 'pulseStory');
  const exclusions = Array.from(used).join(', ') || 'none yet';

  const data = await callGemini(`
Generate exactly 5 Digest stories for today, one for each of these categories:
Markets, Policy, Corporate, Trade, Tech.

These must be REAL, CURRENT business/economic developments from the last 2 weeks.
Each story must be MBA-relevant — not general news.

DO NOT repeat these topics: [${exclusions}]

Return a JSON array of 5 objects, each:
{
  "topicKey": "story-slug",
  "filterTag": "Markets / Policy / Corporate / Trade / Tech",
  "headline": "Max 12 words, punchy, specific",
  "whatHappened": "80-word factual summary",
  "keyNumbers": [
    {"label": "Key metric", "value": "Value with unit", "source": "Source", "asOf": "Date"}
  ],
  "whyItMatters": "80 words: business/economic significance for an MBA student",
  "sectorImpact": "40 words: which specific sectors or companies are affected and how",
  "forwardLook": "One sentence on what to watch next",
  "mbaTakeaway": "One insight or angle a student could use in a GD or interview"
}
`) as any[];

  if (!Array.isArray(data)) {
    throw new Error('Digest: expected array');
  }

  for (const story of data) {
    const mapped = {
      id: story.topicKey || '',
      filter: story.filterTag || '',
      whatHappened: story.whatHappened || '',
      numbers: (story.keyNumbers || []).map((n: any, idx: number) => ({
        stat: `${n.label || ''}: ${n.value || ''}`,
        citation: { id: idx + 1, source: n.source || 'Report', date: n.asOf || '' }
      })),
      whyItMatters: story.whyItMatters || '',
      sectorImpact: story.sectorImpact || '',
      forwardLookingLine: story.forwardLook || '',
      headline: story.headline || '',
      mbaTakeaway: story.mbaTakeaway || '',
    };

    await writeContent('pulse', 'pulseStory', date, story.topicKey, mapped, story.filterTag?.toLowerCase());
  }
}

// ─── INSIGHTS ─────────────────────────────────────────────────────
async function generateInsights(date: string) {
  const used = await getUsedTopicKeys('bites', 'bite');
  const exclusions = Array.from(used).join(', ') || 'none yet';

  const data = await callGemini(`
Generate one Insights entry. These rotate through categories:
cognitive bias / economic effect / business law or principle / mental model.

DO NOT repeat: [${exclusions}]

Return JSON:
{
  "topicKey": "concept-slug",
  "title": "Concept name",
  "category": "Cognitive Bias / Economic Effect / Business Principle / Mental Model",
  "hook": "One bold, memorable sentence that makes someone want to keep reading",
  "plain": "3-4 sentences explaining this concept through a relatable analogy. No jargon.",
  "depth": "500-word deep dive: named concept with origin/source, 2-3 real-world examples (one India-specific if possible), how it appears in business and organizational behavior, when it misleads or backfires, and how an MBA student can reference it in a GD, case, or interview",
  "recallQuestion": "One question to test if the reader actually understood this concept"
}
`) as any;

  const mapped = {
    date,
    type: data.category || 'Cognitive Bias',
    name: data.title || '',
    altitude: {
      hook: data.hook || '',
      plain: data.plain || '',
      depth: `${data.depth || ''}\n\nRecall Question:\n${data.recallQuestion || ''}`
    },
    citations: []
  };

  await writeContent('bites', 'bite', date, data.topicKey, mapped);
}

// ─── EXPLORE ──────────────────────────────────────────────────────
async function generateExplore(date: string) {
  await generateExplorePlaceType('india', date);
  await generateExplorePlaceType('world', date);
}

async function generateExplorePlaceType(region: 'india' | 'world', date: string) {
  const used = await getUsedTopicKeys('explore', 'place', region);
  const exclusions = Array.from(used).join(', ') || 'none yet';

  const data = await callGemini(`
Generate one ${region === 'india' ? 'Indian city/district/region' : 'international city'} Explore entry.

DO NOT feature: [${exclusions}]

Return JSON:
{
  "topicKey": "place-slug",
  "placeName": "Full place name",
  "region": "${region}",
  "country": "${region === 'india' ? 'India' : 'Country name'}",
  "state": "${region === 'india' ? 'State name' : null}",
  "overview": {
    "hook": "One captivating sentence about what makes this place remarkable",
    "plain": "3-4 sentences: what it is, why it matters, what makes it unique",
    "depth": "200 words of rich context: history, identity, why this place exists where it does"
  },
  "bestThings": ["Thing 1", "Thing 2", "Thing 3", "Thing 4", "Thing 5"],
  "food": "150 words: signature dishes, street food culture, what to eat and where. Be specific with dish names.",
  "cultureHistory": "150 words: key historical events, dynasties, colonial impact, local traditions, festivals",
  "businessEconomy": "150 words: main industries, major employers, economic trajectory, any notable startup/business story",
  "stories": "100 words: 2-3 surprising, fascinating, or counterintuitive facts about this place",
  "gdAngle": "One sentence connecting this place to a possible GD or interview topic (economic development, regional policy, etc.)"
}
`) as any;

  await writeContent('explore', 'place', date, data.topicKey, data, region);
}

// ─── NEWSPAPER TODAY'S BRIEF ──────────────────────────────────────
async function generateNewspaperBrief(date: string) {
  const used = await getUsedTopicKeys('newspaper', 'brief');
  const exclusions = Array.from(used).join(', ') || 'none yet';

  const data = await callGemini(`
Generate today's Newspaper Brief: 5 curated MBA-relevant news items for ${date}.
These should be the 5 most important business/economic developments an MBA student
should know about today. Mix Indian and global.

DO NOT repeat these topics: [${exclusions}]

Return JSON array of 5 objects:
{
  "topicKey": "story-slug",
  "headline": "Max 12 words",
  "category": "Business / Finance / Policy / Economy / Corporate",
  "whatHappened": "80 words",
  "keyNumbers": [{"label": "Metric", "value": "Value", "source": "Source", "asOf": "Date"}],
  "whyItMattersForMBA": "60 words: specific relevance to placements, interviews, or GDs",
  "forwardLook": "One sentence"
}
`) as any[];

  if (!Array.isArray(data)) throw new Error('NewspaperBrief: expected array');

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    await writeContent('newspaper', 'brief', date, item.topicKey, item, `brief-${i}`);
  }
}

// ─── ENGLISH CONTENT ──────────────────────────────────────────────
async function generateEnglishContent(date: string) {
  await Promise.all([
    generateVocabulary(date),
    generateGrammar(date),
    generateReading(date),
    generateWAT(date),
  ]);
}

async function generateVocabulary(date: string) {
  const used = await getUsedTopicKeys('english', 'vocabulary');
  const exclusions = Array.from(used).join(', ') || 'none yet';

  const data = await callGemini(`
Generate 4 vocabulary words for MBA/interview preparation.
Focus on words useful in business communication, GDs, and essays.
DO NOT use: [${exclusions}]

Return JSON array of 4:
{
  "topicKey": "word-slug",
  "word": "The word",
  "partOfSpeech": "noun/verb/adjective/etc.",
  "roots": "Etymology: Latin/Greek/etc. root breakdown",
  "definition": "Clear plain-English definition",
  "pronunciationGuide": "Phonetic guide e.g. per-FUNK-tuh-ree",
  "mbaUsage": "Sentence using this word in a business/professional context",
  "commonMisuse": "One error to avoid — a common incorrect usage or confusion with another word",
  "recallQuestion": "One question testing understanding"
}
`) as any[];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const mapped = {
      word: item.word || '',
      roots: item.roots || '',
      definition: item.definition || '',
      exampleSentence: item.mbaUsage || '',
      misuseNote: item.commonMisuse || '',
      usedIn: `Used as ${item.partOfSpeech || 'word'}`,
      recallQuestion: item.recallQuestion || ''
    };
    await writeContent('english', 'vocabulary', date, item.topicKey, mapped, `vocab-${i}`);
  }
}

async function generateGrammar(date: string) {
  const used = await getUsedTopicKeys('english', 'grammar');
  const sequencePosition = used.size % 50;

  const data = await callGemini(`
Generate one grammar rule entry.
This is position ${sequencePosition} in a progressive curriculum covering:
tenses, conditionals, articles, prepositions, voice, narration,
subject-verb agreement, modifiers, punctuation, conjunctions.

DO NOT repeat topics already covered.

Return JSON:
{
  "topicKey": "grammar-rule-slug",
  "ruleTitle": "Short title e.g. Present Perfect vs Simple Past",
  "rule": "Clear plain-English explanation of the rule (no jargon)",
  "examples": [
    {"sentence": "Example sentence", "note": "Why this is correct"},
    {"sentence": "Another example", "note": "What rule it illustrates"}
  ],
  "errorDrill": [
    {"wrong": "Incorrect sentence", "correct": "Corrected version", "explanation": "Why it was wrong"},
    {"wrong": "Another error", "correct": "Corrected", "explanation": "Why"}
  ],
  "advancedPattern": "One advanced sentence structure using this rule, with explanation",
  "businessUsage": "How this rule matters specifically in professional emails or presentations"
}
`) as any;

  const mapped = {
    rule: `${data.ruleTitle || ''}: ${data.rule || ''}`,
    examples: (data.examples || []).map((e: any) => `${e.sentence || ''} (${e.note || ''})`),
    commonError: (data.errorDrill || []).map((d: any) => `Incorrect: ${d.wrong || ''}\nCorrect: ${d.correct || ''}\nWhy: ${d.explanation || ''}`).join('\n\n'),
    drill: data.errorDrill && data.errorDrill[0] ? {
      sentence: data.errorDrill[0].wrong || '',
      explanation: data.errorDrill[0].explanation || ''
    } : undefined
  };

  await writeContent('english', 'grammar', date, data.topicKey, mapped, 'grammar-0');
}

async function generateReading(date: string) {
  const used = await getUsedTopicKeys('english', 'reading');
  const exclusions = Array.from(used).join(', ') || 'none yet';
  const genres = ['business', 'philosophy', 'history', 'science', 'current-affairs'];
  const dayNum = new Date(date).getDay();
  const genre = genres[dayNum % genres.length];

  const data = await callGemini(`
Generate one reading comprehension passage for MBA English preparation.
Today's genre: ${genre}.
DO NOT use these topics: [${exclusions}]

Return JSON:
{
  "topicKey": "passage-slug",
  "genre": "${genre}",
  "passage": "One passage of 280-350 words. Must be substantive and intellectually rich, not generic filler.",
  "questions": [
    {
      "question": "Inference or tone or structure question",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Why this is correct and why others are wrong"
    },
    {
      "question": "Second question",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "B",
      "explanation": "Explanation"
    },
    {
      "question": "Third question",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "C",
      "explanation": "Explanation"
    }
  ]
}
`) as any;

  const mapped = {
    title: `Reading Passage (${data.genre || 'General'})`,
    passage: data.passage || '',
    questions: (data.questions || []).map((q: any) => ({
      question: `${q.question || ''}\nOptions:\n${(q.options || []).map((o: any, idx: number) => `${String.fromCharCode(65 + idx)}) ${o}`).join('\n')}`,
      answer: `Correct Answer: ${q.correctAnswer || ''}\n\nExplanation: ${q.explanation || ''}`
    }))
  };

  await writeContent('english', 'reading', date, data.topicKey, mapped);
}

async function generateWAT(date: string) {
  const used = await getUsedTopicKeys('english', 'wat');
  const exclusions = Array.from(used).join(', ') || 'none yet';

  const data = await callGemini(`
Generate one WAT (Written Ability Test) prompt for MBA practice.
DO NOT repeat: [${exclusions}]

Return JSON:
{
  "topicKey": "wat-topic-slug",
  "prompt": "The WAT topic or statement",
  "type": "Opinion / Current Affairs / Abstract / Business",
  "wordLimit": 250,
  "timeLimit": 20,
  "speltGuide": {
    "social": "Key social angle for this topic",
    "political": "Key political angle",
    "economic": "Key economic angle",
    "legal": "Key legal angle if relevant, or null",
    "technological": "Key tech angle if relevant, or null"
  },
  "modelEssay": "A strong 240-word model essay on this topic. Well-structured: clear thesis, 3 body points, conclusion. Sophisticated but not verbose.",
  "commonMistakes": ["Mistake 1 in WAT responses", "Mistake 2", "Mistake 3"],
  "keyPhrasesToUse": ["Phrase 1", "Phrase 2", "Phrase 3"]
}
`) as any;

  const mapped = {
    prompt: data.prompt || '',
    speltReminder: {
      S: data.speltGuide?.social || 'Social factors',
      P: data.speltGuide?.political || 'Political factors',
      E: data.speltGuide?.economic || 'Economic factors',
      L: data.speltGuide?.legal || 'Legal factors',
      T: data.speltGuide?.technological || 'Technological factors'
    },
    modelEssay: data.modelEssay || '',
    commonMistakes: data.commonMistakes || [],
    keyPhrases: data.keyPhrasesToUse || []
  };

  await writeContent('english', 'wat', date, data.topicKey, mapped);
}
