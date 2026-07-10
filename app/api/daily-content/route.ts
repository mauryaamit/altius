import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getPromptForContentType } from '@/lib/content/prompts'

// Fallback pools
import { marketingCase, marketingHotTopic, marketingThink, marketingCompany } from '@/lib/content/marketing'
import { financeCase, financeHotTopic, financeThink, financeCompany } from '@/lib/content/finance'
import { consultingCase, consultingHotTopic, consultingThink, consultingCompany } from '@/lib/content/consulting'
import { operationsCase, operationsHotTopic, operationsThink, operationsCompany } from '@/lib/content/operations'
import { strategyCase, strategyHotTopic, strategyThink, strategyCompany } from '@/lib/content/strategy'
import { peopleCase, peopleHotTopic, peopleThink, peopleCompany } from '@/lib/content/people'
import { guesstimateProblemPool, interpretPool } from '@/lib/content/guesstimate'
import { gdTopicPool } from '@/lib/content/gd'
import { pulseStories } from '@/lib/content/pulse'
import { bitesEntries } from '@/lib/content/bites'
import { vocabularyPool, grammarPool } from '@/lib/content/english'

const staticCases: any = { marketing: marketingCase, finance: financeCase, consulting: consultingCase, operations: operationsCase, strategy: strategyCase, people: peopleCase }
const staticHotTopics: any = { marketing: marketingHotTopic, finance: financeHotTopic, consulting: consultingHotTopic, operations: operationsHotTopic, strategy: strategyHotTopic, people: peopleHotTopic }
const staticCompanies: any = { marketing: marketingCompany, finance: financeCompany, consulting: consultingCompany, operations: operationsCompany, strategy: strategyCompany, people: peopleCompany }
const staticThinks: any = { marketing: marketingThink, finance: financeThink, consulting: consultingThink, operations: operationsThink, strategy: strategyThink, people: peopleThink }

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page') || ''
    const contentType = searchParams.get('contentType') || ''
    const subTag = searchParams.get('subTag') || ''
    const date = searchParams.get('date') || new Date().toISOString().slice(0, 10)

    if (!page || !contentType) {
      return NextResponse.json({ error: 'Missing page or contentType parameter.' }, { status: 400 })
    }

    const docId = subTag ? `${page}_${contentType}_${subTag}_${date}` : `${page}_${contentType}_${date}`

    // 1. Check if content already exists in Firestore (Global Cache)
    const cachedDocRef = doc(db, 'daily_content', docId)
    const cachedSnap = await getDoc(cachedDocRef)
    if (cachedSnap.exists()) {
      const data = cachedSnap.data()
      // Normalize 'content' to 'contentBody' if needed
      if (data && !data.contentBody && data.content) {
        data.contentBody = data.content
      }
      return NextResponse.json(data)
    }

    // 2. Not found in Firestore: Generate using Gemini API
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Falling back to static content.')
      return returnFallback(page, contentType, subTag, date, docId)
    }

    // A. Query exclusion list of already used topic keys
    let exclusions: string[] = []
    try {
      const ledgerRef = collection(db, 'content_ledger')
      const ledgerQuery = query(
        ledgerRef,
        where('page', '==', page),
        where('contentType', '==', contentType),
        where('subTag', '==', subTag || null)
      )
      const ledgerSnap = await getDocs(ledgerQuery)
      exclusions = ledgerSnap.docs.map((d) => d.data().topicKey).filter(Boolean)
    } catch (err) {
      console.error('Failed to load ledger exclusions:', err)
    }

    const ai = new GoogleGenAI({ apiKey })
    let attempts = 0
    let generatedObject: any = null
    let topicKey = ''

    while (attempts < 2) {
      attempts++
      try {
        const prompt = getPromptForContentType(page, contentType, subTag, exclusions)
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        })

        const rawJson = response.text || '{}'
        generatedObject = JSON.parse(rawJson)

        // Extract topic key to register for repetition checks
        topicKey = 
          generatedObject.company || 
          generatedObject.headline || 
          generatedObject.companyName || 
          generatedObject.question || 
          generatedObject.topic ||
          generatedObject.name ||
          generatedObject.id ||
          generatedObject.word ||
          generatedObject.rule ||
          ''

        // Collision check
        if (topicKey && exclusions.includes(topicKey)) {
          console.warn(`Gemini generated duplicate topic key: ${topicKey}. Retrying...`)
          exclusions.push(topicKey) // Add to temp exclusions list to force variety
          continue
        }

        break // Successfully parsed & collision cleared
      } catch (err) {
        console.error(`Gemini generation attempt ${attempts} failed:`, err)
      }
    }

    if (!generatedObject) {
      console.warn('Gemini generation failed both attempts. Falling back to static.')
      return returnFallback(page, contentType, subTag, date, docId)
    }

    // 3. Save generated content to Firestore daily_content and ledger
    const payload = {
      id: docId,
      page,
      contentType,
      subTag: subTag || null,
      date,
      topicKey,
      contentBody: generatedObject,
    }

    await setDoc(cachedDocRef, payload)

    // Save to ledger to prevent future repetition
    if (topicKey) {
      const ledgerDocRef = doc(collection(db, 'content_ledger'))
      await setDoc(ledgerDocRef, {
        page,
        contentType,
        subTag: subTag || null,
        topicKey,
        date,
      })
    }

    return NextResponse.json(payload)

  } catch (error: any) {
    console.error('Fatal daily-content route error:', error)
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 })
  }
}

// Graceful fallback to avoid error states
async function returnFallback(
  page: string,
  contentType: string,
  subTag: string | null,
  date: string,
  docId: string
) {
  let fallbackBody: any = null

  if (contentType === 'case') {
    fallbackBody = staticCases[page] || marketingCase
  } else if (contentType === 'hotTopic') {
    fallbackBody = staticHotTopics[page] || marketingHotTopic
  } else if (contentType === 'companySpotlight') {
    fallbackBody = staticCompanies[page] || marketingCompany
  } else if (contentType === 'think') {
    fallbackBody = staticThinks[page] || marketingThink
  } else if (contentType === 'guesstimateProblem') {
    fallbackBody = guesstimateProblemPool[0]
  } else if (contentType === 'gdTopic') {
    fallbackBody = gdTopicPool.find((t) => t.tag.toLowerCase() === (subTag || '').toLowerCase()) || gdTopicPool[0]
  } else if (contentType === 'bite') {
    fallbackBody = bitesEntries[0]
  } else if (contentType === 'pulseStory') {
    fallbackBody = pulseStories.find((p) => p.filter.toLowerCase() === (subTag || '').toLowerCase()) || pulseStories[0]
  } else if (contentType === 'vocabularyWord') {
    fallbackBody = vocabularyPool[0]
  } else if (contentType === 'grammarRule') {
    fallbackBody = grammarPool[0]
  }

  if (!fallbackBody) {
    fallbackBody = { name: 'Fallback item', description: 'Graceful degradation fallback.' }
  }

  const payload = {
    id: docId,
    page,
    contentType,
    subTag: subTag || null,
    date,
    topicKey: 'static-fallback',
    contentBody: fallbackBody,
    isFallback: true,
  }

  // Optionally cache the fallback in Firestore so next reads are instant
  try {
    const cachedDocRef = doc(db, 'daily_content', docId)
    await setDoc(cachedDocRef, payload)
  } catch (err) {
    console.error('Failed to cache fallback:', err)
  }

  return NextResponse.json(payload)
}
