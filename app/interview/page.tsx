'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useMbaStore } from '@/lib/stores/mbaStore'
import { toISODate, getDayIndex } from '@/lib/getDayIndex'
import { 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  PenTool, 
  Timer, 
  Briefcase, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Layers,
  FileText,
  HelpCircle
} from 'lucide-react'

// Tab definitions
type InterviewTab = 'pi' | 'wat' | 'sip' | 'resume'

// ─── 1. PI Bank Data ────────────────────────────────────────────────────────
interface PIQuestion {
  question: string
  intent: string
  blueprint: string
  pointers: string[]
  pitfalls: string[]
  weakAnswer: string
  strongAnswer: string
}

const PI_CATEGORIES = [
  {
    id: 'resume-walk',
    label: '1. Walk me through your resume',
    questions: [
      {
        question: 'Tell me about yourself / Walk me through your resume.',
        intent: 'Assess communication clarity, self-awareness, and professional narrative flow. Looking to see how logically you connect past decisions to present situation and future goals.',
        blueprint: 'Present-Past-Future: (1) Present: Current role, industry, and a high-impact achievement (30s). (2) Past: Critical pivots—how you got here and skills acquired (40s). (3) Future: Immediate goals, why MBA is the bridge, and why this school is the perfect catalyst (30s).',
        pointers: [
          'Use the Present-Past-Future structure: current role/achievement, past pivots, and future MBA motivation.',
          'Quantify achievements: X% revenue growth, Y size of team, Z crore budget managed.',
          'Keep it strictly to 90-120 seconds. Focus on the highlights; do not recite dates and facts.'
        ],
        pitfalls: [
          'Reciting your resume line-by-line. The panel already has your physical CV.',
          'Monologuing for over 3 minutes, which kills panel engagement and shows poor communication control.'
        ],
        weakAnswer: 'I graduated from college in 2018 with a degree in engineering. Then I joined Infosys as a software developer, where I worked on Java databases. In 2021, I switched to Deloitte, where I did IT consulting. Now I want to do an MBA to get into management and get a higher salary, and I think your school is very good.',
        strongAnswer: 'Currently, I am a Senior Consultant at Deloitte, specializing in digital transformation for retail banks. Most recently, I led a team of 4 to migrate a legacy core banking system, which reduced client transaction times by 40% and saved Rs. 12 crore annually. Prior to this, I built my analytical foundation as a software engineer at Infosys. While I have developed strong technical execution skills, I have reached a pivot point where I need to master strategic finance and organizational design to lead end-to-end business units. This makes an MBA at your school the critical next step, particularly due to your case-method pedagogy and strong retail banking industry partnerships.'
      }
    ]
  },
  {
    id: 'why-mba',
    label: '2. Why MBA / Why this college',
    questions: [
      {
        question: 'Why do you want an MBA at this point in your career?',
        intent: 'Verify you are not using an MBA as a default escape route from a job you dislike. Looking for a clear capability-gap analysis.',
        blueprint: 'The Bridge Structure: (1) Current State: Skills and experiences built. (2) Future Goal: Short-term and long-term career goals. (3) The Gap: Specific capability, network, or credibility gaps today. (4) The Catalyst: Why this specific business school fills those gaps.',
        pointers: [
          'Be specific about the skills gap: "I have strong operational exposure but lack formal strategy frameworks and financial modeling experience."',
          'Research the school deeply: cite specific faculty, elective courses, clubs, or alumni from your target industry.'
        ],
        pitfalls: [
          'Giving generic answers like "for a better network" or "to accelerate my career" without offering concrete details.',
          'Making it sound purely credential-driven or salary-driven rather than capability-driven.'
        ],
        weakAnswer: 'I want to do an MBA because I want to transition into strategy consulting. My current engineering job has very slow growth, and an MBA will help me get a higher salary and a better brand name. Your school has great placements in consulting, so it is my top choice.',
        strongAnswer: 'Over the last 4 years in supply chain operations, I have mastered the technical side of inventory optimization. However, during a recent cross-functional warehouse integration project, I realized that my ability to drive strategic corporate decisions is limited by my gaps in financial modeling and macro-strategy. My goal is to transition into a Strategy Consultant role focusing on operational turnarounds. To do this, I need to formalize my understanding of corporate finance and corporate strategy. Your program is the ideal bridge because of its elective in Advanced Corporate Restructuring and the Operations Club, which partners with local firms on real-world projects. Doing this now allows me to leverage my operational base while building the business acumen needed to advise executives.'
      }
    ]
  },
  {
    id: 'why-sector',
    label: '3. Why this Sector/Function',
    questions: [
      {
        question: 'Why are you targeting this specific MBA specialization (e.g. Consulting, Marketing, Finance)?',
        intent: 'Evaluate functional interest alignment, background compatibility, and research depth.',
        blueprint: 'Core Drivers: (1) Background connection: What skills from your past apply. (2) Role appeal: What tasks in this function match your strengths. (3) Career roadmap: How this role sets up your 5-year goals.',
        pointers: [
          'Cite specific elements of the target role (e.g., brand ownership in marketing, valuation models in IB).',
          'Avoid sounding like you chose the sector solely due to campus placement popularity.'
        ],
        pitfalls: [
          'Saying "Consulting is the best option because I can experience different industries" without explaining what you bring to it.',
          'Not knowing current industry shifts in your target sector.'
        ],
        weakAnswer: 'I want to do marketing because it is a very creative field and I like interacting with consumers. Brand managers have a lot of fun making campaigns and advertising, and I think I am good at communication.',
        strongAnswer: 'My interest in Brand Management stems from my desire to own the P&L of a business line early in my career. During my tech operations role at Amazon, I saw how minor product changes were driven by marketing positioning. I want to build skills in consumer insight development and channel marketing. My background in data analysis will help me bring quantitative rigor to media spend allocation and trade marketing optimization, making the FMCG brand manager track the perfect integration of my analytical base and marketing aspirations.'
      }
    ]
  },
  {
    id: 'achievement-failure',
    label: '4. Greatest Achievement / Failure / Learning',
    questions: [
      {
        question: 'Describe your most significant professional achievement.',
        intent: 'Assess individual agency, leadership capacity, and business impact definition.',
        blueprint: 'STAR Format: Situation, Task, Action (50%), Result (quantified business outcome).',
        pointers: [
          'Focus on your personal contribution, not team output — panels look for individual agency.',
          'Quantify the result (revenue, cost, efficiency, team growth) using absolute numbers and percentages.'
        ],
        pitfalls: [
          'Choosing a team achievement and failing to articulate your specific role or personal contribution.'
        ],
        weakAnswer: 'At my company, we had a major problem with client onboarding delays. I was put on a project team to fix it. We held brainstorm sessions and designed a new portal. This reduced onboarding times significantly and the client was happy.',
        strongAnswer: 'In Q3 FY25, our fintech platform faced a 35% customer drop-off during onboarding due to a complex 12-step verification process, threatening our quarterly active user target. I took the initiative to map the customer journey and identified that the API verification step was the primary bottleneck, taking 8 seconds per user. I negotiated with our engineering head to re-allocate 2 developers and designed a parallel-processing verification system. By coordinating across compliance, product, and tech, I personally drove the redesign down to 4 steps. As a result, onboarding drop-off decreased from 35% to 8%, securing 18,000 additional monthly active users and generating Rs. 45 lakh in incremental transaction revenue.'
      }
    ]
  },
  {
    id: 'leadership-teamwork',
    label: '5. Leadership and Teamwork stories',
    questions: [
      {
        question: 'Tell me about a time you managed a conflict within a team.',
        intent: 'Test emotional intelligence, professional maturity, and collaboration capabilities.',
        blueprint: 'Context-Conflict-Resolution-Outcome: (1) Context. (2) The root cause of the conflict. (3) Action: How you mediated (listening, aligning incentive). (4) Outcome: Quantified project completion and team health.',
        pointers: [
          'Never blame or criticize colleagues during the explanation; present issues neutrally.',
          'Show structured mediation: seeking individual alignments before bringing the team together.'
        ],
        pitfalls: [
          'Saying "we never had conflicts" — signals lack of honest self-awareness or team experience.'
        ],
        weakAnswer: 'My developer was refusing to finish code because he thought the design was bad. I went to the manager and got him replaced. The project finished on time.',
        strongAnswer: 'During an ERP migration, our tech lead and business analyst disagreed on custom database schemas, causing a 2-week delay. The tech lead prioritized standard code scaling, while the BA wanted custom fields for report formats. I set up individual discussions to understand their concerns. I realized the BA feared losing reporting capability, while the tech lead wanted to avoid manual overrides. I proposed standardizing 90% of the schemas and using a separate query view for the custom reports. Both agreed to this compromise. The team resumed work, delivering the migration on time with zero database errors.'
      }
    ]
  },
  {
    id: 'ethics-scenarios',
    label: '6. Ethics and Values Scenarios',
    questions: [
      {
        question: 'You discover that your manager is signing off on inflated expense reports. What do you do?',
        intent: 'Evaluate ethical integrity, professional diplomacy, and whistleblowing awareness.',
        blueprint: 'Verify & Escalate (V&E): (1) Verify: Confirm facts (avoid assumptions). (2) Private conversation: neutrally present data to seek clarification. (3) Escalate: If confirmed and unresolved, report through formal whistleblower channels.',
        pointers: [
          'State a clear position without being preachy: you will address it, but with structured escalation.',
          'Acknowledge whistleblowing frameworks and compliance helpline roles.'
        ],
        pitfalls: [
          'Saying "I would ignore it" (lacks ethical agency) or immediately launching public accusations (lacks maturity).'
        ],
        weakAnswer: 'I would immediately go to HR and report my manager. Stealing from the company is wrong, and I do not want to be associated with an unethical boss.',
        strongAnswer: 'First, I would verify the facts to ensure there is no misunderstanding or simple clerical error. If the discrepancy is clear, I would schedule a private conversation with my manager. I would present the data neutrally, asking for clarification on the expense line items. This gives them the opportunity to correct a mistake or explain the context. However, if it becomes clear that the expenses are intentionally inflated and the manager refuses to correct it, my ultimate duty is to the organization. I would escalate the matter through the company\'s confidential whistleblower hotline or consult with our compliance officer, ensuring that I adhere to the formal reporting protocol.'
      }
    ]
  },
  {
    id: 'current-affairs-pi',
    label: '7. Current Affairs and Opinion Questions',
    questions: [
      {
        question: 'What is your opinion on the regulatory push on fintech platforms in India?',
        intent: 'Evaluate business literacy and commercial judgment. Checking if you read beyond headlines.',
        blueprint: 'Macro-Micro-Impact (MMI): (1) The regulation background. (2) Structural reasons (systemic risk, KYC audits). (3) Short-term business friction vs. long-term credibility improvement.',
        pointers: [
          'Cite specific regulators (RBI, SEBI) and events (Paytm Payments Bank audit).',
          'Provide a balanced general manager synthesis: compliance costs rise but trust anchors the digital market.'
        ],
        pitfalls: [
          'Sounding purely emotional or critical without acknowledging the systemic necessity of compliance.'
        ],
        weakAnswer: 'I think it is bad because it stops innovation. Fintech start-ups are growing fast and the RBI should not make too many rules that make it hard to run business.',
        strongAnswer: 'The RBI\'s recent enforcement actions represent a structural pivot from "light-touch" regulation to strict compliance enforcement, particularly regarding KYC audit irregularities and systemic credit links. While this creates short-term operational friction and reduces GMV growth for payments platforms, it is necessary to prevent systemic credit contagion. In the long term, this regulatory clean-up will build investor confidence and secure the fintech ecosystem\'s stability, ensuring that fintech scale is backed by rigorous compliance frameworks rather than regulatory arbitrage.'
      }
    ]
  }
]

