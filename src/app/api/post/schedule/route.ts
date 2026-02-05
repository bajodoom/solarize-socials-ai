import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { schedulePost } from '@/lib/social/scheduler'

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
    const { postId, scheduledTime, platforms } = body

    if (!postId || !scheduledTime || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, scheduledTime, platforms' },
        { status: 400 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post || post.userId !== user.id) {
      return NextResponse.json(
        { error: 'Post not found or unauthorized' },
        { status: 404 }
      )
    }

    const jobId = await schedulePost(
      postId,
      new Date(scheduledTime),
      platforms,
      user.id
    )

    return NextResponse.json({
      success: true,
      jobId,
      scheduledFor: scheduledTime,
    })
  } catch (error) {
    console.error('Error scheduling post:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to schedule post' },
      { status: 500 }
    )
  }
}
