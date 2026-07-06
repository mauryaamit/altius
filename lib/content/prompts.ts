export function getPromptForContentType(
  page: string,
  contentType: string,
  subTag: string | null,
  exclusions: string[]
): string {
  const exclusionList = exclusions.length > 0 ? exclusions.join(', ') : 'None'

  switch (contentType) {
    case 'case':
      return `
        You are an elite Harvard/Wharton MBA Business Case Writer.
        Generate a comprehensive, GMAT/MBA-calibre Business Case Study for the domain: "${page}".
        
        DO NOT select or write about the following excluded companies/topics: [${exclusionList}].
        Pick a real, notable business or startup (e.g. Nykaa, Mamaearth, Reliance Retail, Paytm, Swiggy) that is NOT in the exclusion list.

        Format the output strictly as a JSON object matching this schema:
        {
          "company": "Company Name",
          "sector": "Sector / Industry (e.g. Beauty / E-commerce)",
          "background": "2-3 sentences background of the company and context.",
          "dataExhibits": [
            {
              "parameter": "Named metric parameter (e.g. EBITDA margin, GMV FY24)",
              "value": "Exact value (e.g. Rs. 10,300 Cr or 35%)",
              "source": { "id": 1, "source": "Specific source (e.g. Nykaa Annual Report)", "date": "YYYY-MM" },
              "sensitivity": "Sensitivity assessment (e.g. High / Medium / Low)"
            }
          ],
          "dilemma": "Clear, challenging strategic dilemma the company faces in 2-3 sentences.",
          "stakeholders": [
            { "name": "Stakeholder name/role", "role": "Role description", "interest": "Primary interest" }
          ],
          "lenses": {
            "strategy": "Analysis through strategic frameworks (e.g. Porter's Generic, Ansoff) in 2-3 sentences.",
            "finance": "Financial analysis (margins, cash burn, CapEx) in 2-3 sentences.",
            "marketing": "Marketing analysis (branding, SOW, customer acquisition) in 2-3 sentences.",
            "operations": "Operational analysis (supply chain, inventory, logistics) in 2-3 sentences."
          },
          "recommendation": "A precise, actionable recommendation in 2-3 sentences.",
          "commonMistakes": [
            "Mistake 1 to watch out for during interview analysis",
            "Mistake 2 to watch out for during interview analysis"
          ],
          "citations": [
            { "id": 1, "source": "Document or report name", "date": "Year" }
          ]
        }
      `

    case 'hotTopic':
      return `
        You are a leading Business Journalist and Policy Analyst.
        Generate an MBA-calibre Hot Topic briefing for the domain: "${page}".
        
        DO NOT select or write about the following excluded headlines/topics: [${exclusionList}].
        Pick a real, notable recent regulatory decision, market crash, acquisition, or policy change (e.g. SEBI IPO norms, RBI fintech actions) that is NOT in the exclusion list.

        Format the output strictly as a JSON object matching this schema:
        {
          "headline": "A punchy, informative news headline",
          "whatHappened": "2-3 sentences explaining the core event with dates and numbers.",
          "rootCause": "2-3 sentences explaining why this happened (market forces, regulatory gaps).",
          "stakeholders": [
            { "name": "Stakeholder entity", "gains": "What they gain from this", "loses": "What they lose from this" }
          ],
          "businessImplications": "2-3 sentences detailing how this affects industry margins, operations, or investment.",
          "scenarios": [
            { "label": "Best", "description": "1 sentence describing best case outcome." },
            { "label": "Worst", "description": "1 sentence describing worst case outcome." },
            { "label": "Likely", "description": "1 sentence describing most likely outcome." }
          ],
          "citations": [
            { "id": 1, "source": "News outlet or official release", "date": "YYYY-MM-DD" }
          ]
        }
      `

    case 'companySpotlight':
      return `
        You are a senior Equity Research Analyst.
        Generate a detailed Company Spotlight analysis for the domain: "${page}".
        
        DO NOT select or write about the following excluded companies: [${exclusionList}].
        Pick a notable company relevant to "${page}" that is NOT in the exclusion list.

        Format the output strictly as a JSON object matching this schema:
        {
          "companyName": "Company Name",
          "identity": "1 sentence describing their core value proposition / market identity.",
          "founded": 2012,
          "headquarters": "City, Country",
          "metrics": [
            { "label": "Metric name (e.g. Market Share, Active Users)", "value": "Value (e.g. 42% or 13 Mn)", "asOf": "Month Year", "citationId": 1 }
          ],
          "competitors": [
            { "name": "Competitor Name", "positioningNote": "How they contrast or position themselves against target." }
          ],
          "industryContext": "2-3 sentences of industry landscape and competitive intensity.",
          "functionLens": "2-3 sentences analyzing their strategies specific to ${page}.",
          "whyItMatters": "1-2 sentences on how to apply this case study in a Group Discussion or Interview.",
          "citations": [
            { "id": 1, "source": "SEC filing, annual report, or research note", "date": "Year" }
          ]
        }
      `

    case 'think':
      return `
        You are an elite McKinsey/BCG Interviewer.
        Generate a high-altitude Think Question for the domain: "${page}".
        
        DO NOT select or write about the following excluded questions/topics: [${exclusionList}].
        The question should be a challenging strategic prompt that tests executive decision-making.

        Format the output strictly as a JSON object matching this schema:
        {
          "question": "A challenging business question (e.g. 'A D2C skincare brand has a 4.5x CLV-to-CAC ratio online but is considering entering modern trade. Walk me through the risks.')",
          "modelAnswer": {
            "hook": "1-sentence punchy hook answer.",
            "plain": "2-3 sentences explaining the core logic using a simple analogy.",
            "depth": "400-500 words deep structural analysis with frameworks, real-world examples, and when this framework fails."
          },
          "alternatePerspective": "2-3 sentences explaining a contrarian view or alternative option.",
          "citations": [
            { "id": 1, "source": "Academic paper, book, or strategic report", "date": "Year" }
          ]
        }
      `

    case 'guesstimateProblem':
      return `
        You are a Consulting Case Interviewer.
        Generate a Guesstimate Problem.
        
        DO NOT select or write about the following excluded questions: [${exclusionList}].
        The problem should ask for a market sizing or volume calculation (e.g., 'Estimate the annual market size of passenger cars in India').

        Format the output strictly as a JSON object matching this schema:
        {
          "question": "The guesstimate question",
          "approach1": {
            "name": "Top-Down Approach (e.g. Population-based)",
            "rows": [
              { "parameter": "Parameter name (e.g. India population)", "value": "Value (e.g. 1.4 Bn)", "source": { "id": 1, "source": "Census or estimate", "date": "Year" }, "sensitivity": "Sensitivity level" }
            ],
            "result": "Final estimated result"
          },
          "approach2": {
            "name": "Bottom-Up Approach (e.g. Supply-side / Dealer-based)",
            "rows": [
              { "parameter": "Parameter name (e.g. Number of dealerships)", "value": "Value (e.g. 5,000)", "source": { "id": 2, "source": "Industry report", "date": "Year" }, "sensitivity": "Sensitivity level" }
            ],
            "result": "Final estimated result"
          },
          "citations": [
            { "id": 1, "source": "Source description", "date": "Year" }
          ]
        }
      `

    case 'gdTopic':
      return `
        You are a moderator at an elite IIM/ISB Group Discussion.
        Generate a Group Discussion (GD) Topic for the category: "${subTag || 'Current'}".
        
        DO NOT select or write about the following excluded topics: [${exclusionList}].
        
        Format the output strictly as a JSON object matching this schema:
        {
          "topic": "The GD topic statement (e.g. 'Is quick commerce destroying mom-and-pop Kirana stores?')",
          "tag": "${subTag || 'Current'}",
          "framing": "1-2 sentences framing the debate and setting context.",
          "forPoints": [
            { "point": "Strong point supporting the motion, including details or data." }
          ],
          "againstPoints": [
            { "point": "Strong point opposing the motion, including details or data." }
          ],
          "closingStructure": "1-2 sentences of structured summary layout.",
          "wayForward": "1-2 sentences on how a candidate should close with a balanced, collaborative view.",
          "citations": []
        }
      `

    case 'bite':
      return `
        You are a curator of cognitive mental models and economics.
        Generate a 'Bite' size learning entry.
        
        DO NOT select or write about the following excluded concepts: [${exclusionList}].
        Select a famous cognitive bias, economic effect, organizational law, or historical business paradigm (e.g., Giffen Good, Parkinson's Law, Goodhart's Law).

        Format the output strictly as a JSON object matching this schema:
        {
          "type": "Cognitive Bias / Economic Effect / Law / Food Origin",
          "name": "Name of the concept",
          "altitude": {
            "hook": "1-sentence hook explaining the essence of the concept.",
            "plain": "2-3 sentences explaining it simply with a relatable daily analogy.",
            "depth": "400-500 words of technical depth, detailing historical origin, mathematical/formal proof if applicable, business example, and when the model fails."
          },
          "citations": []
        }
      `

    case 'pulseStory':
      return `
        You are a Financial Times editor.
        Generate a Pulse news analysis story for the category: "${subTag || 'Markets'}".
        
        DO NOT select or write about the following excluded stories/headlines: [${exclusionList}].
        Select a recent global or domestic business event matching the category.

        Format the output strictly as a JSON object matching this schema:
        {
          "id": "pulse-${Date.now()}",
          "filter": "${subTag || 'Markets'}",
          "whatHappened": "2-3 sentences describing the news event.",
          "numbers": [
            { "stat": "Stat callout (e.g. inflation at 4.8%)", "citation": { "id": 1, "source": "Official source", "date": "Year" } }
          ],
          "whyItMatters": "2-3 sentences explaining macro or micro implications.",
          "sectorImpact": "1-2 sentences detailing specific stock sectors affected.",
          "forwardLookingLine": "1 sentence on the future outlook."
        }
      `

    case 'vocabularyWord':
      return `
        You are an English professor training corporate executives.
        Generate a vocabulary word entry.
        
        DO NOT select or write about the following excluded words: [${exclusionList}].
        Pick a sophisticated, high-value vocabulary word commonly used in strategy memos, corporate boardrooms, or economics (e.g., Anachronism, Hermeneutic, Epistemological, Hegemony).

        Format the output strictly as a JSON object matching this schema:
        {
          "word": "The word",
          "roots": "Etymology or root origin (e.g., from Greek hegemonia meaning leadership)",
          "definition": "Clear, concise dictionary definition.",
          "exampleSentence": "A sentence using it in a realistic business strategy memo or corporate environment.",
          "examples": ["Synonym/Usage 1", "Synonym/Usage 2"],
          "misuseNote": "A brief warning note explaining how it is commonly misused.",
          "usedIn": "Brief label (e.g., Used in strategy memos)"
        }
      `

    case 'grammarRule':
      return `
        You are a business writing editor.
        Generate a daily grammar rule.
        
        DO NOT select or write about the following excluded rules: [${exclusionList}].
        Pick a common mistake made by corporate writers (e.g., Affect vs Effect, Dangling modifiers, Its vs It's, Pronoun agreement).

        Format the output strictly as a JSON object matching this schema:
        {
          "rule": "The grammar rule title",
          "examples": ["Correct: ...", "Incorrect: ..."],
          "commonError": "1-2 sentences explaining why this mistake is made and how to avoid it.",
          "drill": {
            "sentence": "A test sentence for the user to practice.",
            "explanation": "Explanation of the correct answer."
          }
        }
      `

    default:
      throw new Error(`Unsupported content type: ${contentType}`)
  }
}
