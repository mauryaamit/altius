import type { VocabEntry, GrammarEntry, ReadingPassage, WATPrompt } from './types'

export const vocabularyPool: VocabEntry[] = [
  {
    "word": "Inimitable",
    "roots": "Roots",
    "definition": "Unique; impossible to copy or imitate.",
    "exampleSentence": "The founder delivered a presentation with her inimitable blend of humor and analytics.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Fastidious",
    "roots": "Roots",
    "definition": "Very attentive to accuracy and detail.",
    "exampleSentence": "The auditor was fastidious in checking the company's ledger entries.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Equivocal",
    "roots": "Roots",
    "definition": "Open to more than one interpretation; ambiguous.",
    "exampleSentence": "The CEO's equivocal response left investors uncertain about the dividend policy.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Tractable",
    "roots": "Roots",
    "definition": "Easy to control or influence; manageable.",
    "exampleSentence": "Once the initial integration friction subsided, the supply chain became more tractable.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Paucity",
    "roots": "Roots",
    "definition": "The presence of something only in small or insufficient quantities.",
    "exampleSentence": "The paucity of first-party consumer data is a major challenge for offline retail.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Pernicious",
    "roots": "Roots",
    "definition": "Having a harmful effect, especially in a gradual or subtle way.",
    "exampleSentence": "The pernicious effect of corporate hubris has led to multiple failed mergers.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Laconism",
    "roots": "Roots",
    "definition": "Brevity of expression; conciseness.",
    "exampleSentence": "Her laconism was appreciated during the brief board meeting.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Acquiesce",
    "roots": "Roots",
    "definition": "Accept something reluctantly but without protest.",
    "exampleSentence": "The board chose to acquiesce to the regulator's offshore compliance demands.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Anomaly",
    "roots": "Roots",
    "definition": "Something that deviates from what is standard, normal, or expected.",
    "exampleSentence": "A Veblen good is a pricing anomaly that defies standard demand curves.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Pragmatic",
    "roots": "Roots",
    "definition": "Dealing with things sensibly and realistically in a practical way.",
    "exampleSentence": "The CFO took a pragmatic approach to cutting the marketing budget.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Superfluous",
    "roots": "Roots",
    "definition": "Unnecessary, especially through being more than enough.",
    "exampleSentence": "The software bloat added superfluous features that slowed down the app.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Obfuscate",
    "roots": "Roots",
    "definition": "Render obscure, unclear, or unintelligible.",
    "exampleSentence": "The legal advisors attempted to obfuscate the offshore holdings details.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Capricious",
    "roots": "Roots",
    "definition": "Given to sudden and unaccountable changes of mood or behavior.",
    "exampleSentence": "The capricious nature of venture capital funding requires companies to preserve cash.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Proclivity",
    "roots": "Roots",
    "definition": "A tendency to choose or do something regularly.",
    "exampleSentence": "He has a proclivity for risk-taking in early-stage seed allocations.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Ephemeral",
    "roots": "Roots",
    "definition": "Lasting for a very short time.",
    "exampleSentence": "Viral social media trends are ephemeral, offering thin customer lifetime value.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Specious",
    "roots": "Roots",
    "definition": "Superficially plausible, but actually wrong.",
    "exampleSentence": "The agency presented a specious argument about organic ROI growth.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Pro-actively",
    "roots": "Roots",
    "definition": "Taking action by causing change rather than reacting to it.",
    "exampleSentence": "The developer proactively resolved hydration mismatches before pushing to production.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Assiduous",
    "roots": "Roots",
    "definition": "Showing great care and perseverance.",
    "exampleSentence": "She was assiduous in resolving the React hydration warnings.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Mitigate",
    "roots": "Roots",
    "definition": "Make less severe, serious, or painful.",
    "exampleSentence": "Multi-sourcing helps to mitigate the fragility of JIT supply chains.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Lethargic",
    "roots": "Roots",
    "definition": "Affected by lethargy; sluggish and apathetic.",
    "exampleSentence": "The retail sector was lethargic due to rising inflation rates.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Meticulous",
    "roots": "Roots",
    "definition": "Showing great attention to detail; very careful and precise.",
    "exampleSentence": "He did a meticulous audit of the company's capital allocation.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Rancor",
    "roots": "Roots",
    "definition": "Bitterness or resentfulness, especially when long-standing.",
    "exampleSentence": "The merger was finalized without any rancor between the promoters.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Taciturn",
    "roots": "Roots",
    "definition": "Reserved or uncommunicative in speech; saying little.",
    "exampleSentence": "The founder became taciturn when questioned about the valuation write-down.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Vociferous",
    "roots": "Roots",
    "definition": "Vehement or clamorous; making a loud outcry.",
    "exampleSentence": "The restaurant association was vociferous in boycotting the loyalty discounts.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Sycophant",
    "roots": "Roots",
    "definition": "A person who acts obsequiously toward someone important to gain advantage.",
    "exampleSentence": "The corporate board was filled with sycophants who never challenged the CEO.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Obdurate",
    "roots": "Roots",
    "definition": "Stubbornly refusing to change one's opinion or course of action.",
    "exampleSentence": "The regulator was obdurate in enforcing the UBO disclosure guidelines.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Garrulous",
    "roots": "Roots",
    "definition": "Excessively talkative, especially on trivial matters.",
    "exampleSentence": "The presenter was garrulous, dragging the meeting past its scheduled time.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Banal",
    "roots": "Roots",
    "definition": "So lacking in originality as to be obvious and boring.",
    "exampleSentence": "The agency's creative copy was banal, failing to capture user attention.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Transient",
    "roots": "Roots",
    "definition": "Lasting only for a short time; impermanent.",
    "exampleSentence": "Outbound tourist traffic is transient, peaking during summer months.",
    "usedIn": "strategy memos"
  },
  {
    "word": "Nefarious",
    "roots": "Roots",
    "definition": "Wicked or criminal.",
    "exampleSentence": "The promoter engaged in nefarious circular trading to inflate pre-IPO stock prices.",
    "usedIn": "strategy memos"
  }
];

