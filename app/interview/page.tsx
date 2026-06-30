'use client'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Key, Map, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react'
import type { InterviewCategory } from '@/lib/content/types'

interface QuestionItem {
  question: string
  intent: string
  blueprint: string
  pointers: string[]
  pitfalls: string[]
  comparison: {
    weak: string
    strong: string
  }
}

interface CategoryGroup {
  category: InterviewCategory
  items: QuestionItem[]
}

const questions: CategoryGroup[] = [
  {
    category: 'Background',
    items: [
      {
        question: 'Tell me about yourself.',
        intent: 'The interviewer wants to assess your communication clarity, self-awareness, and professional narrative flow. They are looking to see how logically you connect your past decisions to your present situation and future goals, and whether you can pitch yourself concisely without rambling.',
        blueprint: 'Present-Past-Future: (1) Present: Your current role, industry, and a high-impact achievement (30s). (2) Past: The critical pivot points in your career—how you got here and skills acquired (40s). (3) Future: Your immediate goals, why an MBA is the critical bridge right now, and why this school is the perfect catalyst (30s).',
        pointers: [
          'Use the Present-Past-Future structure: current role and key achievement, how you got here, and why MBA now.',
          'Quantify achievements: X% revenue growth, Y size of cross-functional team, Z crore budget managed.',
          'Keep it strictly to 90-120 seconds. Focus on the highlights; do not recite dates and facts.',
          'End with a strong transition to why this specific institution and program fits your future path.',
        ],
        pitfalls: [
          'Reciting your resume line-by-line. The panel already has your physical CV in front of them.',
          'Beginning with childhood, high school, or personal details without connecting them to your professional drive.',
          'Monologuing for over 3 minutes, which kills panel engagement and shows poor communication control.',
        ],
        comparison: {
          weak: 'I graduated from college in 2018 with a degree in engineering. Then I joined Infosys as a software developer, where I worked on Java databases. In 2021, I switched to Deloitte, where I did IT consulting. Now I want to do an MBA to get into management and get a higher salary, and I think your school is very good.',
          strong: 'Currently, I am a Senior Consultant at Deloitte, specializing in digital transformation for retail banks. Most recently, I led a team of 4 to migrate a legacy core banking system, which reduced client transaction times by 40% and saved Rs. 12 crore annually. Prior to this, I built my analytical foundation as a software engineer at Infosys. While I have developed strong technical execution skills, I have reached a pivot point where I need to master strategic finance and organizational design to lead end-to-end business units. This makes an MBA at your school the critical next step, particularly due to your case-method pedagogy and strong retail banking industry partnerships.'
        }
      },
      {
        question: 'What is your most significant professional achievement?',
        intent: 'The panel is looking for evidence of individual agency, leadership capacity, and business impact. They want to see how you define success, how you navigate obstacles, and whether you understand the financial/operational value of your work to the broader organization.',
        blueprint: 'STAR Format: (1) Situation: The context, challenge, or crisis you faced (15%). (2) Task: The specific goal or metric you had to achieve (15%). (3) Action: The concrete, step-by-step actions *you* personally took—including leadership and problem-solving (50%). (4) Result: The quantified business outcome (20%).',
        pointers: [
          'Use the STAR format: Situation, Task, Action, Result to keep the narrative structured and punchy.',
          'Quantify the result (revenue, cost, efficiency, team growth) using absolute numbers and percentages.',
          'Focus on your personal contribution, not team output — panels look for individual agency.',
          'Choose an achievement that reveals a leadership quality (resilience, influence, innovation) relevant to your MBA goals.',
        ],
        pitfalls: [
          'Choosing a team achievement and failing to articulate your specific role or personal contribution.',
          'Selecting an achievement from college or too early in your career that does not reflect your current professional caliber.',
          'Providing too much technical jargon or context, which dilutes the leadership and business impact of the story.',
        ],
        comparison: {
          weak: 'At my company, we had a major problem with client onboarding delays. I was put on a project team to fix it. We held brainstorm sessions and designed a new portal. This reduced onboarding times significantly and the client was happy. I received a spot award for my contribution.',
          strong: 'In Q3 FY25, our fintech platform faced a 35% customer drop-off during onboarding due to a complex 12-step verification process, threatening our quarterly active user target. I took the initiative to map the customer journey and identified that the API verification step was the primary bottleneck, taking 8 seconds per user. I negotiated with our engineering head to re-allocate 2 developers and designed a parallel-processing verification system. By coordinating across compliance, product, and tech, I personally drove the redesign down to 4 steps. As a result, onboarding drop-off decreased from 35% to 8%, securing 18,000 additional monthly active users and generating Rs. 45 lakh in incremental transaction revenue.'
        }
      }
    ]
  },
  {
    category: 'Why MBA',
    items: [
      {
        question: 'Why do you want an MBA at this point in your career?',
        intent: 'The panel wants to ensure you are not using an MBA as a default escape route from a job you dislike. They are looking for a clear, proactive career roadmap where the MBA acts as the logical, indispensable bridge between your current capabilities and your post-MBA target role.',
        blueprint: 'The Bridge Structure: (1) Current State: The skills, experiences, and track record you have built (30%). (2) Future Goal: Your short-term (1-3 years) and long-term (5-10 years) career goals (30%). (3) The Gap: The specific skills, network, and credibility gaps that prevent you from achieving those goals today (20%). (4) The Catalyst: Why this specific business school is the only place to fill those gaps (20%).',
        pointers: [
          'Structure as: What I have done, What I want to do, Why MBA is the bridge, and Why this school specifically.',
          'Be specific about the skills gap: "I have strong operational exposure but lack formal strategy frameworks and financial modeling experience."',
          'Research the school deeply: cite specific faculty, elective courses, clubs, or alumni from your target industry.',
          'Show urgency: explain why taking this step now fits perfectly into your career progression, rather than waiting.',
        ],
        pitfalls: [
          'Giving generic answers like "for a better network" or "to accelerate my career" without offering concrete details.',
          'Making it sound purely credential-driven or salary-driven rather than capability-driven.',
          'Failing to research the specific school, making your pitch sound copied and pasted for multiple institutions.',
        ],
        comparison: {
          weak: 'I want to do an MBA because I want to transition into strategy consulting. My current engineering job has very slow growth, and an MBA will help me get a higher salary and a better brand name. Your school has great placements in consulting, so it is my top choice.',
          strong: 'Over the last 4 years in supply chain operations, I have mastered the technical side of inventory optimization. However, during a recent cross-functional warehouse integration project, I realized that my ability to drive strategic corporate decisions is limited by my gaps in financial modeling and macro-strategy. My goal is to transition into a Strategy Consultant role focusing on operational turnarounds. To do this, I need to formalize my understanding of corporate finance and corporate strategy. Your program is the ideal bridge because of its elective in Advanced Corporate Restructuring and the Operations Club, which partners with local firms on real-world projects. Doing this now allows me to leverage my operational base while building the business acumen needed to advise executives.'
        }
      }
    ]
  },
  {
    category: 'Ethics',
    items: [
      {
        question: 'You discover that your manager is signing off on inflated expense reports. What do you do?',
        intent: 'The panel is testing your ethical integrity, professional maturity, and ability to handle conflict. They want to see if you can address a serious ethical violation without being self-righteous or causing unnecessary organizational damage.',
        blueprint: 'Verify & Escalate (V&E): (1) Verify: Confirm the facts and rule out clerical errors before making accusations (20%). (2) Direct Communication: Have a private, non-confrontational conversation with the manager to seek clarification (40%). (3) Escalate: If the violation is confirmed and unresolved, escalate through formal, confidential channels (40%).',
        pointers: [
          'Acknowledge the complexity: loyalty to manager vs. organizational integrity vs. personal ethics.',
          'State a clear position without being preachy: you would address it, but with judgment about method.',
          'Structure: (1) Verify (not assume), (2) Approach the manager privately first, (3) If unresolved, escalate through appropriate channel.',
          'Mention whistleblower protections and company ethics helpline as escalation tools.',
        ],
        pitfalls: [
          'Immediately saying "I would report to HR" without considering direct conversation first — signals lack of maturity.',
          'Saying "it is not my business" or "I would ignore it" — panels test whether you have ethical agency.',
          'Being absolutist and self-righteous — panels want principled judgment, not a lecture.',
        ],
        comparison: {
          weak: 'I would immediately go to HR and report my manager. Stealing from the company is wrong, and I do not want to be associated with an unethical boss. I would show them the expense reports as proof.',
          strong: 'This is a sensitive situation that requires balancing ethical integrity with professional maturity. First, I would verify the facts to ensure there is no misunderstanding or simple clerical error. If the discrepancy is clear, I would schedule a private conversation with my manager. I would present the data neutrally, asking for clarification on the expense line items. This gives them the opportunity to correct a mistake or explain the context. However, if it becomes clear that the expenses are intentionally inflated and the manager refuses to correct it, my ultimate duty is to the organization. I would escalate the matter through the company\'s confidential whistleblower hotline or consult with our compliance officer, ensuring that I adhere to the formal reporting protocol while protecting the team\'s operational continuity.'
        }
      },
      {
        question: 'You are asked by a senior leader to present data selectively to make results look better than they are. What do you do?',
        intent: 'The panel is assessing your professional courage and communication diplomacy. They want to see if you can push back against senior authority when asked to compromise standards, while maintaining a collaborative and constructive relationship.',
        blueprint: 'Frame & Propose (F&P): (1) Acknowledge: Understand the leader\'s objective (e.g. presenting a positive narrative to investors) (20%). (2) Boundaries: Clearly state the ethical boundary (e.g. we cannot omit material negative trends) (30%). (3) Alternative: Propose a framing that is favorable but entirely honest (50%).',
        pointers: [
          'Distinguish between data selection (choosing the right metrics) and data manipulation (misrepresenting results).',
          'Express your commitment to accurate reporting while acknowledging the business context.',
          'Offer an alternative: "I can present the results in the most favorable but accurate light. Let me show you."',
          'If the ask crosses into misrepresentation, escalate — and be prepared to say so.',
        ],
        pitfalls: [
          'Agreeing to avoid conflict.',
          'Refusing outright without exploring whether there is a legitimate framing.',
        ],
        comparison: {
          weak: 'I would refuse to do it. It is unethical to lie with data, and I would tell the leader that I cannot present a false deck. If they insist, I would go to their manager or HR.',
          strong: 'I would seek a middle ground that protects the company\'s credibility while addressing the senior leader\'s goals. I would acknowledge their intent to present a strong narrative to the committee. However, I would point out that omitting critical negative metrics risks damaging our credibility if discovered during Q&A. I would suggest presenting the data honestly but immediately following it with a slide detailing our corrective action plan. For example: "While our customer acquisition rate declined by 15% this quarter, we can highlight that our customer retention rate rose by 10%, and outline our plan to address the acquisition drop. This keeps the presentation optimistic but factually robust." If the leader still insists on outright manipulation, I would respectfully decline to sign off on the data, explaining that maintaining accuracy is non-negotiable for my role.'
        }
      }
    ]
  },
  {
    category: 'Hobbies',
    items: [
      {
        question: 'What do you do outside of work?',
        intent: 'The panel wants to see if you are a well-rounded individual who can manage stress, cultivate curiosity, and bring a unique perspective to the classroom. They look for passion, dedication, and transferable qualities like discipline, empathy, or creativity.',
        blueprint: 'Passion-Impact-Transfer (PIT): (1) The Hobby: What you do, how long, and how frequently (30%). (2) The Achievement/Output: A specific project, milestone, or challenge you completed (30%). (3) The Transfer: How the qualities developed in this hobby make you a better student, collaborator, or leader (40%).',
        pointers: [
          'This is a character question, not a resume item. Be genuine and authentic.',
          'Connect the hobby to a quality relevant to leadership or learning: endurance sport = discipline, fiction reading = empathy, improv comedy = communication agility.',
          'Be specific: rather than "I like to read," say "I read one business history and one biography per month, currently reading X."',
          'Show curiosity that extends beyond work — panels favor polymaths.',
        ],
        pitfalls: [
          'Listing generic hobbies without depth or details ("travel, listening to music, playing cricket").',
          'Making it sound like you have no interests outside of work, signaling potential burnout risk.',
          'Fabricating a hobby to sound impressive (e.g. claiming to love classical music but not knowing any composers).',
        ],
        comparison: {
          weak: 'I like to play sports and watch movies. I play cricket with my friends on weekends, and I like to watch thriller movies on Netflix. It helps me relax after a long week of work.',
          strong: 'Outside of work, I am an avid distance runner and have completed three half-marathons over the past two years. Training for these events requires waking up at 5:00 AM four days a week, which has instilled in me a deep sense of personal discipline and structured time management. Running also serves as my primary stress-management tool; it is where I clear my head and solve operational problems. The mental resilience needed to push through the final 5 kilometers of a race is highly transferable to corporate situations, helping me stay calm and focused during high-pressure project deadlines or complex team dynamics.'
        }
      }
    ]
  },
  {
    category: 'Current Affairs',
    items: [
      {
        question: 'What is the most significant economic development in India in the past 6 months?',
        intent: 'The panel wants to evaluate your commercial awareness, economic literacy, and ability to think like a general manager. They are testing whether you read beyond headlines, understand macroeconomic linkages, and can form a structured, independent business opinion.',
        blueprint: 'Macro-Micro-Impact (MMI): (1) The Development: The core event with key metrics (20%). (2) The Macro Drivers: Why this happened (monetary policy, fiscal spending, global trade) (30%). (3) The Micro Impact: How this affects specific business sectors, consumer behavior, or investment (30%). (4) Your Synthesis: The long-term opportunities or risks for India (20%).',
        pointers: [
          'Pick a topic you know deeply, not the most obvious headline.',
          'Structure: What happened, Why it matters economically, Impact on business/sector, Your view on long-term implications.',
          'Use numbers: GDP, trade data, sector impact metrics. Show you read the data, not just the headline.',
          'Offer a nuanced view — "While the headline is X, the more important signal is Y."',
        ],
        pitfalls: [
          'Picking a topic and being unable to go beyond the headline level.',
          'Having no view. "Both sides have points" without a stated position signals lack of strategic conviction.',
          'Not connecting it to business implications.',
        ],
        comparison: {
          weak: 'I think the rise of UPI is the most important development. Everyone is using it now, even small shops. It has made payments very easy, and the government is promoting digital payments everywhere. It is a big success for India.',
          strong: 'The most significant development is the sustained expansion of India\'s service exports, which reached a record $31.8 billion in May 2026. This is driven not just by traditional IT services, but by the rapid institutionalization of Global Capability Centers (GCCs), which now number over 1,600 in India. This services surplus is structurally crucial because it narrows our trade deficit to a 10-month low of $19.6 billion, cushioning the economy against high crude oil import bills and stabilizing the rupee. For businesses, this influx of high-value knowledge work is accelerating the domestic talent pool in AI and analytics, but it is also raising salary inflation for tech talent. In the long term, this shifts India\'s global positioning from a low-cost back-office to a global engineering and innovation hub.'
        }
      }
    ]
  }
]