// ─── 2. WAT prompts ────────────────────────────────────────────────────────
const WAT_PROMPTS = [
  {
    prompt: "Is a carbon tax a regressive policy for developing economies like India?",
    category: "Business & Economics",
    essay: "Introduction: A carbon tax aims to internalize the social cost of carbon emissions, incentivizing green transitions. However, in developing nations, it risks being regressive due to high consumer incidence on essential energy.\n\nAnalysis via SPELT:\n- Social: Energy consumption constitutes a higher percentage of disposable income for lower-income households. Rising electricity and fuel costs directly impact their standard of living.\n- Political: Imposing carbon taxes on basic commodities attracts public backlash, making reform politically volatile.\n- Economic: Coal remains India's cheapest base-load power. Direct taxation without alternative scaling increases corporate operating costs, cascading into inflation.\n- Legal & Technological: Establishing monitoring frameworks is legally complex, and low-cost alternative green technologies are not yet locally scaled at mass.\n\nConclusion: A carbon tax must be structured with 'revenue recycling' (redistributing carbon tax proceeds as direct subsidies/cash transfers) to offset regressivity and fund green infra."
  },
  {
    prompt: "In the age of Generative AI, are humanities more critical than engineering?",
    category: "Abstract & Technology",
    essay: "Introduction: As Generative AI automates coding, technical execution, and basic math, the competitive advantage shifts from 'how to construct code' to 'what problems are worth solving'.\n\nAnalysis via SPELT:\n- Social & Technological: Tech capabilities are democratized. Creative thinking, critical reasoning, and ethics (humanities core) guide AI outputs through prompt design.\n- Economic: Pure execution engineering becomes a commodity. Strategic, human-centric design thinking drives market differentiation.\n- Ethical/Legal: AI models raise copyright, deepfake, and labor displacement dilemmas. Solving these requires legal, philosophical, and moral frameworks.\n\nConclusion: The future demands a hybrid approach; engineering constructs the engine, but humanities direct the steering wheel. Curriculums must bridge both."
  },
  {
    prompt: "Should India mandate ESG compliance for micro, small, and medium enterprises (MSMEs)?",
    category: "Policy & Industry",
    essay: "Introduction: MSMEs contribute ~30% of India's GDP and over 45% of exports. Mandating Environmental, Social, and Governance (ESG) compliance is structurally ideal but operationally burdensome.\n\nAnalysis via SPELT:\n- Economic & Operational: MSMEs operate on thin margins with low capital. Forcing costly compliance audits risks shutting down smaller units.\n- Legal/Regulatory: Formal reporting frameworks are complex. Enforcing them across unorganized sectors invites bureaucratic friction.\n- Social/Technological: Compliance improves safety, labor conditions, and access to global supply chains (multinational clients require ESG alignment).\n\nConclusion: Mandatory compliance should be phased, starting with incentives (e.g. low-interest compliance loans) and digital reporting tools before imposing statutory penalties."
  }
]