export const grammarPool: GrammarEntry[] = [
  {
    "rule": "Dangling Modifiers",
    "examples": [
      "Incorrect: Walking into the warehouse, the inventory looked bloated. (Who was walking?)"
    ],
    "commonError": "Incorrect: Walking into the warehouse, the inventory looked bloated. (Who was walking?)"
  },
  {
    "rule": "Subject-Verb Agreement",
    "examples": [
      "Incorrect: The board of directors are voting on the demerger tomorrow."
    ],
    "commonError": "Incorrect: The board of directors are voting on the demerger tomorrow."
  },
  {
    "rule": "Pronoun-Antecedent Agreement",
    "examples": [
      "Incorrect: Every customer must submit their KYC documents online."
    ],
    "commonError": "Incorrect: Every customer must submit their KYC documents online."
  },
  {
    "rule": "Parallel Structure",
    "examples": [
      "Incorrect: The role involves managing sales, distributor audits, and to hire staff."
    ],
    "commonError": "Incorrect: The role involves managing sales, distributor audits, and to hire staff."
  },
  {
    "rule": "Affect vs Effect",
    "examples": [
      "Incorrect: The new tariff will effect our import margins severely."
    ],
    "commonError": "Incorrect: The new tariff will effect our import margins severely."
  },
  {
    "rule": "Its vs It's",
    "examples": [
      "Incorrect: The platform updated it's fee structure yesterday."
    ],
    "commonError": "Incorrect: The platform updated it's fee structure yesterday."
  },
  {
    "rule": "Who vs Whom",
    "examples": [
      "Incorrect: Who did the board nominate for the CEO position?"
    ],
    "commonError": "Incorrect: Who did the board nominate for the CEO position?"
  },
  {
    "rule": "Fewer vs Less",
    "examples": [
      "Incorrect: The store recorded less visitors this week due to rains."
    ],
    "commonError": "Incorrect: The store recorded less visitors this week due to rains."
  },
  {
    "rule": "Adverb Placement",
    "examples": [
      "Incorrect: The CFO almost spent Rs. 5 crore on ad campaigns. (Did she spend it?)"
    ],
    "commonError": "Incorrect: The CFO almost spent Rs. 5 crore on ad campaigns. (Did she spend it?)"
  },
  {
    "rule": "Split Infinitives",
    "examples": [
      "Incorrect: The strategy is to rapidly expand modern trade distribution."
    ],
    "commonError": "Incorrect: The strategy is to rapidly expand modern trade distribution."
  },
  {
    "rule": "Double Negatives",
    "examples": [
      "Incorrect: The compliance audit did not find no irregularities."
    ],
    "commonError": "Incorrect: The compliance audit did not find no irregularities."
  },
  {
    "rule": "Misplaced Apostrophes",
    "examples": [
      "Incorrect: Multiple CEO's attended the retail summit."
    ],
    "commonError": "Incorrect: Multiple CEO's attended the retail summit."
  },
  {
    "rule": "Coordinate Adjectives",
    "examples": [
      "Incorrect: The brand has a bold colorful packaging design."
    ],
    "commonError": "Incorrect: The brand has a bold colorful packaging design."
  },
  {
    "rule": "Subjunctive Mood",
    "examples": [
      "Incorrect: If the founder was here, he would reject this valuation."
    ],
    "commonError": "Incorrect: If the founder was here, he would reject this valuation."
  },
  {
    "rule": "Neither/Nor Agreement",
    "examples": [
      "Incorrect: Neither the CEO nor the CFO are attending the press conference."
    ],
    "commonError": "Incorrect: Neither the CEO nor the CFO are attending the press conference."
  },
  {
    "rule": "Due to vs Because of",
    "examples": [
      "Incorrect: The sales dropped due to poor supply chain logistics."
    ],
    "commonError": "Incorrect: The sales dropped due to poor supply chain logistics."
  },
  {
    "rule": "Among vs Between",
    "examples": [
      "Incorrect: The dispute was resolved among the two founders."
    ],
    "commonError": "Incorrect: The dispute was resolved among the two founders."
  },
  {
    "rule": "Redundancy",
    "examples": [
      "Incorrect: The company will return back the deposits to retail investors."
    ],
    "commonError": "Incorrect: The company will return back the deposits to retail investors."
  },
  {
    "rule": "Run-on Sentences",
    "examples": [
      "Incorrect: The app launched in June it reached 1 million users by August."
    ],
    "commonError": "Incorrect: The app launched in June it reached 1 million users by August."
  },
  {
    "rule": "Passive Voice Overuse",
    "examples": [
      "Incorrect: The UBO disclosure documents were submitted by the fund managers."
    ],
    "commonError": "Incorrect: The UBO disclosure documents were submitted by the fund managers."
  }
];

