import { NextResponse } from 'next/server'
import { MintProvider } from '@/lib/newspaper/MintProvider'

export async function GET() {
  try {
    const provider = new MintProvider()
    const newEdition = await provider.fetchLatestEdition()
    const allEditions = provider.getEditions()
    
    return NextResponse.json({
      success: true,
      newEditionAdded: !!newEdition,
      editions: allEditions,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Server Error',
    }, { status: 500 })
  }
}