export default function InterviewPrepPage() {
  const { activeDate } = useMbaStore()
  
  const today = new Date()
  const currentDate = activeDate ? new Date(activeDate) : today
  const dateStr = toISODate(currentDate)

  // State Management
  const [activeTab, setActiveTab] = useState<InterviewTab>('pi')
  const [openPI, setOpenPI] = useState<string | null>(null)
  
  // WAT State
  const watIndex = getDayIndex(WAT_PROMPTS.length, currentDate)
  const currentWat = WAT_PROMPTS[watIndex]
  const [watText, setWatText] = useState('')
  const [watTimer, setWatTimer] = useState(900) // 15 minutes in seconds
  const [timerActive, setTimerActive] = useState(false)
  const [revealEssay, setRevealEssay] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Sync / Reset on Date change
  useEffect(() => {
    setWatText('')
    setRevealEssay(false)
    setWatTimer(900)
    setTimerActive(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [dateStr])

  // Timer handler
  const toggleTimer = () => {
    if (timerActive) {
      if (timerRef.current) clearInterval(timerRef.current)
      setTimerActive(false)
    } else {
      setTimerActive(true)
      timerRef.current = setInterval(() => {
        setWatTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            setTimerActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const remaining = secs % 60
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`
  }

  const calculateWords = (str: string) => {
    const trimmed = str.trim()
    return trimmed ? trimmed.split(/\s+/).length : 0
  }

  const wordCount = calculateWords(watText)

  return (
    <div className="interview-container font-body">
      <header className="interview-header mb-6">
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-2">
          REFERENCE / Skill Room
        </span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>
          Interview Prep
        </h1>
        <p className="text-body text-mba-ink-soft mt-2 prose-measure">
          Master the recruitment process: personal interview strategies, written ability drills, summer placement timelines, and resume frameworks.
        </p>
      </header>

      {/* Tabs segment control */}
      <div className="tab-segments mb-8">
        <button
          onClick={() => setActiveTab('pi')}
          className={`tab-btn font-mono text-mono-label ${activeTab === 'pi' ? 'active' : ''}`}
        >
          PI Bank
        </button>
        <button
          onClick={() => setActiveTab('wat')}
          className={`tab-btn font-mono text-mono-label ${activeTab === 'wat' ? 'active' : ''}`}
        >
          WAT / AWT
        </button>
        <button
          onClick={() => setActiveTab('sip')}
          className={`tab-btn font-mono text-mono-label ${activeTab === 'sip' ? 'active' : ''}`}
        >
          SIP Prep
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`tab-btn font-mono text-mono-label ${activeTab === 'resume' ? 'active' : ''}`}
        >
          Resume & CV
        </button>
      </div>

      {/* TAB 1: PI BANK */}
      {activeTab === 'pi' && (
        <section className="space-y-6">
          <div className="intro-card mb-4">
            <h3 className="font-display text-h3 text-mba-ink mb-1">Personal Interview Core Questions</h3>
            <p className="text-caption text-mba-ink-soft">
              Expand each category to review common questions, evaluator intents, structured answering blueprints, and sample strong vs. weak answer contrasts.
            </p>
          </div>

          <div className="categories-list space-y-4">
            {PI_CATEGORIES.map((cat) => {
              const isOpen = openPI === cat.id
              return (
                <div key={cat.id} className="category-block">
                  <button
                    onClick={() => setOpenPI(isOpen ? null : cat.id)}
                    className="category-toggle font-display font-medium text-body"
                  >
                    <span>{cat.label}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isOpen && (
                    <div className="category-content mt-4 space-y-6 pt-4 border-t border-mba-rule">
                      {cat.questions.map((q, idx) => (
                        <div key={idx} className="question-item space-y-4">
                          <h4 className="font-display font-bold text-body text-mba-ink">Q: {q.question}</h4>
                          
                          <div className="grid-details">
                            <div className="detail-box">
                              <span className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-1">Evaluator Intent</span>
                              <p className="text-caption text-mba-ink-soft m-0">{q.intent}</p>
                            </div>
                            <div className="detail-box">
                              <span className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-1">Answer Blueprint</span>
                              <p className="text-caption text-mba-ink-soft m-0">{q.blueprint}</p>
                            </div>
                          </div>

                          <div className="tips-list">
                            <span className="font-mono text-[10px] text-mba-success uppercase tracking-wider block mb-2">Pointers to Include</span>
                            <ul className="text-caption text-mba-ink-soft list-disc pl-4 space-y-1">
                              {q.pointers.map((p, pIdx) => <li key={pIdx}>{p}</li>)}
                            </ul>
                          </div>

                          <div className="pitfalls-list">
                            <span className="font-mono text-[10px] text-mba-danger uppercase tracking-wider block mb-2">Common Pitfalls</span>
                            <ul className="text-caption text-mba-ink-soft list-disc pl-4 space-y-1">
                              {q.pitfalls.map((p, pIdx) => <li key={pIdx}>{p}</li>)}
                            </ul>
                          </div>

                          {/* Contrasts */}
                          <div className="contrasts-block space-y-3 pt-3 border-t border-mba-rule">
                            <div className="contrast-card weak">
                              <span className="font-mono text-[9px] text-mba-danger uppercase tracking-wider block mb-1">Weak Answer (Generic)</span>
                              <p className="text-caption text-mba-ink-soft m-0 italic">"{q.weakAnswer}"</p>
                            </div>
                            <div className="contrast-card strong">
                              <span className="font-mono text-[9px] text-mba-success uppercase tracking-wider block mb-1">Strong Answer (Structured & Quantified)</span>
                              <p className="text-caption text-mba-ink-soft m-0 italic">"{q.strongAnswer}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* TAB 2: WAT / AWT PRACTICE */}
      {activeTab === 'wat' && (
        <section className="space-y-6">
          <div className="wat-prompt-card">
            <div className="flex justify-between items-start mb-2">
              <span className="font-mono text-[10px] text-mba-accent uppercase tracking-wider">Daily Essay Topic ({currentWat.category})</span>
              <div className="timer-badge font-mono" onClick={toggleTimer}>
                <Timer size={14} className={timerActive ? 'animate-pulse text-mba-accent' : ''} />
                <span>{formatTime(watTimer)}</span>
              </div>
            </div>
            <h3 className="font-display text-h3 text-mba-ink font-medium leading-snug">
              "{currentWat.prompt}"
            </h3>
            <p className="text-caption text-mba-ink-soft mt-2">
              Practicing helps clarify logic. Write a response between 250 - 300 words. Set the timer and write continuously.
            </p>
          </div>

          <div className="wat-workbench">
            <textarea
              value={watText}
              onChange={(e) => setWatText(e.target.value)}
              placeholder="Begin typing your essay response here..."
              className="wat-textarea text-body mb-2"
              rows={12}
            />

            <div className="flex justify-between items-center font-mono text-mono-label text-mba-ink-faint">
              <span>{wordCount} / 300 words</span>
              <span>Time limit: 15 mins</span>
            </div>
          </div>

          {/* SPELT Framework Drawer */}
          <div className="spelt-card">
            <h4 className="font-display font-medium text-body text-mba-ink mb-2">SPELT Analysis Reference</h4>
            <p className="text-caption text-mba-ink-soft mb-3">Use this framework to organize essays with multi-dimensional viewpoints:</p>
            <div className="spelt-grid">
              <div className="spelt-item"><strong>S</strong>ocial</div>
              <div className="spelt-item"><strong>P</strong>olitical</div>
              <div className="spelt-item"><strong>E</strong>conomic</div>
              <div className="spelt-item"><strong>L</strong>egal</div>
              <div className="spelt-item"><strong>T</strong>echnological</div>
            </div>
          </div>

          {/* Essay Reveal Block */}
          <div className="essay-reveal-block">
            {revealEssay ? (
              <div className="essay-content-card">
                <h4 className="font-display font-bold text-body text-mba-ink mb-2">Model Essay Structure & Reference</h4>
                <p className="text-caption text-mba-ink-soft whitespace-pre-wrap leading-relaxed">
                  {currentWat.essay}
                </p>
                <button
                  onClick={() => setRevealEssay(false)}
                  className="hide-essay-btn font-mono text-mono-label mt-4"
                >
                  Hide Model Essay
                </button>
              </div>
            ) : (
              <button
                disabled={wordCount === 0}
                onClick={() => setRevealEssay(true)}
                className="reveal-essay-btn font-mono text-mono-label"
              >
                Reveal Model Essay
              </button>
            )}
          </div>
        </section>
      )}

      {/* TAB 3: SIP PREP */}
      {activeTab === 'sip' && (
        <section className="space-y-6">
          <div className="timeline-card">
            <h3 className="font-display text-h3 text-mba-ink font-bold mb-2">SIP Timeline Calendar</h3>
            <p className="text-caption text-mba-ink-soft mb-4">
              Summer Internship Placement (SIP) processes run rapidly at top campuses:
            </p>
            <div className="sip-timeline space-y-3 font-mono text-[11px]">
              <div className="timeline-item">
                <span className="time-marker">August</span>
                <span className="time-details">Resume creation, review cycles, and target sector locking.</span>
              </div>
              <div className="timeline-item">
                <span className="time-marker">September</span>
                <span className="time-details">Company presentations, shortlist releases, and intensive mock cases.</span>
              </div>
              <div className="timeline-item">
                <span className="time-marker">October</span>
                <span className="time-details">"Day 0" slot interviews, rolling offers, and summer placement completion.</span>
              </div>
            </div>
          </div>

          {/* SIP vs Finals Table */}
          <div className="comparison-table-card">
            <h3 className="font-display text-h3 text-mba-ink font-bold mb-2">SIP vs. Finals Case Formats</h3>
            <table className="comparison-table text-caption">
              <thead>
                <tr>
                  <th>Dimension</th>
                  <th>SIP Interviews (Year 1)</th>
                  <th>Final Placements (Year 2)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Interview Length</strong></td>
                  <td>15 - 25 minutes (Fast & punchy)</td>
                  <td>35 - 50 minutes (Deep dive)</td>
                </tr>
                <tr>
                  <td><strong>Case Scope</strong></td>
                  <td>Guesstimates and direct frameworks</td>
                  <td>Full-scale operational turnarounds</td>
                </tr>
                <tr>
                  <td><strong>Technical Depth</strong></td>
                  <td>High test on core logic & math</td>
                  <td>Detailed sector & regulatory dynamics</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PPO details */}
          <div className="ppo-card">
            <div className="block-header flex items-center gap-2 mb-2 text-mba-accent">
              <CheckCircle size={16} />
              <h4 className="font-display font-bold text-body text-mba-ink m-0">Pre-Placement Offer (PPO) Conversion</h4>
            </div>
            <p className="text-caption text-mba-ink-soft leading-relaxed m-0">
              Converting your summer internship is the most effective way to secure a job. Recruiters look for **Agency** (delivering project outputs beyond the brief), **Structured approach** (solving problems logically), and **Cultural fit** within the corporate division.
            </p>
          </div>
        </section>
      )}

      {/* TAB 4: RESUME & CV */}
      {activeTab === 'resume' && (
        <section className="space-y-6">
          <div className="resume-structure-card">
            <h3 className="font-display text-h3 text-mba-ink font-bold mb-2">IIM Standard Resume Principles</h3>
            <p className="text-caption text-mba-ink-soft mb-4">
              Your resume is a factual achievements pitch. Every bullet point must follow the structured outcome formula:
            </p>
            <div className="formula-box text-center py-4 mb-4 font-mono text-[12px]">
              <div className="text-mba-accent font-bold">Action Verb + Context + Quantified Metric</div>
            </div>

            <div className="contrasts-list space-y-4">
              <h4 className="font-display font-medium text-body text-mba-ink">Strong vs. Weak Bullet Points</h4>
              
              <div className="bullet-contrast">
                <div className="weak-bullet text-caption italic">
                  - Managed client server setups and resolved tech issues.
                </div>
                <div className="strong-bullet text-caption text-mba-success font-medium">
                  - Led transition of 4 legacy server environments; completed setup 2 weeks ahead of timeline and saved Rs. 8 lakh in deployment overheads.
                </div>
              </div>

              <div className="bullet-contrast">
                <div className="weak-bullet text-caption italic">
                  - Helped the marketing team with product positioning.
                </div>
                <div className="strong-bullet text-caption text-mba-success font-medium">
                  - Co-designed branding strategy for premium skincare launch; increased store checkouts by 18% in the South region within 30 days.
                </div>
              </div>
            </div>
          </div>

          <div className="recruiter-checklist">
            <h3 className="font-display text-h3 text-mba-ink font-bold mb-3">Top Recruiter Checklists</h3>
            <div className="grid-details">
              <div className="checklist-item">
                <span className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-1">Consulting (McKinsey/BCG)</span>
                <p className="text-caption text-mba-ink-soft m-0">Look for spike profiles: IIT/BITS/SRCC brand names, high CGPAs (9+), international projects, and leadership spikes (e.g. club president).</p>
              </div>
              <div className="checklist-item">
                <span className="font-mono text-[10px] text-mba-accent uppercase tracking-wider block mb-1">FMCG (HUL/P&G)</span>
                <p className="text-caption text-mba-ink-soft m-0">Prioritize clear evidence of responsibility, grit, and real operational agency. Experience leading small local teams or running sports clubs.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        .interview-container {
          padding-bottom: var(--space-8);
        }
        .interview-header {
          border-left: 3px solid var(--mba-accent);
          padding-left: var(--space-4);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--mba-rule);
        }
        .tab-segments {
          display: flex;
          border-bottom: 2px solid var(--mba-rule);
        }
        .tab-btn {
          flex: 1;
          background: none;
          border: none;
          padding: var(--space-3) 0;
          color: var(--mba-ink-faint);
          cursor: pointer;
          text-align: center;
          position: relative;
          transition: color 150ms ease;
        }
        .tab-btn:hover {
          color: var(--mba-ink-soft);
        }
        .tab-btn.active {
          color: var(--mba-accent);
          font-weight: 600;
        }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--mba-accent);
        }
        .intro-card, .wat-prompt-card, .timeline-card, .resume-structure-card {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          box-shadow: var(--shadow-sm);
        }
        .category-block {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
          box-shadow: var(--shadow-sm);
        }
        .category-toggle {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: none;
          border: none;
          color: var(--mba-ink);
          cursor: pointer;
          text-align: left;
        }
        .grid-details {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-3);
        }
        @media (min-width: 640px) {
          .grid-details {
            grid-template-columns: 1fr 1fr;
          }
        }
        .detail-box, .checklist-item {
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-3) var(--space-4);
        }
        .tips-list, .pitfalls-list {
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
        }
        .contrast-card {
          border-radius: var(--radius-sm);
          padding: var(--space-3) var(--space-4);
        }
        .contrast-card.weak {
          background: #fdf2f2;
          border: 1px solid var(--mba-danger-soft);
        }
        .contrast-card.strong {
          background: #f0fdf4;
          border: 1px solid var(--mba-success-soft);
        }
        .timer-badge {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          font-size: 11px;
          cursor: pointer;
          color: var(--mba-ink-soft);
        }
        .wat-textarea {
          width: 100%;
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
          background: var(--mba-surface-sunk);
          color: var(--mba-ink);
          resize: vertical;
          font-family: inherit;
          transition: border-color 150ms ease, background 150ms ease;
        }
        .wat-textarea:focus {
          outline: none;
          border-color: var(--mba-accent);
          background: var(--mba-surface);
        }
        .spelt-card, .comparison-table-card, .ppo-card, .recruiter-checklist {
          background: var(--mba-surface);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          box-shadow: var(--shadow-sm);
        }
        .spelt-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: var(--space-2);
          text-align: center;
        }
        .spelt-item {
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-2);
          font-size: 11px;
        }
        .reveal-essay-btn {
          width: 100%;
          background: var(--mba-accent);
          color: #ffffff;
          border: none;
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-weight: 600;
        }
        .reveal-essay-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .essay-content-card {
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-5);
        }
        .hide-essay-btn {
          background: none;
          border: none;
          color: var(--mba-accent);
          cursor: pointer;
          text-decoration: underline;
        }
        .sip-timeline {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .timeline-item {
          display: flex;
          gap: var(--space-4);
          align-items: flex-start;
        }
        .time-marker {
          background: var(--mba-accent-soft);
          border: 1px solid var(--mba-rule);
          color: var(--mba-accent);
          font-weight: bold;
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-sm);
          width: 80px;
          text-align: center;
          flex-shrink: 0;
        }
        .time-details {
          color: var(--mba-ink-soft);
        }
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .comparison-table th, .comparison-table td {
          border: 1px solid var(--mba-rule);
          padding: var(--space-3);
        }
        .comparison-table th {
          background: var(--mba-surface-sunk);
          color: var(--mba-ink);
        }
        .comparison-table td {
          color: var(--mba-ink-soft);
        }
        .formula-box {
          background: var(--mba-surface-sunk);
          border: 1px dashed var(--mba-rule);
          border-radius: var(--radius-sm);
        }
        .bullet-contrast {
          background: var(--mba-surface-sunk);
          border: 1px solid var(--mba-rule);
          border-radius: var(--radius-sm);
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .weak-bullet {
          color: var(--mba-ink-faint);
        }
      `}</style>
    </div>
  )
}