export const readingPool: ReadingPassage[] = [
  {
    "title": "Decentralized Public Infrastructure (DPI) Economics",
    "passage": "India's Digital Public Infrastructure (DPI), commonly referred to as the India Stack, represents a paradigm shift in financial inclusion policy. Historically, developing economies outsourced payment ecosystems to private entities like Visa or Mastercard. While private networks drive rapid consumer adoption, they charge interchange fees (typically 1.5-3%) that act as a tax on retail trade. India's DPI model bypasses this by treating basic rails as open-source public goods. UPI, ONDC, and Aadhaar operate on public funding, reducing merchant transaction fees to near-zero. However, critics argue that this model is fiscally unsustainable for resource-constrained nations, as the Indian government subsidizes UPI MDR waivers at thousands of crores annually.",
    "questions": [
      {
        "question": "Which of the following best states the primary purpose of the passage?",
        "answer": "To analyze the economic trade-offs of India's DPI model versus private networks. The passage balances the cost savings of the DPI public goods model against its fiscal subsidy overheads."
      }
    ]
  },
  {
    "title": "Corporate Conglomerates in Emerging Markets",
    "passage": "In mature economies, capital markets penalize conglomerates, preferring pure-play firms that focus on a single industry. This 'conglomerate discount' reflects shareholder preference for direct portfolio diversification. In contrast, emerging markets like India often show a 'conglomerate premium,' where diversified groups like Tata or Reliance outperform specialized rivals. Institutional economists attribute this premium to market imperfections. Conglomerates operate internal capital markets, bypassing underdeveloped debt markets. Furthermore, they leverage unified brand trust and established distribution relationships to launch new ventures at lower risk, turning size into a defensive moat.",
    "questions": [
      {
        "question": "The author implies that the 'conglomerate premium' in emerging markets exists because:",
        "answer": "Conglomerates resolve systemic institutional and market frictions. Conglomerates use internal markets and brand trust to bypass underdeveloped external institutions."
      }
    ]
  },
  {
    "title": "GMAT Reading Comprehension Passage 3",
    "passage": "This is a standard GMAT-style reading comprehension passage. It discusses market dynamics and corporate strategy in segment 3. Read carefully to answer.",
    "questions": [
      {
        "question": "What is the main idea of this passage?",
        "answer": "To present a balanced view of strategic options. The passage outlines the strategic tradeoffs involved in this business sector."
      }
    ]
  },
  {
    "title": "GMAT Reading Comprehension Passage 4",
    "passage": "This is a standard GMAT-style reading comprehension passage. It discusses market dynamics and corporate strategy in segment 4. Read carefully to answer.",
    "questions": [
      {
        "question": "What is the main idea of this passage?",
        "answer": "To present a balanced view of strategic options. The passage outlines the strategic tradeoffs involved in this business sector."
      }
    ]
  },
  {
    "title": "GMAT Reading Comprehension Passage 5",
    "passage": "This is a standard GMAT-style reading comprehension passage. It discusses market dynamics and corporate strategy in segment 5. Read carefully to answer.",
    "questions": [
      {
        "question": "What is the main idea of this passage?",
        "answer": "To present a balanced view of strategic options. The passage outlines the strategic tradeoffs involved in this business sector."
      }
    ]
  },
  {
    "title": "GMAT Reading Comprehension Passage 6",
    "passage": "This is a standard GMAT-style reading comprehension passage. It discusses market dynamics and corporate strategy in segment 6. Read carefully to answer.",
    "questions": [
      {
        "question": "What is the main idea of this passage?",
        "answer": "To present a balanced view of strategic options. The passage outlines the strategic tradeoffs involved in this business sector."
      }
    ]
  },
  {
    "title": "GMAT Reading Comprehension Passage 7",
    "passage": "This is a standard GMAT-style reading comprehension passage. It discusses market dynamics and corporate strategy in segment 7. Read carefully to answer.",
    "questions": [
      {
        "question": "What is the main idea of this passage?",
        "answer": "To present a balanced view of strategic options. The passage outlines the strategic tradeoffs involved in this business sector."
      }
    ]
  },
  {
    "title": "GMAT Reading Comprehension Passage 8",
    "passage": "This is a standard GMAT-style reading comprehension passage. It discusses market dynamics and corporate strategy in segment 8. Read carefully to answer.",
    "questions": [
      {
        "question": "What is the main idea of this passage?",
        "answer": "To present a balanced view of strategic options. The passage outlines the strategic tradeoffs involved in this business sector."
      }
    ]
  },
  {
    "title": "GMAT Reading Comprehension Passage 9",
    "passage": "This is a standard GMAT-style reading comprehension passage. It discusses market dynamics and corporate strategy in segment 9. Read carefully to answer.",
    "questions": [
      {
        "question": "What is the main idea of this passage?",
        "answer": "To present a balanced view of strategic options. The passage outlines the strategic tradeoffs involved in this business sector."
      }
    ]
  },
  {
    "title": "GMAT Reading Comprehension Passage 10",
    "passage": "This is a standard GMAT-style reading comprehension passage. It discusses market dynamics and corporate strategy in segment 10. Read carefully to answer.",
    "questions": [
      {
        "question": "What is the main idea of this passage?",
        "answer": "To present a balanced view of strategic options. The passage outlines the strategic tradeoffs involved in this business sector."
      }
    ]
  }
];

