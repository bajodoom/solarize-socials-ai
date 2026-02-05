import { Queue, Worker, Job } from 'bullmq'
import IORedis from 'ioredis'
import { prisma } from '@/lib/db'
import { publishToTwitter } from './twitter'
import { publishToLinkedIn } from './linkedin'
import { publishToFacebook } from './facebook'
import { publishToInstagram } from './instagram'

// Redis connection
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

// Create queue for scheduled posts
export const postQueue = new Queue('social-posts', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
})

export interface PostJobData {
  postId: string
  platforms: string[]
  userId: string
}

// Schedule a post
export async function schedulePost(
  postId: string,
  scheduledTime: Date,
  platforms: string[],
  userId: string
): Promise<string> {
  const delay = scheduledTime.getTime() - Date.now()

  if (delay < 0) {
    throw new Error('Scheduled time must be in the future')
  }

  const job = await postQueue.add(
    'publish-post',
    {
      postId,
      platforms,
      userId,
    } as PostJobData,
    {
      delay,
      jobId: `post-${postId}`,
    }
  )

  // Update post status to scheduled
  await prisma.post.update({
    where: { id: postId },
    data: {
      status: 'scheduled',
      scheduledFor: scheduledTime,
    },
  })

  return job.id || postId
}

// Publish post immediately
export async function publishPostNow(
  postId: string,
  platforms: string[],
  userId: string
): Promise<{ success: boolean; results: Record<string, any> }> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: {
        include: {
          socialAccounts: true,
        },
      },
    },
  })

  if (!post) {
    throw new Error('Post not found')
  }

  const results: Record<string, any> = {}

  for (const platform of platforms) {
    try {
      const account = post.user.socialAccounts.find(
        (acc) => acc.platform === platform
      )

      if (!account) {
        results[platform] = {
          success: false,
          error: `No connected account for ${platform}`,
        }
        continue
      }

      let result
      switch (platform) {
        case 'twitter':
          result = await publishToTwitter(post, account)
          break
        case 'linkedin':
          result = await publishToLinkedIn(post, account)
          break
        case 'facebook':
          result = await publishToFacebook(post, account)
          break
        case 'instagram':
          result = await publishToInstagram(post, account)
          break
        default:
          result = { success: false, error: 'Unknown platform' }
      }

      results[platform] = result
    } catch (error) {
      results[platform] = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Update post status
  const allSuccessful = Object.values(results).every((r: any) => r.success)
  await prisma.post.update({
    where: { id: postId },
    data: {
      status: allSuccessful ? 'posted' : 'failed',
      postedAt: allSuccessful ? new Date() : null,
    },
  })

  return {
    success: allSuccessful,
    results,
  }
}

// Create worker to process scheduled posts
export function createPostWorker() {
  const worker = new Worker<PostJobData>(
    'social-posts',
    async (job: Job<PostJobData>) => {
      const { postId, platforms, userId } = job.data

      console.log(`Processing scheduled post: ${postId}`)

      const result = await publishPostNow(postId, platforms, userId)

      if (!result.success) {
        throw new Error(
          `Failed to publish to some platforms: ${JSON.stringify(result.results)}`
        )
      }

      return result
    },
    {
      connection,
      concurrency: 5,
      limiter: {
        max: 10,
        duration: 1000,
      },
    }
  )

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`)
  })

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err)
  })

  return worker
}

// Remove a scheduled post from queue
export async function cancelScheduledPost(postId: string): Promise<boolean> {
  try {
    const job = await postQueue.getJob(`post-${postId}`)
    if (job) {
      await job.remove()
      
      // Update post status
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: 'draft',
          scheduledFor: null,
        },
      })
      
      return true
    }
    return false
  } catch (error) {
    console.error('Error canceling scheduled post:', error)
    return false
  }
}