export default function InterviewPrepPage() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)
  const [openCategory, setOpenCategory] = useState<InterviewCategory | null>('Background')

  return (
    <div>
      <header style={{ paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--mba-rule)', marginBottom: 'var(--space-6)', borderLeft: '3px solid var(--mba-accent)', paddingLeft: 'var(--space-4)' }}>
        <span className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest block mb-3">Skill Room</span>
        <h1 className="font-display text-display text-mba-ink" style={{ lineHeight: '1.15' }}>Interview Prep</h1>
        <p className="font-body text-body text-mba-ink-soft prose-measure mt-3">
          Categorized question bank. Open each question for structured pointers and pitfalls to avoid.
        </p>
      </header>

      {questions.map((cat) => (
        <section key={cat.category} className="iprep-category">
          <button
            className="iprep-cat-header"
            onClick={() => setOpenCategory(openCategory === cat.category ? null : cat.category)}
            aria-expanded={openCategory === cat.category}
          >
            <h2 className="font-body text-h3 text-mba-ink" style={{ fontWeight: 600 }}>{cat.category}</h2>
            <span className="font-mono text-mono-label text-mba-ink-faint">{cat.items.length} questions</span>
            {openCategory === cat.category ? <ChevronUp size={16} className="cat-chevron" /> : <ChevronDown size={16} className="cat-chevron" />}
          </button>

          {openCategory === cat.category && (
            <div className="iprep-questions">
              {cat.items.map((q, qi) => {
                const key = `${cat.category}-${qi}`
                const isOpen = openQuestion === key
                return (
                  <div key={key} className="iprep-q">
                    <button
                      className="iprep-q-header"
                      onClick={() => setOpenQuestion(isOpen ? null : key)}
                      aria-expanded={isOpen}
                    >
                      <p className="font-body text-body text-mba-ink" style={{ fontWeight: 500, textAlign: 'left' }}>{q.question}</p>
                      {isOpen ? <ChevronUp size={14} style={{ flexShrink: 0, color: 'var(--mba-ink-faint)' }} /> : <ChevronDown size={14} style={{ flexShrink: 0, color: 'var(--mba-ink-faint)' }} />}
                    </button>

                    {isOpen && (
                      <div className="iprep-q-body">
                        {/* Interviewer Intent */}
                        <div className="iprep-block iprep-intent">
                          <h4 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-2 flex items-center gap-1">
                            <HelpCircle size={12} /> Interviewer Intent
                          </h4>
                          <p className="font-body text-body text-mba-ink-soft prose-measure">{q.intent}</p>
                        </div>

                        {/* Answer Blueprint */}
                        <div className="iprep-block iprep-blueprint">
                          <h4 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-2 flex items-center gap-1">
                            <Map size={12} /> Target Blueprint Structure
                          </h4>
                          <p className="font-body text-body text-mba-ink-soft prose-measure" style={{ fontStyle: 'italic' }}>
                            {q.blueprint}
                          </p>
                        </div>

                        {/* Pointers and Pitfalls Side-by-Side */}
                        <div className="iprep-side-by-side">
                          <div className="iprep-block iprep-pointers">
                            <h4 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-3 flex items-center gap-1">
                              <CheckCircle size={12} style={{ color: 'var(--mba-success)' }} /> How to answer
                            </h4>
                            <ul className="iprep-list">
                              {q.pointers.map((p, pi) => (
                                <li key={pi} className="font-body text-body text-mba-ink-soft">{p}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="iprep-block iprep-pitfalls">
                            <h4 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-3 flex items-center gap-1">
                              <AlertTriangle size={12} style={{ color: 'var(--mba-warning)' }} /> Pitfalls
                            </h4>
                            <ul className="iprep-list">
                              {q.pitfalls.map((p, pi) => (
                                <li key={pi} className="font-body text-body text-mba-ink-soft">{p}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Comparison Block */}
                        <div className="iprep-block iprep-comparison">
                          <h4 className="font-mono text-mono-label text-mba-ink-faint uppercase tracking-widest mb-3">Response Comparison</h4>
                          <div className="comparison-grid">
                            <div className="comparison-col weak-col">
                              <span className="font-mono text-mono-label text-mba-danger uppercase tracking-widest block mb-2">Weak Response</span>
                              <p className="font-body text-caption text-mba-ink-soft italic">"{q.comparison.weak}"</p>
                            </div>
                            <div className="comparison-col strong-col">
                              <span className="font-mono text-mono-label text-mba-success uppercase tracking-widest block mb-2">Strong Response</span>
                              <p className="font-body text-caption text-mba-ink-soft">"{q.comparison.strong}"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>
      ))}

      <style jsx>{`
        .iprep-category { border-bottom: 1px solid var(--mba-rule); }
        .iprep-category:last-child { border-bottom: none; }
        .iprep-cat-header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); padding: var(--space-5) 0; background: none; border: none; cursor: pointer; width: 100%; text-align: left; }
        .iprep-cat-header:hover h2 { color: var(--mba-accent); }
        .cat-chevron { color: var(--mba-ink-faint); flex-shrink: 0; }
        .iprep-questions { padding-bottom: var(--space-4); }
        .iprep-q { border-top: 1px solid var(--mba-rule); }
        .iprep-q-header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); padding: var(--space-4) 0; background: none; border: none; cursor: pointer; width: 100%; }
        
        .iprep-q-body { padding: 0 0 var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }
        
        .iprep-block { padding: var(--space-4) var(--space-5); background: var(--mba-surface-sunk); border-radius: var(--radius-md); border: 1px solid var(--mba-rule); }
        .iprep-intent { border-left: 3px solid var(--mba-accent); }
        .iprep-blueprint { border-left: 3px solid var(--mba-ink-soft); }
        
        .iprep-side-by-side { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
        @media (max-width: 640px) { .iprep-side-by-side { grid-template-columns: 1fr; } }
        
        .iprep-pointers { border-left: 3px solid var(--mba-success); }
        .iprep-pitfalls { border-left: 3px solid var(--mba-warning); }
        .iprep-list { padding-left: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); margin: 0; }
        .iprep-list li { list-style-type: disc; }

        .iprep-comparison { border-left: 3px solid var(--mba-ink-faint); }
        .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); }
        @media (max-width: 640px) { .comparison-grid { grid-template-columns: 1fr; } }
        .comparison-col { padding: var(--space-3) var(--space-4); background: var(--mba-surface-sunk); border-radius: var(--radius-sm); border: 1px solid var(--mba-rule); }
        .weak-col { border-top: 2px solid var(--mba-danger); }
        .strong-col { border-top: 2px solid var(--mba-success); }
      `}</style>
    </div>
  )
}