export const watPool: WATPrompt[] = [
  {
    "prompt": "Collaborative vs Individual contribution in modern corporate structures.",
    "speltReminder": {
      "S": "Structure",
      "P": "Point",
      "E": "Explanation",
      "L": "Link",
      "T": "Thesis"
    },
    "modelEssay": "A thesis statement outlining that collaborative structure matches scale, whereas individual contribution drives quality."
  },
  {
    "prompt": "The ethical boundaries of AI automation in entry-level hiring processes.",
    "speltReminder": {
      "S": "Structure",
      "P": "Point",
      "E": "Explanation",
      "L": "Link",
      "T": "Thesis"
    },
    "modelEssay": "A thesis statement outlining that algorithmic hiring matches scale, but risks bias replication."
  },
  {
    "prompt": "Analytical prompt 3 on corporate governance and strategic alignment.",
    "speltReminder": {
      "S": "Structure",
      "P": "Point",
      "E": "Explanation",
      "L": "Link",
      "T": "Thesis"
    },
    "modelEssay": "Standard thesis statement for GMAT analytical essay 3."
  },
  {
    "prompt": "Analytical prompt 4 on corporate governance and strategic alignment.",
    "speltReminder": {
      "S": "Structure",
      "P": "Point",
      "E": "Explanation",
      "L": "Link",
      "T": "Thesis"
    },
    "modelEssay": "Standard thesis statement for GMAT analytical essay 4."
  },
  {
    "prompt": "Analytical prompt 5 on corporate governance and strategic alignment.",
    "speltReminder": {
      "S": "Structure",
      "P": "Point",
      "E": "Explanation",
      "L": "Link",
      "T": "Thesis"
    },
    "modelEssay": "Standard thesis statement for GMAT analytical essay 5."
  },
  {
    "prompt": "Analytical prompt 6 on corporate governance and strategic alignment.",
    "speltReminder": {
      "S": "Structure",
      "P": "Point",
      "E": "Explanation",
      "L": "Link",
      "T": "Thesis"
    },
    "modelEssay": "Standard thesis statement for GMAT analytical essay 6."
  },
  {
    "prompt": "Analytical prompt 7 on corporate governance and strategic alignment.",
    "speltReminder": {
      "S": "Structure",
      "P": "Point",
      "E": "Explanation",
      "L": "Link",
      "T": "Thesis"
    },
    "modelEssay": "Standard thesis statement for GMAT analytical essay 7."
  },
  {
    "prompt": "Analytical prompt 8 on corporate governance and strategic alignment.",
    "speltReminder": {
      "S": "Structure",
      "P": "Point",
      "E": "Explanation",
      "L": "Link",
      "T": "Thesis"
    },
    "modelEssay": "Standard thesis statement for GMAT analytical essay 8."
  },
  {
    "prompt": "Analytical prompt 9 on corporate governance and strategic alignment.",
    "speltReminder": {
      "S": "Structure",
      "P": "Point",
      "E": "Explanation",
      "L": "Link",
      "T": "Thesis"
    },
    "modelEssay": "Standard thesis statement for GMAT analytical essay 9."
  },
  {
    "prompt": "Analytical prompt 10 on corporate governance and strategic alignment.",
    "speltReminder": {
      "S": "Structure",
      "P": "Point",
      "E": "Explanation",
      "L": "Link",
      "T": "Thesis"
    },
    "modelEssay": "Standard thesis statement for GMAT analytical essay 10."
  }
];

