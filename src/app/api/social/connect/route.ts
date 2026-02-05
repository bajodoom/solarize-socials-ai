import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await req.json()
    const { platform, accountId, accountName, accessToken, refreshToken, expiresAt } = body

    if (!platform || !accountId || !accountName || !accessToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const socialAccount = await prisma.socialAccount.upsert({
      where: {
        userId_platform_accountId: {
          userId: user.id,
          platform,
          accountId,
        },
      },
      update: {
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        accountName,
      },
      create: {
        userId: user.id,
        platform,
        accountId,
        accountName,
        accessToken,
        refreshToken,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    return NextResponse.json(socialAccount)
  } catch (error) {
    console.error('Error connecting social account:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to connect account' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        socialAccounts: {
          select: {
            id: true,
            platform: true,
            accountId: true,
            accountName: true,
            createdAt: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user.socialAccounts)
  } catch (error) {
    console.error('Error fetching social accounts:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}
