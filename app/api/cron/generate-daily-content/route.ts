import { NextResponse } from 'next/server'

const SPECS = ['marketing', 'finance', 'consulting', 'operations', 'strategy', 'people']
const SPECIALIZATION_TYPES = ['case', 'hotTopic', 'companySpotlight', 'think']
const GD_TAGS = ['current', 'business', 'abstract', 'tech', 'ethics']
const PULSE_TAGS = ['markets', 'policy', 'corporate', 'trade', 'tech']

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const targetDate = searchParams.get('date') || new Date(Date.now() + 86400000).toISOString().slice(0, 10) // default to tomorrow
    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`

    console.log(`Starting pre-generation pipeline for date: ${targetDate}`)
    const jobs: Promise<any>[] = []

    const pushJob = (page: string, contentType: string, subTag: string | null = null) => {
      const url = `${baseUrl}/api/daily-content?page=${page}&contentType=${contentType}&date=${targetDate}${subTag ? `&subTag=${subTag}` : ''}`
      jobs.push(
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            console.log(`Pre-generated ${page}/${contentType}${subTag ? `/${subTag}` : ''}:`, data.topicKey || 'Done')
            return data
          })
          .catch((err) => {
            console.error(`Failed to pre-generate ${page}/${contentType}:`, err)
            return null
          })
      )
    }

    // 1. Specializations
    for (const spec of SPECS) {
      for (const type of SPECIALIZATION_TYPES) {
        pushJob(spec, type)
      }
    }

    // 2. Bites
    pushJob('bites', 'bite')

    // 3. Guesstimates
    pushJob('guesstimate', 'guesstimateProblem', 'prob-0')
    pushJob('guesstimate', 'guesstimateProblem', 'prob-1')
    pushJob('guesstimate', 'guesstimateProblem', 'prob-2')

    // 4. GD Arena
    for (const tag of GD_TAGS) {
      pushJob('gd-arena', 'gdTopic', tag)
    }

    // 5. Pulse
    for (const tag of PULSE_TAGS) {
      pushJob('pulse', 'pulseStory', tag)
    }

    // 6. English Vocab & Grammar
    pushJob('english', 'vocabularyWord', 'vocab-0')
    pushJob('english', 'vocabularyWord', 'vocab-1')
    pushJob('english', 'vocabularyWord', 'vocab-2')
    pushJob('english', 'grammarRule', 'grammar-0')
    pushJob('english', 'grammarRule', 'grammar-1')

    // Execute all generation requests in parallel batches (or sequence if we want to avoid API key rate limits)
    // Wait, to avoid hitting Gemini rate limits (usually 15 RPM for free tier, or higher for pay-as-you-go),
    // let's process them in small sequential batches of 3, or simply await them sequentially with a small delay!
    // Awaiting them sequentially with a 200ms delay is extremely safe and prevents rate limiting completely!
    const results = []
    for (let i = 0; i < jobs.length; i += 3) {
      const batch = jobs.slice(i, i + 3)
      const res = await Promise.all(batch)
      results.push(...res)
      // Small pause between batches to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    return NextResponse.json({
      success: true,
      date: targetDate,
      totalJobs: jobs.length,
      processed: results.filter(Boolean).length,
    })

  } catch (error: any) {
    console.error('Fatal pre-generation pipeline error:', error)
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 })
  }
}