export const businessPhrases = [
  {
    "phrase": "Move the needle",
    "context": "Used to describe action items that generate a measurable business result.",
    "example": "This pricing change won't move the needle; we need to fix the churn rate first."
  },
  {
    "phrase": "Low-hanging fruit",
    "context": "Refers to easily achieved targets or quick wins.",
    "example": "Optimizing checkout layout is low-hanging fruit for improving conversion rate."
  },
  {
    "phrase": "Circle back",
    "context": "Revisiting a discussion point later with more information.",
    "example": "Let's circle back to the WACC calculation after we get the target's debt figures."
  },
  {
    "phrase": "Boil the ocean",
    "context": "Taking on an over-ambitious, impossible task.",
    "example": "Trying to audit every single offline retailer is boiling the ocean; let's focus on top distributors."
  },
  {
    "phrase": "Touch base",
    "context": "Making brief contact to align on status.",
    "example": "I will touch base with the promoter team tomorrow morning."
  },
  {
    "phrase": "At the end of the day",
    "context": "The ultimate most important conclusion.",
    "example": "At the end of the day, if the unit margins don't cover CAC, the scale is empty."
  },
  {
    "phrase": "On the same page",
    "context": "Being in complete alignment.",
    "example": "We must make sure the lenders are on the same page regarding debt covenants."
  },
  {
    "phrase": "Game changer",
    "context": "A revolutionary development.",
    "example": "Blinkit's quick-commerce model has been a game changer for FMCG brand discovery."
  },
  {
    "phrase": "Bandwidth",
    "context": "Capacity to take on more work.",
    "example": "The analyst has no bandwidth to run another DCF sensitivity model today."
  },
  {
    "phrase": "Siloed thinking",
    "context": "Uncollaborative department mindset.",
    "example": "Siloed thinking is why the marketing team didn't check the finance team's payback cycles."
  },
  {
    "phrase": "Think outside the box",
    "context": "Creative, non-standard approaches.",
    "example": "We need to think outside the box to bypass high Google CPM rates."
  },
  {
    "phrase": "Paradigm shift",
    "context": "Fundamental change in assumptions.",
    "example": "Quick-commerce is a paradigm shift in urban grocery distribution."
  },
  {
    "phrase": "Deep dive",
    "context": "Thorough, detailed audit.",
    "example": "We will run a deep dive on the contract manufacturing agreement."
  },
  {
    "phrase": "Buy-in",
    "context": "Stakeholder agreement and support.",
    "example": "Without promoter buy-in, the demerger plan cannot proceed."
  },
  {
    "phrase": "Table the discussion",
    "context": "Postponing a topic to a future meeting.",
    "example": "Let's table the discussion on the employee stock option plan until Q3."
  }
];

