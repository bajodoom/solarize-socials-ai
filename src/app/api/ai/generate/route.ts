import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateContent } from '@/lib/ai/content-generator'
import { fetchTrends } from '@/lib/ai/trend-integrator'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { topic, platform, tone, includeTrends, variations } = body

    if (!topic || !platform || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, platform, tone' },
        { status: 400 }
      )
    }

    let trends = []
    if (includeTrends) {
      trends = await fetchTrends(platform)
    }

    const result = await generateContent({
      topic,
      platform,
      tone,
      includeTrends,
      variations: variations || 3,
      trends,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in generate API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate content' },
      { status: 500 }
    )
  }
}
