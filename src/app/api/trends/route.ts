import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchTrends } from '@/lib/ai/trend-integrator'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const platform = searchParams.get('platform') || 'twitter'

    const trends = await fetchTrends(platform)

    return NextResponse.json({ trends })
  } catch (error) {
    console.error('Error fetching trends:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch trends' },
      { status: 500 }
    )
  }
}