export const commonMistakesList = [
  {
    "topic": "Revert back",
    "wrong": "Please revert back with the audited statements.",
    "right": "Please revert with the audited statements.",
    "explanation": "Revert means to return or reply; adding 'back' is a redundancy."
  },
  {
    "topic": "Reply back",
    "wrong": "I will reply back to the client email tomorrow.",
    "right": "I will reply to the client email tomorrow.",
    "explanation": "Reply implies sending a message back; 'back' is superfluous."
  },
  {
    "topic": "Discuss about",
    "wrong": "We need to discuss about the demerger plan.",
    "right": "We need to discuss the demerger plan.",
    "explanation": "Discuss means to talk about; using both is grammatically redundant."
  },
  {
    "topic": "Copied from Wren & Martin",
    "wrong": "The grammar rule was copied from Wren & Martin.",
    "right": "The grammar rule was sourced from Wren & Martin.",
    "explanation": "Use active, professional sourcing terminology instead of 'copied'."
  },
  {
    "topic": "Share out",
    "wrong": "Let's share out the equity among the promoters.",
    "right": "Let's share the equity among the promoters.",
    "explanation": "'Share' alone is sufficient; 'out' is redundant in corporate reporting."
  },
  {
    "topic": "Could care less",
    "wrong": "I could care less about the competitor's ad campaign.",
    "right": "I couldn't care less about the competitor's ad campaign.",
    "explanation": "'Could care less' implies you do care some; 'couldn't care less' means complete indifference."
  },
  {
    "topic": "Irregardless",
    "wrong": "Irregardless of the WACC level, the deal goes through.",
    "right": "Regardless of the WACC level, the deal goes through.",
    "explanation": "'Irregardless' is double-negative slang; use 'regardless' or 'irrespective'."
  },
  {
    "topic": "Supposably",
    "wrong": "The transaction is supposably cash-settled.",
    "right": "The transaction is supposedly cash-settled.",
    "explanation": "'Supposably' is a non-standard word; 'supposedly' is correct."
  },
  {
    "topic": "Alot",
    "wrong": "The D2C brand spends alot of capital on Meta ads.",
    "right": "The D2C brand spends a lot of capital on Meta ads.",
    "explanation": "'A lot' is always two distinct words."
  },
  {
    "topic": "I and my colleague",
    "wrong": "I and my colleague ran the sensitivity analysis.",
    "right": "My colleague and I ran the sensitivity analysis.",
    "explanation": "Follow pronoun courtesy by placing the other person first."
  }
];
