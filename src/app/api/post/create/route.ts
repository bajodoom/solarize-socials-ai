import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { extractHashtags } from '@/lib/utils'

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
    const {
      content,
      variations,
      imageUrl,
      imagePrompt,
      platforms,
      aiPrompt,
      aiModel,
      trends,
    } = body

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: content, platforms' },
        { status: 400 }
      )
    }

    const hashtags = extractHashtags(content)

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        content,
        variations: variations || null,
        imageUrl: imageUrl || null,
        imagePrompt: imagePrompt || null,
        platforms,
        hashtags,
        aiPrompt: aiPrompt || null,
        aiModel: aiModel || null,
        trends: trends || null,
        status: 'draft',
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create post' },
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
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const posts = await prisma.post.findMany({
      where: {
        userId: user.id,
        ...(status && { status }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
